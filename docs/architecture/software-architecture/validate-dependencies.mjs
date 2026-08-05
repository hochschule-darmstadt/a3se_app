import { readFileSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const directory = dirname(fileURLToPath(import.meta.url));
const overview = readFileSync(resolve(directory, 'software-architecture.drawio'), 'utf8');
const overviewText = overview
  .replaceAll('&amp;nbsp;', ' ')
  .replace(/&lt;.*?&gt;/gu, ' ')
  .replace(/\s+/gu, ' ');

const modules = new Map([
  ['MOD-CI', { name: 'Customer Interaction', layer: 0 }],
  ['MOD-SI', { name: 'Staff Interaction', layer: 0 }],
  ['MOD-SP', { name: 'Season Planning', layer: 1 }],
  ['MOD-PROC', { name: 'Procurement', layer: 1 }],
  ['MOD-TPD', { name: 'Touristic Product Design', layer: 1 }],
  ['MOD-SALES', { name: 'Sales', layer: 1 }],
  ['MOD-CARE', { name: 'Customer Care', layer: 1 }],
  ['MOD-CM', { name: 'Person Management', layer: 2 }],
  ['MOD-SM', { name: 'Partner Management', layer: 2 }],
  ['MOD-TPM', { name: 'Touristic Product Management', layer: 2 }],
  ['MOD-INV', { name: 'Inventory', layer: 2 }],
  ['MOD-OM', { name: 'Order Management', layer: 2 }],
  ['MOD-ACC', { name: 'Accounting', layer: 3 }],
  ['MOD-REP', { name: 'Reporting', layer: 3 }],
  ['MOD-HR', { name: 'Human Resources', layer: 3 }],
]);

for (const { name } of modules.values()) {
  if (!overviewText.includes(name)) {
    console.error(`Module missing from software-architecture.drawio: ${name}`);
    process.exit(1);
  }
}

const edges = new Set();
const activeUseCases = [];
for (const filename of readdirSync(directory).filter((name) => /^uc-\d{3}-.+\.puml$/u.test(name))) {
  const source = readFileSync(resolve(directory, filename), 'utf8');
  if (source.includes('Deprecated / Excluded')) continue;
  activeUseCases.push(filename);

  const aliases = new Map();
  for (const match of source.matchAll(/participant "(MOD-[A-Z]+)\\n[^"]+" as (\w+)/gu)) {
    if (!modules.has(match[1])) {
      console.error(`Unknown module ${match[1]} in ${filename}`);
      process.exit(1);
    }
    aliases.set(match[2], match[1]);
  }

  for (const match of source.matchAll(/^\s*(\w+)\s+->\s+(\w+):/gmu)) {
    const caller = aliases.get(match[1]);
    const receiver = aliases.get(match[2]);
    if (caller && receiver && caller !== receiver) edges.add(`${caller}->${receiver}`);
  }
}

if (activeUseCases.length !== 17) {
  console.error(`Expected 17 active use-case sequences, found ${activeUseCases.length}`);
  process.exit(1);
}

const upward = [...edges].filter((edge) => {
  const [caller, receiver] = edge.split('->');
  return modules.get(caller).layer > modules.get(receiver).layer;
});
if (upward.length) {
  console.error(`Upward layer dependencies: ${upward.sort().join(', ')}`);
  process.exit(1);
}

const indegree = new Map([...modules.keys()].map((module) => [module, 0]));
const outgoing = new Map([...modules.keys()].map((module) => [module, []]));
for (const edge of edges) {
  const [caller, receiver] = edge.split('->');
  outgoing.get(caller).push(receiver);
  indegree.set(receiver, indegree.get(receiver) + 1);
}

const ready = [...modules.keys()].filter((module) => indegree.get(module) === 0).sort();
const order = [];
while (ready.length) {
  const module = ready.shift();
  order.push(module);
  for (const receiver of outgoing.get(module).sort()) {
    indegree.set(receiver, indegree.get(receiver) - 1);
    if (indegree.get(receiver) === 0) {
      ready.push(receiver);
      ready.sort();
    }
  }
}

if (order.length !== modules.size) {
  const cyclic = [...modules.keys()].filter((module) => !order.includes(module)).sort();
  console.error(`Cyclic module dependencies involve: ${cyclic.join(', ')}`);
  process.exit(1);
}

console.log(`OK modular architecture: ${activeUseCases.length} active sequences, ${edges.size} module dependencies, no upward dependencies, acyclic order ${order.join(', ')}`);
