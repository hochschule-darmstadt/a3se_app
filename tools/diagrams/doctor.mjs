import { existsSync, readFileSync } from 'node:fs';
import { execFileSync, spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '../..');
const versions = JSON.parse(readFileSync(resolve(import.meta.dirname, 'versions.json')));
const failures = [];
const mermaidCli = resolve(root, 'node_modules/@mermaid-js/mermaid-cli/src/cli.js');
const bpmnLintCli = resolve(root, 'node_modules/bpmnlint/bin/bpmnlint.js');
const bpmnJsPackage = resolve(root, 'node_modules/bpmn-js/package.json');
const puppeteerPackage = resolve(root, 'node_modules/puppeteer/package.json');

function check(label, command, args, expected) {
  const result = spawnSync(command, args, { cwd: root, encoding: 'utf8', shell: false });
  const output = `${result.stdout ?? ''}${result.stderr ?? ''}`.trim();
  if (result.status !== 0 || (expected && !output.includes(expected))) failures.push(`${label}: ${output || 'not available'}`);
  else console.log(`OK ${label}: ${output.split('\n')[0]}`);
}

check('Node.js', process.execPath, ['--version'], 'v22.');
check('Mermaid CLI', process.execPath, [mermaidCli, '--version'], versions.mermaidCli);
check('bpmnlint', process.execPath, [bpmnLintCli, '--version'], versions.bpmnlint);
for (const [label, packagePath, expected] of [
  ['bpmn-js', bpmnJsPackage, versions.bpmnJs],
  ['Puppeteer', puppeteerPackage, versions.puppeteer]
]) {
  if (!existsSync(packagePath)) failures.push(`${label}: not available`);
  else {
    const installed = JSON.parse(readFileSync(packagePath)).version;
    if (installed === expected) console.log(`OK ${label}: ${installed}`);
    else failures.push(`${label}: expected ${expected}, found ${installed}`);
  }
}

const jar = resolve(root, '.diagram-tools/plantuml.jar');
if (existsSync(jar)) check('PlantUML', 'java', ['-jar', jar, '-version'], versions.plantuml.version);
else failures.push('PlantUML: run the diagram install script');

try {
  const image = execFileSync('docker', ['image', 'inspect', versions.structurizrImage, '--format', '{{.RepoTags}}'], { encoding: 'utf8' });
  console.log(`OK Structurizr: ${image.trim()}`);
} catch {
  failures.push(`Structurizr: pull ${versions.structurizrImage}`);
}

if (failures.length) {
  console.error(`\nDiagram toolchain is incomplete:\n- ${failures.join('\n- ')}`);
  process.exit(1);
}
