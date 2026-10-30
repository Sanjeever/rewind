const Module = require('node:module');
const path = require('node:path');
const babel = require('@babel/core');

module.exports = function loadModule(filename, dependencies = {}) {
  const absolute = path.resolve(filename);
  const loaded = new Module(absolute, module);
  loaded.filename = absolute;
  loaded.paths = Module._nodeModulePaths(path.dirname(absolute));
  const originalRequire = loaded.require.bind(loaded);
  loaded.require = name => Object.hasOwn(dependencies, name) ? dependencies[name] : originalRequire(name);
  const {code} = babel.transformFileSync(absolute, {presets: ['module:@react-native/babel-preset'], babelrc: false, configFile: false});
  loaded._compile(code, absolute);
  return loaded.exports;
};
