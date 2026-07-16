import sharp from 'sharp';
import { readdirSync, mkdirSync } from 'fs';
import path from 'path';

const SRC = 'public/assets';
const OUT = 'public/assets/optimized';
mkdirSync(OUT, { recursive: true });
const files = readdirSync(SRC).filter(f => /\.(png|jpe?g)$/i.test(f));

for (const file of files) {
  const input = path.join(SRC, file);
  const name = file.replace(/\.(png|jpe?g)$/i, '');
  await sharp(input).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 82 }).toFile(path.join(OUT, `${name}.webp`));
  await sharp(input).resize({ width: 800, withoutEnlargement: true }).webp({ quality: 82 }).toFile(path.join(OUT, `${name}-mobile.webp`));
  await sharp(input).resize({ width: 1600, withoutEnlargement: true }).jpeg({ quality: 80, mozjpeg: true }).toFile(path.join(OUT, `${name}.jpg`));
  console.log(`optimized: ${file}`);
}
