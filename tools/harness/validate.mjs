import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { basename, dirname, extname, relative, resolve, sep } from 'node:path';

const root = resolve(import.meta.dirname, '../..');
const docs = resolve(root, 'docs');
const decisionDirectory = resolve(docs, 'governance/decisions');
const issueTemplateDirectory = resolve(root, '.github/ISSUE_TEMPLATE');
const ignoredDirectories = new Set(['.git', '.diagram-tools', 'node_modules']);
const knownPrefixes = ['ACT', 'UC', 'FR', 'NFR', 'SE', 'CON'];
const authoritativeDefinitions = new Map([
  ['ACT', 'docs/requirements/actors.md'],
  ['UC', 'docs/requirements/use-cases/use-cases.md'],
  ['FR', 'docs/requirements/functional-requirements.md'],
  ['NFR', 'docs/requirements/non-functional-requirements.md'],
  ['SE', 'docs/requirements/scope-exclusions.md'],
  ['CON', 'docs/requirements/constraints.md'],
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

function walkDirectories(directory) {
  const directories = [directory];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (!entry.isDirectory() || ignoredDirectories.has(entry.name)) continue;
    directories.push(...walkDirectories(resolve(directory, entry.name)));
  }
  return directories;
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
for (const directory of walkDirectories(docs)) {
  const readme = resolve(directory, 'README.md');
  if (!existsSync(readme)) {
    error(directory, 0, 'directory has no README.md');
    continue;
  }
  const routing = readFileSync(readme, 'utf8');
  const topicDeclaration = routing.match(/^- Topic document: \[[^\]]+\]\(([^)]+)\)\s*$/mu);
  const expectedName = `${basename(directory)}.md`;
  const sameNamedTopic = resolve(directory, expectedName);
  if (existsSync(sameNamedTopic) && !topicDeclaration) {
    error(readme, 0, `must declare same-named topic document ${expectedName}`);
    continue;
  }
  if (topicDeclaration) {
    if (topicDeclaration[1] !== expectedName) {
      error(readme, 0, `declares topic document ${topicDeclaration[1]}; expected ${expectedName}`);
      continue;
    }
    if (!existsSync(resolve(directory, expectedName))) {
      error(readme, 0, `declares missing topic document ${expectedName}`);
    }
  }
}
const definitions = new Map();
const references = new Map();
const prefixAlternation = knownPrefixes.join('|');
const idPattern = new RegExp(`\\b(${prefixAlternation})-(\\d+)\\b`, 'gu');
const tableDefinitionPattern = new RegExp(
  `^\\s*\\|\\s*((?:${prefixAlternation})-\\d{3,})\\s*\\|`,
  'u'
);
const headingDefinitionPattern = new RegExp(
  `^#{1,6}\\s+((?:${prefixAlternation})-\\d{3,})\\b`,
  'u'
);

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

    const tableDefinition = line.match(tableDefinitionPattern);
    const headingDefinition = line.match(headingDefinitionPattern);
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

const decisionFiles = readdirSync(decisionDirectory)
  .filter((name) => /^\d{4}-.+\.md$/u.test(name))
  .sort();
const decisionIndexFile = resolve(decisionDirectory, 'README.md');
const decisionIndex = readFileSync(decisionIndexFile, 'utf8');
const indexedDecisions = new Map();

for (const [offset, line] of decisionIndex.split(/\r?\n/u).entries()) {
  const match = line.match(
    /^\|\s*\[(DR-(\d{4}))\]\(([^)]+)\)\s*\|\s*[^|]+\|\s*([^|]+)\|/u
  );
  if (!match) continue;
  const [, id, number, filename, status] = match;
  if (indexedDecisions.has(number)) {
    error(decisionIndexFile, offset + 1, `duplicates decision number ${number} in the index`);
  }
  indexedDecisions.set(number, { id, filename, status: status.trim(), line: offset + 1 });
}

for (const filename of decisionFiles) {
  const file = resolve(decisionDirectory, filename);
  const number = filename.slice(0, 4);
  const markdown = readFileSync(file, 'utf8');
  const heading = markdown.match(/^# (DR-(\d{4})):/u);
  if (!heading || heading[2] !== number) error(file, 1, `heading does not match decision number ${number}`);
  const status = markdown.match(/^- Status:\s*([a-z]+)\s*$/mu)?.[1];
  if (!status) error(file, 0, 'has no valid status metadata');
  const indexed = indexedDecisions.get(number);
  if (!indexed) {
    error(decisionIndexFile, 0, `does not index decision number ${number}`);
    continue;
  }
  if (heading && indexed.id !== heading[1]) {
    error(decisionIndexFile, indexed.line, `indexes ${indexed.id}, expected ${heading[1]}`);
  }
  if (indexed.filename !== filename) {
    error(decisionIndexFile, indexed.line, `links decision ${number} to ${indexed.filename}, expected ${filename}`);
  }
  if (status && indexed.status !== status) {
    error(decisionIndexFile, indexed.line, `lists decision ${number} as ${indexed.status}, expected ${status}`);
  }
}

for (const [number, indexed] of indexedDecisions) {
  if (!decisionFiles.some((filename) => filename.startsWith(`${number}-`))) {
    error(decisionIndexFile, indexed.line, `indexes missing decision number ${number}`);
  }
}

const issueTemplatePairs = [
  {
    canonical: 'docs/governance/templates/task.md',
    form: '.github/ISSUE_TEMPLATE/00-task.yml',
    label: 'task'
  },
  {
    canonical: 'docs/governance/templates/epic.md',
    form: '.github/ISSUE_TEMPLATE/01-epic.yml',
    label: 'epic'
  },
  {
    canonical: 'docs/governance/templates/feature.md',
    form: '.github/ISSUE_TEMPLATE/02-feature.yml',
    label: 'feature'
  },
  {
    canonical: 'docs/governance/templates/story.md',
    form: '.github/ISSUE_TEMPLATE/03-story.yml',
    label: 'story'
  },
  {
    canonical: 'docs/governance/templates/bug.md',
    form: '.github/ISSUE_TEMPLATE/02-bug.yml',
    label: 'bug'
  }
];

for (const pair of issueTemplatePairs) {
  const canonicalFile = resolve(root, pair.canonical);
  const formFile = resolve(root, pair.form);
  if (!existsSync(canonicalFile)) error(canonicalFile, 0, 'canonical issue template is missing');
  if (!existsSync(formFile)) {
    error(formFile, 0, 'GitHub issue form is missing');
    continue;
  }
  const form = readFileSync(formFile, 'utf8');
  if (form.split(/\r?\n/u)[0] !== `# Canonical source: ${pair.canonical}`) {
    error(formFile, 1, `must reference canonical source ${pair.canonical}`);
  }
  if (!new RegExp(`^\\s+- ${pair.label}\\s*$`, 'mu').test(form)) {
    error(formFile, 0, `does not apply expected label ${pair.label}`);
  }
  if (!/^\s+- hochschule-darmstadt\/2\s*$/mu.test(form)) {
    error(formFile, 0, 'does not add new issues to the governed GitHub Project');
  }
  if (!/^body:\s*$/mu.test(form)) error(formFile, 0, 'has no issue-form body');
}

const issueChooserFile = resolve(issueTemplateDirectory, 'config.yml');
if (!existsSync(issueChooserFile)) {
  error(issueChooserFile, 0, 'GitHub issue chooser configuration is missing');
} else {
  const issueChooser = readFileSync(issueChooserFile, 'utf8');
  if (!/^blank_issues_enabled:\s*false\s*$/mu.test(issueChooser)) {
    error(issueChooserFile, 0, 'must disable blank issues');
  }
}

if (errors.length) {
  console.error(errors.map((message) => `FAIL ${message}`).join('\n'));
  process.exit(1);
}

console.log(
  `OK harness integrity: ${markdownFiles.length} Markdown files, ${definitions.size} stable IDs, ${decisionFiles.length} decision records`
);
