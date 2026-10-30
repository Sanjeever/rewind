const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const parser = require('@babel/parser');
const generate = require('@babel/generator').default;
const Zip = require('adm-zip');

const map = JSON.parse(fs.readFileSync('recovery/module-map.json','utf8'));
const original = parser.parse(new Zip('app-arm64-v8a-release.apk').readAsText('assets/index.android.bundle'));
const rebuilt = parser.parse(fs.readFileSync('.recovery/generated/assets/index.android.bundle','utf8'));
function factories(ast) {
  return new Map(ast.program.body.filter(s=>s.expression?.callee?.name==='__d').map(s=>[s.expression.arguments[1].value,s.expression.arguments]));
}
const before = factories(original);
const after = factories(rebuilt);
assert.equal(before.size,938);
assert(after.size>=938);
for (const [id,args] of after) {
  assert((args[2]?.elements||[]).every(item=>after.has(item.value)),`模块 ${id} 存在无效依赖`);
}
const applicationPaths = map.modules.filter(m=>m.source).map(m=>path.resolve(m.source));
assert.equal(new Set(applicationPaths).size,applicationPaths.length,'自有源码路径重复');
for (const m of map.modules) {
  assert(after.has(m.id));
  const deps = after.get(m.id)[2]?.elements.map(item=>item.value) || [];
  assert(deps.every(id=>after.has(id)),`模块 ${m.id} 存在无效依赖`);
  if (m.source) {
    assert(fs.existsSync(path.resolve(m.source)),m.source);
    assert(!/dependencyMap\[/.test(fs.readFileSync(m.source,'utf8')),m.source);
  } else {
    assert.deepEqual(deps,m.dependencies,`运行库模块 ${m.id} 依赖变化`);
    assert.equal(generate(after.get(m.id)[0]).code,generate(before.get(m.id)[0]).code,`运行库模块 ${m.id} 发生变化`);
  }
}
function loadPure(args) {
  const context = vm.createContext({});
  const factory = vm.runInContext('('+generate(args[0]).code+')',context);
  const module = {exports:{}};
  factory(context,()=>{throw new Error('纯函数用例出现外部依赖');},module,module.exports,[]);
  return module.exports.default;
}
const beforeLyric = loadPure(before.get(566));
const afterLyric = loadPure(after.get(566));
for (const lyric of ['', '[00:01.250]第一句\n[00:02.500]第二句','[00:03.000][00:04.000]重复歌词','[ar:歌手]\n[00:00.000]零时刻\n[01:20.125]正文']) {
  assert.equal(JSON.stringify(afterLyric(lyric)),JSON.stringify(beforeLyric(lyric)));
}
for (const applicationId of ['com.kuss.rewind','com.kuss.rewind.dev']) {
  const exports = {};
  vm.runInNewContext(fs.readFileSync('src/storage/paths.js','utf8'),{
    exports,
    babelHelpers:{interopRequireDefault: value=>({default:value})},
    require: spec=>{
      if(spec==='../native/info') return {applicationId};
      if(spec==='rn-fetch-blob') return {fs:{dirs:{SDCardDir:'/storage/emulated/0'}}};
      throw new Error(spec);
    },
  });
  assert.equal(exports.playlist_dir,`/storage/emulated/0/Android/data/${applicationId}/files/playlist`);
  assert.equal(exports.cache_dir,`/storage/emulated/0/Android/data/${applicationId}/cache/`);
}
console.log('通过：938 个模块引用完整、运行库保持一致、4 组歌词对照一致，原版与开发包目录分别生成');
