const fs = require('node:fs');
const path = require('node:path');
const Zip = require('adm-zip');
const {DOMParser, XMLSerializer, onErrorStopParsing} = require('@xmldom/xmldom');

const root = path.resolve(__dirname, '..');
const cache = path.join(root, '.cache');
const output = path.join(cache, 'android-runtime');
const owned = path.join(root, 'android/app/src/main/res');
const archive = new Zip(path.join(root, 'vendor/rewind-runtime-3.5.0.zip'));
const parser = new DOMParser({onError: onErrorStopParsing});
const serializer = new XMLSerializer();
const decoder = new TextDecoder('utf-8', {fatal: true});
const definitions = new Set();
const elements = node => Array.from(node.childNodes).filter(child => child.nodeType === 1);

for (const directory of fs.readdirSync(owned, {withFileTypes: true})) {
  if (!directory.isDirectory() || !directory.name.startsWith('values')) continue;
  const folder = path.join(owned, directory.name);
  for (const file of fs.readdirSync(folder).filter(name => name.endsWith('.xml'))) {
    const document = parser.parseFromString(decoder.decode(fs.readFileSync(path.join(folder, file))), 'application/xml');
    for (const node of elements(document.documentElement)) {
      if (node.hasAttribute('name')) definitions.add(directory.name + '|' + node.tagName + '|' + node.getAttribute('name'));
    }
  }
}

if (path.dirname(output) !== cache) throw new Error('运行库输出目录超出缓存范围');
fs.rmSync(output, {recursive: true, force: true});
for (const entry of archive.getEntries().filter(item => !item.isDirectory && item.entryName !== 'runtime.js')) {
  const relative = entry.entryName;
  let data = entry.getData();
  if (relative.startsWith('res/')) {
    const resource = relative.slice(4);
    const folder = path.posix.dirname(resource);
    if (folder.startsWith('values') && resource.endsWith('.xml')) {
      const document = parser.parseFromString(decoder.decode(data), 'application/xml');
      let changed = false;
      for (const node of elements(document.documentElement)) {
        const key = folder + '|' + node.tagName + '|' + node.getAttribute('name');
        if (node.tagName !== 'public' && definitions.has(key)) {
          node.parentNode.removeChild(node);
          changed = true;
        }
      }
      if (changed) data = Buffer.from(serializer.serializeToString(document));
    } else if (fs.existsSync(path.join(owned, resource))) {
      continue;
    }
  }
  const destination = path.join(output, relative);
  fs.mkdirSync(path.dirname(destination), {recursive: true});
  fs.writeFileSync(destination, data);
}
console.log('已准备 Android 兼容运行库');
