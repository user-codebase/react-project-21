// prebuild.js
import fs from 'fs';
import path from 'path';

const src = path.resolve('public/db/app.json');
const destDir = path.resolve('build/db');
const dest = path.resolve(destDir, 'app.json');

// utwórz katalog, jeśli nie istnieje
fs.mkdirSync(destDir, { recursive: true });

// skopiuj plik
fs.copyFileSync(src, dest);

console.log('app.json skopiowany do build/db');