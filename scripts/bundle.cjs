const fs = require('node:fs');
const path = require('node:path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');
const Zip = require('adm-zip');

const map = JSON.parse(fs.readFileSync('recovery/module-map.json','utf8'));
const byId = new Map(map.modules.map(m=>[m.id,m]));
const byPath = new Map(map.modules.filter(m=>m.source).map(m=>[path.resolve(m.source),m.id]));
const byPackage = new Map(map.modules.filter(m=>m.package).map(m=>[m.package,m.id]));
const ast = parser.parse(new Zip('app-arm64-v8a-release.apk').readAsText('assets/index.android.bundle'));
let count = 0;
for (const statement of ast.program.body) {
  const call = statement.expression;
  if (!t.isCallExpression(call) || call.callee.name !== '__d') continue;
  const id = call.arguments[1].value;
  const m = byId.get(id);
  if (!m.source) continue;
  const source = parser.parse(fs.readFileSync(m.source,'utf8'),{sourceFilename:m.source});
  const deps = [];
  traverse(source, { CallExpression(p) {
    if (p.node.callee.name !== 'require') return;
    const spec = p.node.arguments[0];
    if (!t.isStringLiteral(spec)) throw new Error(`${m.source} 包含动态 require`);
    const target = spec.value;
    let dep;
    if (target.startsWith('.')) dep = byPath.get(path.resolve(path.dirname(m.source),target.endsWith('.js')?target:target+'.js'));
    else if (target.startsWith('@runtime/')) dep = Number(target.slice(9));
    else dep = byPackage.get(target);
    if (!byId.has(dep)) throw new Error(`${m.source} 无法解析 ${target}`);
    let index = deps.indexOf(dep);
    if (index === -1) index = deps.push(dep)-1;
    p.node.arguments = [t.memberExpression(t.identifier('dependencyMap'),t.numericLiteral(index),true)];
  }});
  call.arguments = [t.functionExpression(null,['global','require','module','exports','dependencyMap'].map(name=>t.identifier(name)),t.blockStatement(source.program.body,source.program.directives)),t.numericLiteral(id),t.arrayExpression(deps.map(dep=>t.numericLiteral(dep)))];
  count++;
}
const output = '.recovery/generated/assets/index.android.bundle';
fs.mkdirSync(path.dirname(output),{recursive:true});
fs.writeFileSync(output,generate(ast,{comments:false,compact:true,jsescOption:{minimal:true}}).code);
console.log(`已编译 ${count} 个自有模块 → ${output}`);
