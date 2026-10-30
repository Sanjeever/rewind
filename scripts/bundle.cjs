const fs = require('node:fs');
const path = require('node:path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');
const Zip = require('adm-zip');
const babel = require('@babel/core');

const map = JSON.parse(fs.readFileSync('recovery/module-map.json','utf8'));
const byId = new Map(map.modules.map(m=>[m.id,m]));
const byPath = new Map(map.modules.filter(m=>m.source).map(m=>[path.resolve(m.source),m.id]));
const byPackage = new Map(map.modules.filter(m=>m.package).map(m=>[m.package,m.id]));
const ast = parser.parse(new Zip('app-arm64-v8a-release.apk').readAsText('assets/index.android.bundle'));
const queue = map.modules.filter(m=>m.source);
const compiled = new Map();
let nextId = Math.max(...byId.keys()) + 1;
for (let cursor = 0; cursor < queue.length; cursor++) {
  const m = queue[cursor];
  let source;
  if (path.extname(m.source) === '.json') {
    const data = t.valueToNode(JSON.parse(fs.readFileSync(m.source,'utf8')));
    source = t.file(t.program([
      t.expressionStatement(t.assignmentExpression('=',t.memberExpression(t.identifier('module'),t.identifier('exports')),data)),
    ]));
  } else {
    source = babel.transformFileSync(m.source,{ast:true,code:false,sourceType:'unambiguous'}).ast;
  }
  const deps = [];
  traverse(source, { CallExpression(p) {
    if (p.node.callee.name !== 'require') return;
    const spec = p.node.arguments[0];
    if (!t.isStringLiteral(spec)) throw new Error(`${m.source} 包含动态 require`);
    const target = spec.value;
    let dep;
    if (target.startsWith('.')) {
      const resolved = require.resolve(path.resolve(path.dirname(m.source),target));
      if (!['.js','.jsx','.json'].includes(path.extname(resolved))) throw new Error(`${m.source} 不支持的源码类型 ${target}`);
      dep = byPath.get(resolved);
      if (dep === undefined) {
        dep = nextId++;
        const added = {id:dep,source:path.relative(process.cwd(),resolved).replaceAll('\\','/')};
        byId.set(dep,added);
        byPath.set(resolved,dep);
        queue.push(added);
      }
    }
    else if (target.startsWith('@runtime/')) dep = Number(target.slice(9));
    else dep = byPackage.get(target);
    if (!byId.has(dep)) throw new Error(`${m.source} 无法解析 ${target}`);
    let index = deps.indexOf(dep);
    if (index === -1) index = deps.push(dep)-1;
    p.node.arguments = [t.memberExpression(t.identifier('dependencyMap'),t.numericLiteral(index),true)];
  }});
  compiled.set(m.id,[t.functionExpression(null,['global','require','module','exports','dependencyMap'].map(name=>t.identifier(name)),t.blockStatement(source.program.body,source.program.directives)),t.numericLiteral(m.id),t.arrayExpression(deps.map(dep=>t.numericLiteral(dep)))]);
}
for (const statement of ast.program.body) {
  const call = statement.expression;
  if (!t.isCallExpression(call) || call.callee.name !== '__d') continue;
  const replacement = compiled.get(call.arguments[1].value);
  if (replacement) call.arguments = replacement;
}
const additions = queue.filter(m=>m.id>=map.modules.length).map(m=>t.expressionStatement(t.callExpression(t.identifier('__d'),compiled.get(m.id))));
if (additions.length) {
  const entry = ast.program.body.findIndex(s=>s.expression?.callee?.name==='require' && s.expression.arguments[0]?.value===0);
  if (entry === -1) throw new Error('未找到应用启动调用');
  ast.program.body.splice(entry,0,...additions);
}
const output = '.recovery/generated/assets/index.android.bundle';
fs.mkdirSync(path.dirname(output),{recursive:true});
fs.writeFileSync(output,generate(ast,{comments:false,compact:true,jsescOption:{minimal:true}}).code);
console.log(`已编译 ${queue.length} 个应用模块 → ${output}`);
