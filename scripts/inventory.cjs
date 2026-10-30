const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const Zip = require('adm-zip');
const parser = require('@babel/parser');
const generate = require('@babel/generator').default;
const traverse = require('@babel/traverse').default;

const hash = data => crypto.createHash('sha256').update(data).digest('hex');
const metadata = JSON.parse(fs.readFileSync('output-metadata.json', 'utf8'));
const packages = metadata.elements.map(element => {
  const zip = new Zip(element.outputFile);
  const entries = zip.getEntries().filter(entry => !entry.isDirectory);
  return {
    file: element.outputFile,
    sha256: hash(fs.readFileSync(element.outputFile)),
    abi: element.filters[0].value,
    version_code: element.versionCode,
    entries: entries.map(entry => ({ path: entry.entryName, size: entry.header.size, sha256: hash(entry.getData()) })),
  };
});
const zip = new Zip('app-arm64-v8a-release.apk');
const bundle = zip.readAsText('assets/index.android.bundle');
const ast = parser.parse(bundle);
fs.mkdirSync('.recovery/modules', { recursive: true });
const modules = [];
for (const statement of ast.program.body) {
  const call = statement.expression;
  if (call?.type !== 'CallExpression' || call.callee.name !== '__d') continue;
  const [factory, id, dependencies] = call.arguments;
  const deps = dependencies ? dependencies.elements.map(item => item.value) : [];
  const file = parser.parse(`(${generate(factory).code})`);
  traverse(file, {
    FunctionExpression(p) {
      if (p.node !== file.program.body[0].expression) return;
      const names = ['global', 'require', 'module', 'exports', 'dependencyMap'];
      p.node.params.forEach((param, i) => p.scope.rename(param.name, names[i]));
    },
  });
  const source = generate(file, { comments: false }).code;
  fs.writeFileSync(path.join('.recovery/modules', `${id.value}.js`), source + '\n');
  const exports = new Set();
  const natives = new Set();
  traverse(file, {
    AssignmentExpression(p) {
      const left = p.node.left;
      if (left.type === 'MemberExpression' && left.object.name === 'exports' && !left.computed) exports.add(left.property.name);
    },
    MemberExpression(p) {
      const node = p.node;
      if (node.object.type === 'MemberExpression' && node.object.property.name === 'NativeModules') natives.add(node.property.name);
    },
  });
  modules.push({ id: id.value, dependencies: deps, classification: 'unknown', source: null, exports: [...exports], native_modules: [...natives] });
}
fs.mkdirSync('recovery', { recursive: true });
fs.writeFileSync('recovery/module-map.json', JSON.stringify({ bundle_sha256: hash(Buffer.from(bundle)), modules }, null, 2) + '\n');
fs.writeFileSync('recovery/inventory.json', JSON.stringify({
  application_id: metadata.applicationId,
  version: '3.5.0',
  packages,
  evidence: {
    javascript: { version: '0.56.1', status: 'confirmed', location: 'assets/index.android.bundle: ReactNativeVersion' },
    android_gradle_plugin: { version: '4.2.2', status: 'confirmed', location: 'META-INF/com/android/build/gradle/app-metadata.properties' },
    sdk: { min: 21, target: 32, compile: 32, status: 'confirmed', location: 'AndroidManifest.xml' },
    native_framework_version: { version: '0.56.1', status: 'confirmed', location: 'classes.dex: com.facebook.react.modules.systeminfo.b' },
    storage: {
      status: 'confirmed',
      location: 'JavaScript modules 313, 663, 664',
      backend: 'React Native AsyncStorage',
      wrapper: 'react-native-storage',
      wrapper_version: null,
      size: 2048,
      default_expires: null,
      enable_cache: false,
      keys: ['showTrans', 'showToolBtnStatus', 'autoSetPlaylistOrder', 'charts', 'restUsers', 'apiOrder', 'pagesOrder', 'lastPlayedSong', 'musicNotification', 'lyricFontSize', 'settings', 'lastPlayMode', 'background', 'musicHistory', 'searchHistory', 'userInfo', 'maxCacheSize', 'playlist', 'likelist', 'netEasePlaylistCache', 'firstTime', 'lastPlayedTracks', 'lastPlayedTime'],
      database_schema: 'not_yet_verified',
    },
  },
}, null, 2) + '\n');
console.log(`已分析 ${packages.length} 个包、${modules.length} 个模块；逐项清单见 recovery/，临时模块见 .recovery/modules/`);
