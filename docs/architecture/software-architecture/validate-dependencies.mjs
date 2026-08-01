import { readFileSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const directory = dirname(fileURLToPath(import.meta.url));
const overview = readFileSync(resolve(directory, 'modules.puml'), 'utf8');
const moduleInterfaces = new Map();

for (const match of overview.matchAll(
  /package "(MOD-[A-Z]+)\\n[^"]+" <<(?:external )?module>> \{\s*class (\w+) <<interface>>/gu
)) {
  moduleInterfaces.set(match[1], match[2]);
}

const derivedEdges = new Set();
for (const filename of readdirSync(directory).filter((name) => /^uc-\d{3}-.+\.puml$/u.test(name))) {
  const source = readFileSync(resolve(directory, filename), 'utf8');
  const aliases = new Map();
  for (const match of source.matchAll(/participant "(MOD-[A-Z]+)\\n[^"]+" as (\w+)/gu)) {
    aliases.set(match[2], match[1]);
  }
  for (const match of source.matchAll(/^\s*(\w+)\s+->\s+(\w+):/gmu)) {
    const caller = aliases.get(match[1]);
    const receiver = aliases.get(match[2]);
    if (caller && receiver && caller !== receiver) derivedEdges.add(`${caller}->${receiver}`);
  }
}

const declaredEdges = new Set();
const interfaceModules = new Map([...moduleInterfaces].map(([module, iface]) => [iface, module]));
for (const match of overview.matchAll(/^\s*(\w+)\s+(?:\.\.>|\.\[norank\]\.>)\s+(\w+)\s*$/gmu)) {
  const caller = interfaceModules.get(match[1]);
  const receiver = interfaceModules.get(match[2]);
  if (caller && receiver) declaredEdges.add(`${caller}->${receiver}`);
}

const portOwners = new Map([
  ['ProcurementSupplierPort', 'MOD-PROC'],
  ['ExecutionSupplierPort', 'MOD-EXEC'],
  ['TravelProductSupplierPort', 'MOD-TPM'],
  ['OrderSupplierPort', 'MOD-OM'],
  ['OrderSourcingPort', 'MOD-OM'],
]);
const adapterModules = new Map([
  ['SupplierAdapter', 'MOD-SUPI'],
  ['ProcurementAdapter', 'MOD-PROC'],
]);
const expectedImplementations = new Set([
  'SupplierAdapter->ProcurementSupplierPort',
  'SupplierAdapter->ExecutionSupplierPort',
  'SupplierAdapter->TravelProductSupplierPort',
  'SupplierAdapter->OrderSupplierPort',
  'ProcurementAdapter->OrderSourcingPort',
]);
const implementations = new Set();
for (const match of overview.matchAll(/^\s*(\w+)\s+\.\[norank\]\.\|>\s+(\w+)\s*$/gmu)) {
  implementations.add(`${match[1]}->${match[2]}`);
}
const missingImplementations = [...expectedImplementations].filter((item) => !implementations.has(item)).sort();
const unsupportedImplementations = [...implementations].filter((item) => !expectedImplementations.has(item)).sort();
if (missingImplementations.length || unsupportedImplementations.length) {
  if (missingImplementations.length) console.error(`Missing port implementations: ${missingImplementations.join(', ')}`);
  if (unsupportedImplementations.length) console.error(`Unexpected port implementations: ${unsupportedImplementations.join(', ')}`);
  process.exit(1);
}

const missing = [...derivedEdges].filter((edge) => !declaredEdges.has(edge)).sort();
const unsupported = [...declaredEdges].filter((edge) => !derivedEdges.has(edge)).sort();
if (missing.length || unsupported.length) {
  if (missing.length) console.error(`Missing overview dependencies: ${missing.join(', ')}`);
  if (unsupported.length) console.error(`Dependencies without sequence evidence: ${unsupported.join(', ')}`);
  process.exit(1);
}

const nodes = new Set(moduleInterfaces.keys());
const staticEdges = new Set(derivedEdges);
for (const implementation of implementations) {
  const [adapter, port] = implementation.split('->');
  staticEdges.add(`${adapterModules.get(adapter)}->${portOwners.get(port)}`);
}
const indegree = new Map([...nodes].map((node) => [node, 0]));
const outgoing = new Map([...nodes].map((node) => [node, []]));
for (const edge of staticEdges) {
  const [caller, receiver] = edge.split('->');
  outgoing.get(caller).push(receiver);
  indegree.set(receiver, indegree.get(receiver) + 1);
}

const layerRank = new Map([
  ['MOD-CI', 0], ['MOD-SI', 0], ['MOD-SUPI', 0],
  ['MOD-TPD', 1], ['MOD-PROC', 1], ['MOD-SALES', 1], ['MOD-EXEC', 1],
  ['MOD-CM', 2], ['MOD-TPM', 2], ['MOD-OM', 2],
  ['MOD-ACC', 3], ['MOD-REP', 3], ['MOD-HR', 3],
]);
const upward = [...staticEdges].filter((edge) => {
  const [caller, receiver] = edge.split('->');
  return layerRank.get(caller) > layerRank.get(receiver);
});
if (upward.length) {
  console.error(`Upward layer dependencies: ${upward.sort().join(', ')}`);
  process.exit(1);
}

const ready = [...nodes].filter((node) => indegree.get(node) === 0).sort();
const order = [];
while (ready.length) {
  const node = ready.shift();
  order.push(node);
  for (const receiver of outgoing.get(node).sort()) {
    indegree.set(receiver, indegree.get(receiver) - 1);
    if (indegree.get(receiver) === 0) {
      ready.push(receiver);
      ready.sort();
    }
  }
}

if (order.length !== nodes.size) {
  const cyclic = [...nodes].filter((node) => !order.includes(node)).sort();
  console.error(`Cyclic module dependencies involve: ${cyclic.join(', ')}`);
  process.exit(1);
}

console.log(`OK modular architecture: ${derivedEdges.size} direct call dependencies and ${implementations.size} port implementations; no upward dependencies; acyclic order ${order.join(', ')}`);
