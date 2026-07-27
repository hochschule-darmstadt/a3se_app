import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, extname, relative, resolve, sep } from 'node:path';

const root = resolve(import.meta.dirname, '../..');
const docs = resolve(root, 'docs');
const adrDirectory = resolve(docs, 'governance/decisions');
const ignoredDirectories = new Set(['.git', '.diagram-tools', 'node_modules']);
const knownPrefixes = ['STK', 'PER', 'CAP', 'UC', 'US', 'FR', 'QR', 'CON', 'BR'];
const authoritativeDefinitions = new Map([
  ['STK', 'docs/product/stakeholders.md'],
  ['PER', 'docs/product/personas.md'],
  ['CAP', 'docs/product/requirements/capabilities.md'],
  ['UC', 'docs/product/requirements/use-cases.md'],
  ['US', 'docs/product/requirements/user-stories.md'],
  ['FR', 'docs/product/requirements/functional-requirements.md'],
  ['QR', 'docs/product/requirements/quality-requirements.md'],
  ['CON', 'docs/product/requirements/constraints.md'],
  ['BR', 'docs/product/domain/business-rules.md']
]);
const errors = [];

function projectPath(file) {
  return relative(root, file).split(sep).join('/');
}

function walk(directory) {
  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) files.push(...walk(path));
    else files.push(path);
  }
  return files;
}

function error(file, line, message) {
  const location = line ? `${projectPath(file)}:${line}` : projectPath(file);
  errors.push(`${location} ${message}`);
}

function inlineLinks(markdown) {
  const links = [];
  for (let cursor = 0; cursor < markdown.length - 1; cursor += 1) {
    if (markdown[cursor] !== ']' || markdown[cursor + 1] !== '(') continue;
    const start = cursor + 2;
    let depth = 1;
    let escaped = false;
    let end = start;
    for (; end < markdown.length; end += 1) {
      const character = markdown[end];
      if (escaped) {
        escaped = false;
        continue;
      }
      if (character === '\\') {
        escaped = true;
        continue;
      }
      if (character === '(') depth += 1;
      if (character === ')') {
        depth -= 1;
        if (depth === 0) break;
      }
    }
    if (depth !== 0) continue;
    let destination = markdown.slice(start, end).trim();
    if (destination.startsWith('<')) {
      const closing = destination.indexOf('>');
      destination = closing >= 0 ? destination.slice(1, closing) : destination;
    } else {
      destination = destination.split(/\s+(?=["'])/u)[0];
    }
    const line = markdown.slice(0, cursor).split('\n').length;
    links.push({ destination, line });
    cursor = end;
  }
  return links;
}

function validateLinks(file, markdown) {
  for (const { destination, line } of inlineLinks(markdown)) {
    if (
      !destination ||
      destination.startsWith('#') ||
      destination.startsWith('/') ||
      /^[a-z][a-z0-9+.-]*:/iu.test(destination)
    ) continue;
    const pathPart = destination.split('#')[0].split('?')[0];
    let decoded;
    try {
      decoded = decodeURIComponent(pathPart);
    } catch {
      error(file, line, `contains an invalid encoded link: ${destination}`);
      continue;
    }
    const target = resolve(dirname(file), decoded);
    if (!existsSync(target)) error(file, line, `links to missing target: ${destination}`);
  }
}

const markdownFiles = walk(root).filter((file) => extname(file).toLowerCase() === '.md');
const definitions = new Map();
const references = new Map();
const idPattern = new RegExp(`\\b(${knownPrefixes.join('|')})-(\\d+)\\b`, 'gu');

for (const file of markdownFiles) {
  const markdown = readFileSync(file, 'utf8');
  validateLinks(file, markdown);
  const lines = markdown.split(/\r?\n/u);
  for (const [offset, line] of lines.entries()) {
    const lineNumber = offset + 1;
    for (const match of line.matchAll(idPattern)) {
      const [id, prefix, digits] = match;
      if (digits.length < 3) error(file, lineNumber, `uses invalid stable ID ${id}; use at least three digits`);
      if (!references.has(id)) references.set(id, []);
      references.get(id).push({ file, line: lineNumber });
    }

    const tableDefinition = line.match(/^\s*\|\s*((?:STK|PER|CAP|UC|US|FR|QR|CON|BR)-\d{3,})\s*\|/u);
    const headingDefinition = line.match(/^#{1,6}\s+((?:STK|PER|CAP|UC|US|FR|QR|CON|BR)-\d{3,})\b/u);
    const id = tableDefinition?.[1] ?? headingDefinition?.[1];
    if (!id) continue;
    const prefix = id.split('-')[0];
    if (projectPath(file) !== authoritativeDefinitions.get(prefix)) continue;
    if (!definitions.has(id)) definitions.set(id, []);
    definitions.get(id).push({ file, line: lineNumber });
    if (/\b(?:to be (?:identified|discovered|elicited)|tbd|placeholder)\b/iu.test(line)) {
      error(file, lineNumber, `uses real stable ID ${id} for placeholder content`);
    }
  }
}

for (const [id, locations] of definitions) {
  if (locations.length < 2) continue;
  for (const location of locations) error(location.file, location.line, `duplicates stable ID ${id}`);
}

for (const [id, locations] of references) {
  if (definitions.has(id)) continue;
  for (const location of locations) error(location.file, location.line, `references undefined stable ID ${id}`);
}

const adrFiles = readdirSync(adrDirectory)
  .filter((name) => /^\d{4}-.+\.md$/u.test(name))
  .sort();
const adrIndexFile = resolve(adrDirectory, 'README.md');
const adrIndex = readFileSync(adrIndexFile, 'utf8');
const indexedAdrs = new Map();

for (const [offset, line] of adrIndex.split(/\r?\n/u).entries()) {
  const match = line.match(
    /^\|\s*\[ADR-(\d{4})\]\(([^)]+)\)\s*\|\s*[^|]+\|\s*([^|]+)\|/u
  );
  if (!match) continue;
  const [, number, filename, status] = match;
  if (indexedAdrs.has(number)) error(adrIndexFile, offset + 1, `duplicates ADR-${number} in the index`);
  indexedAdrs.set(number, { filename, status: status.trim(), line: offset + 1 });
}

for (const filename of adrFiles) {
  const file = resolve(adrDirectory, filename);
  const number = filename.slice(0, 4);
  const markdown = readFileSync(file, 'utf8');
  if (!markdown.startsWith(`# ADR-${number}:`)) error(file, 1, `heading does not match ADR-${number}`);
  const status = markdown.match(/^- Status:\s*([a-z]+)\s*$/mu)?.[1];
  if (!status) error(file, 0, 'has no valid status metadata');
  const indexed = indexedAdrs.get(number);
  if (!indexed) {
    error(adrIndexFile, 0, `does not index ADR-${number}`);
    continue;
  }
  if (indexed.filename !== filename) {
    error(adrIndexFile, indexed.line, `links ADR-${number} to ${indexed.filename}, expected ${filename}`);
  }
  if (status && indexed.status !== status) {
    error(adrIndexFile, indexed.line, `lists ADR-${number} as ${indexed.status}, expected ${status}`);
  }
}

for (const [number, indexed] of indexedAdrs) {
  if (!adrFiles.some((filename) => filename.startsWith(`${number}-`))) {
    error(adrIndexFile, indexed.line, `indexes missing ADR-${number}`);
  }
}

if (errors.length) {
  console.error(errors.map((message) => `FAIL ${message}`).join('\n'));
  process.exit(1);
}

console.log(
  `OK harness integrity: ${markdownFiles.length} Markdown files, ${definitions.size} stable IDs, ${adrFiles.length} ADRs`
);
