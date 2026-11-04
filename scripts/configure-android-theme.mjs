import fs from 'node:fs';
import path from 'node:path';

const valuesDir = path.resolve('android/app/src/main/res');
if (!fs.existsSync(valuesDir)) {
  throw new Error('Folder android/app/src/main/res tidak ditemukan. Jalankan npx cap add android terlebih dahulu.');
}

const themeNames = ['AppTheme.NoActionBar', 'AppTheme.NoActionBarLaunch'];
const entries = [
  ['android:windowLightStatusBar', 'true'],
  ['android:statusBarColor', '#FFFFFF'],
  ['android:windowLightNavigationBar', 'true'],
  ['android:navigationBarColor', '#FFFFFF']
];

const targetFiles = [
  path.join(valuesDir, 'values', 'styles.xml'),
  path.join(valuesDir, 'values', 'themes.xml'),
  path.join(valuesDir, 'values-v35', 'styles.xml'),
  path.join(valuesDir, 'values-v35', 'themes.xml')
].filter((file) => fs.existsSync(file));

if (!targetFiles.length) {
  throw new Error('Tidak menemukan styles.xml/themes.xml Android untuk diperbarui.');
}

for (const file of targetFiles) {
  let xml = fs.readFileSync(file, 'utf8');
  let changed = false;

  for (const name of themeNames) {
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const stylePattern = new RegExp('(<style\\s+name="' + escaped + '"[^>]*>)([\\s\\S]*?)(</style>)');
    const match = xml.match(stylePattern);
    if (!match) continue;

    let body = match[2];
    for (const [attribute, value] of entries) {
      const itemPattern = new RegExp('<item\\s+name="' + attribute.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '"[^>]*>[^<]*</item>');
      const item = '<item name="' + attribute + '">' + value + '</item>';
      if (itemPattern.test(body)) body = body.replace(itemPattern, item);
      else body += '\\n        ' + item;
    }
    xml = xml.replace(match[0], match[1] + body + match[3]);
    changed = true;
  }

  if (changed) fs.writeFileSync(file, xml);
}

console.log('Konfigurasi status bar dan navigation bar putih telah diterapkan pada tema Android yang tersedia.');
