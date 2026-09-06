// build.mjs — קומפילציה מראש של app.jsx ל-app.js (מסיר את הצורך ב-Babel בדפדפן)
// שימוש:  node build.mjs   (מריצים אחרי כל עריכה של app.jsx)
//
// ⚠️ app.js נוצר מהקובץ הזה בלבד. לעולם לא עורכים את app.js ידנית.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);

// אותו Babel שהאתר השתמש בו בדפדפן — המרה זהה, בלי הפתעות.
// נשמר מקומית ב-.babel-cache/ (לא נכנס ל-git); אם חסר — יורד אוטומטית פעם אחת.
const CACHE_DIR = new URL('./.babel-cache/', import.meta.url);
const BABEL_FILE = new URL('./babel.min.js', CACHE_DIR);

if (!existsSync(BABEL_FILE)) {
  mkdirSync(CACHE_DIR, { recursive: true });
  console.log('⬇️  מוריד את Babel פעם אחת…');
  const res = await fetch('https://unpkg.com/@babel/standalone@7/babel.min.js');
  if (!res.ok) throw new Error('הורדת Babel נכשלה: ' + res.status);
  writeFileSync(BABEL_FILE, Buffer.from(await res.arrayBuffer()));
}

const Babel = require(fileURLToPath(BABEL_FILE));

const src = readFileSync(new URL('./app.jsx', import.meta.url), 'utf8');
const { code } = Babel.transform(src, { presets: ['react'] });

const banner = '// ⚠️ קובץ מקומפל אוטומטית מ-app.jsx — אין לערוך ידנית! ערכו את app.jsx והריצו: node build.mjs\n';
writeFileSync(new URL('./app.js', import.meta.url), banner + code);
console.log('✅ app.js נבנה —', (code.length / 1024).toFixed(1) + 'KB (Babel ' + Babel.version + ')');
