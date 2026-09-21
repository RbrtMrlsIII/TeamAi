import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const files = ['types.ts', 'http.ts', 'retry.ts', 'termination.ts', 'openai.ts', 'anthropic.ts'];
const checkOnly = process.argv.includes('--check');
const drifted = [];

for (const file of files) {
  const source = await readFile(resolve(root, 'src/providers', file), 'utf8');
  const targetPath = resolve(root, 'supabase/functions/_shared/providers', file);
  const current = await readFile(targetPath, 'utf8').catch(() => null);

  if (current !== source) {
    if (checkOnly) drifted.push(file);
    else await writeFile(targetPath, source, 'utf8');
  }
}

if (checkOnly && drifted.length) {
  console.error('Edge provider runtime parity failed:');
  for (const file of drifted) console.error(' - ' + file);
  process.exit(1);
}

console.log(checkOnly
  ? 'Edge provider runtime parity verified for ' + files.length + ' modules'
  : 'Synchronized ' + files.length + ' provider modules into Supabase Edge runtime mirror');
