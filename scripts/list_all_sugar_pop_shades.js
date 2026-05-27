import fs from 'fs';
import path from 'path';

const shadesDir = path.join(process.cwd(), 'public', 'sugar pop', 'shades');

function listFiles(dir) {
  if (!fs.existsSync(dir)) {
    console.log(`Directory does not exist: ${dir}`);
    return;
  }
  const subdirs = fs.readdirSync(dir);
  for (const s of subdirs) {
    const fullPath = path.join(dir, s);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      console.log(`\nDirectory: ${s}`);
      const files = fs.readdirSync(fullPath);
      files.forEach(f => {
        console.log(`  - ${f}`);
      });
    } else {
      console.log(`File directly in shades: ${s}`);
    }
  }
}

listFiles(shadesDir);
