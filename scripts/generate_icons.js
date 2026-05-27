import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const iconDir = path.resolve('./public/icons');
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

sharp('./public/logo.jpeg')
  .resize(192, 192)
  .png()
  .toFile('./public/icons/icon-192.png')
  .then(() => console.log('Generated 192x192 icon'))
  .catch(console.error);

sharp('./public/logo.jpeg')
  .resize(512, 512)
  .png()
  .toFile('./public/icons/icon-512.png')
  .then(() => console.log('Generated 512x512 icon'))
  .catch(console.error);
