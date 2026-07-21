import { existsSync, mkdirSync, renameSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { basename, dirname, extname, resolve } from 'node:path';
import { renderBpmn } from './render-bpmn.mjs';

const root = resolve(import.meta.dirname, '../..');
const source = process.argv[2] ? resolve(process.argv[2]) : undefined;
const requestedOutput = process.argv[3] ? resolve(process.argv[3]) : undefined;

if (!source || !existsSync(source)) {
  console.error('Usage: npm run diagrams:render -- <source.puml|source.mmd|source.bpmn> [output.svg]');
  process.exit(2);
}

const extension = extname(source).toLowerCase();
const output = requestedOutput ?? resolve(dirname(source), `${basename(source, extension)}.svg`);
mkdirSync(dirname(output), { recursive: true });

function execute(command, args) {
  const result = spawnSync(command, args, { cwd: root, encoding: 'utf8', shell: false });
  if (result.status !== 0) {
    console.error(`${result.stdout ?? ''}${result.stderr ?? ''}`);
    process.exit(result.status ?? 1);
  }
}

if (extension === '.mmd') {
  execute(process.execPath, [resolve(root, 'node_modules/@mermaid-js/mermaid-cli/src/cli.js'), '--input', source, '--output', output, '--quiet']);
} else if (extension === '.bpmn') {
  await renderBpmn(source, output);
} else if (extension === '.puml') {
  execute('java', ['-jar', resolve(root, '.diagram-tools/plantuml.jar'), '-tsvg', '-o', dirname(output), source]);
  const generated = resolve(dirname(output), `${basename(source, extension)}.svg`);
  if (generated !== output) renameSync(generated, output);
} else {
  console.error(`Unsupported source extension: ${extension}`);
  process.exit(2);
}

console.log(output);
