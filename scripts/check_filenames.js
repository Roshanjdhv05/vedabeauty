
import fs from 'fs';
import path from 'path';

const dir = 'public/mars';
const files = fs.readdirSync(dir);

files.filter(f => f.includes('ARTIST')).forEach(f => {
  console.log(`${f} -> ${f.split('').map(c => c.charCodeAt(0).toString(16)).join(' ')}`);
});
