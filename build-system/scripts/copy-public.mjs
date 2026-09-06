import { cp, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '../..');
const source = resolve(root, 'public');
const destination = resolve(root, 'dist');

await mkdir(destination, { recursive: true });
await cp(source, destination, { recursive: true, force: true });
console.log(`Copied static frontend assets from ${source} to ${destination}`);
