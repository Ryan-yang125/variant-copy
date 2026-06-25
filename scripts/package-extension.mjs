import { cp, mkdir, rm } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(await (await import('node:fs/promises')).readFile(resolve(root, 'manifest.json'), 'utf8'));
const version = manifest.version;
const dist = resolve(root, 'dist');
const stage = resolve(dist, `variant-copy-v${version}`);
const zipPath = resolve(dist, `variant-copy-v${version}.zip`);

const files = [
  'manifest.json',
  'content.js',
  'popup.html',
  'popup.css',
  'popup.js',
  'assets/icon-16.png',
  'assets/icon-32.png',
  'assets/icon-48.png',
  'assets/icon-128.png'
];

await rm(stage, { recursive: true, force: true });
await rm(zipPath, { force: true });
await mkdir(stage, { recursive: true });

for (const file of files) {
  await mkdir(dirname(resolve(stage, file)), { recursive: true });
  await cp(resolve(root, file), resolve(stage, file));
}

execFileSync('zip', ['-qr', zipPath, '.'], { cwd: stage });
console.log(zipPath);
