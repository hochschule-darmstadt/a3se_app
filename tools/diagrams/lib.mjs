import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ignored = new Set(['.git', 'node_modules', '.diagram-tools']);

export function findFiles(root, extensions) {
  const result = [];
  function visit(directory) {
    for (const name of readdirSync(directory)) {
      if (ignored.has(name)) continue;
      const path = join(directory, name);
      const stat = statSync(path);
      if (stat.isDirectory()) visit(path);
      else if (extensions.some((extension) => name.endsWith(extension))) result.push(path);
    }
  }
  visit(root);
  return result.sort();
}

