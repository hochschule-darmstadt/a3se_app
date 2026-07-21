import { mkdirSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { basename, extname, relative, resolve, sep } from 'node:path';
import { findFiles } from './lib.mjs';

const root = resolve(import.meta.dirname, '../..');
const temp = resolve(import.meta.dirname, '.tmp');
const jar = resolve(root, '.diagram-tools/plantuml.jar');
const inputs = findFiles(root, ['.puml', '.mmd', '.bpmn']);
const workspaces = findFiles(root, ['workspace.dsl']);
let failed = false;
const mermaidCli = resolve(root, 'node_modules/@mermaid-js/mermaid-cli/src/cli.js');
const bpmnLintCli = resolve(root, 'node_modules/bpmnlint/bin/bpmnlint.js');

rmSync(temp, { recursive: true, force: true });
mkdirSync(temp, { recursive: true });

function run(label, command, args) {
  const result = spawnSync(command, args, { cwd: root, encoding: 'utf8', shell: false });
  if (result.status !== 0) {
    failed = true;
    console.error(`FAIL ${label}\n${result.stdout ?? ''}${result.stderr ?? ''}`);
  } else console.log(`OK ${label}`);
}

for (const input of inputs) {
  const extension = extname(input);
  if (extension === '.puml') run(input, 'java', ['-jar', jar, '-checkonly', input]);
  if (extension === '.mmd') {
    const output = resolve(temp, `${basename(input, extension)}.svg`);
    run(input, process.execPath, [mermaidCli, '--input', input, '--output', output, '--quiet']);
  }
  if (extension === '.bpmn') run(input, process.execPath, [bpmnLintCli, input]);
}

for (const workspace of workspaces) {
  const containerPath = relative(root, workspace).split(sep).join('/');
  run(workspace, 'docker', [
    'run', '--rm',
    '--volume', `${root}:/usr/local/structurizr`,
    'structurizr/structurizr:2026.06.28-playwright',
    'validate', '-workspace', containerPath
  ]);
}

if (!inputs.length && !workspaces.length) console.log('No diagram sources yet; tool availability is checked separately.');
rmSync(temp, { recursive: true, force: true });
if (failed) process.exit(1);
