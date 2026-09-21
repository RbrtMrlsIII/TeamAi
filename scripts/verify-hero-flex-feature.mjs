import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');

export function verifyHeroFlexFeature(feature, markers = []) {
  const path = resolve(root, 'public/hero-flex.js');
  const source = readFileSync(path, 'utf8');

  const forbidden = [
    'raw.githubusercontent.com',
    'function patchSource',
    'URL.createObjectURL',
    'gl.createShader',
    'gl.createProgram',
  ];
  const forbiddenFound = forbidden.filter((marker) => source.includes(marker));
  if (forbiddenFound.length) {
    throw new Error('Hero compatibility runtime contains retired authority: ' + forbiddenFound.join(', '));
  }

  const missing = markers.filter((marker) => !source.includes(marker));
  if (missing.length) {
    throw new Error(feature + ' compatibility contract missing: ' + missing.join(', '));
  }

  console.log(feature + ' Hero compatibility contract verified');
}
