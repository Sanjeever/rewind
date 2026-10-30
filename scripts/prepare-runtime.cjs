const fs = require('node:fs');
const path = require('node:path');
const Zip = require('adm-zip');

const input = '.recovery/raw/runtime.jar';
if (!fs.existsSync(input)) throw new Error('请先按 README 生成本地兼容运行库 .recovery/raw/runtime.jar');
const original = new Zip(input);
const runtime = new Zip();
let removed = 0;
for (const entry of original.getEntries().filter(entry=>!entry.isDirectory)) {
  if (entry.entryName.startsWith('com/modules/') || entry.entryName.startsWith('com/kuss/rewind/')) { removed++; continue; }
  runtime.addFile(entry.entryName,entry.getData());
}
fs.mkdirSync('.recovery/runtime',{recursive:true});
runtime.writeZip('.recovery/runtime/legacy-runtime.jar');
for (const abi of ['arm64-v8a','armeabi-v7a','x86','x86_64']) {
  const apk = new Zip(`app-${abi}-release.apk`);
  for (const entry of apk.getEntries().filter(entry=>!entry.isDirectory && (entry.entryName.startsWith('lib/') || abi==='arm64-v8a' && entry.entryName.startsWith('assets/') && entry.entryName!=='assets/index.android.bundle'))) {
    const relative = entry.entryName.startsWith('lib/')?'jniLibs/'+entry.entryName.slice(4):entry.entryName;
    const output = path.join('.recovery/runtime',relative);
    fs.mkdirSync(path.dirname(output),{recursive:true});
    fs.writeFileSync(output,entry.getData());
  }
}
console.log(`本地兼容库已移除 ${removed} 个自有类；自有原生代码必须从 android/app/src/main/java 编译`);
