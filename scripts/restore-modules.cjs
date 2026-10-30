const fs = require('node:fs');
const path = require('node:path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');
const map = JSON.parse(fs.readFileSync('recovery/module-map.json', 'utf8'));
const selected = new Set(process.argv.slice(2).filter(arg => !arg.startsWith('--')).map(Number));
const replace = process.argv.includes('--replace');
const vendorRanges = [[1, 294], [297, 308], [319, 343], [348, 349], [351, 371], [381, 544], [548, 548], [557, 557], [559, 560], [562, 563], [571, 574], [576, 635], [638, 638], [643, 650], [660, 660], [664, 665], [667, 667], [671, 671], [675, 707], [728, 737], [766, 766], [781, 781], [792, 792], [810, 810], [828, 828], [838, 842], [848, 848], [901, 909], [925, 933]];
const packageEntries = {
  1: 'react-native',
  26: 'react',
  297: 'react-native-spring-scrollview',
  308: 'react-native-text-ticker',
  319: 'rn-fetch-blob',
  327: 'base-64',
  348: 'react-native-linear-gradient',
  351: 'react-native-animatable',
  548: "react-native-touchable-scale",
  559: 'react-native-dialogs',
  571: 'moment',
  576: 'react-navigation',
  638: 'react-native-popup-menu',
  643: "lottie-react-native",
  664: 'react-native-storage',
  667: 'immer',
  671: 'react-native-fading-edge',
  675: '@react-native-community/cookies',
  676: 'axios',
  728: 'react-native-largelist',
  766: 'react-native-slider',
  792: 'react-native-exception-handler',
  828: 'highlight-words-core',
  838: 'react-native-segmented-control-tab',
  848: 'react-native-image-crop-picker',
  901: 'react-native-tab-view',
  925: '@react-native-community/slider',
  928: 'react-native-video'
};
const names = {
  0: 'index.js',
  295: 'src/App.js',
  296: 'src/bootstrap/defaultProps.js',
  309: 'src/components/index.js',
  311: 'src/theme/constants.js',
  312: 'src/events/names.js',
  313: 'src/storage/keys.js',
  314: 'src/events/index.js',
  315: 'src/events/Emitter.js',
  316: 'src/services/providers.js',
  317: 'src/theme/background.js',
  318: 'src/storage/files.js',
  344: 'src/storage/paths.js',
  345: 'src/utils/types.js',
  372: 'src/theme/icons.js',
  373: 'src/locales/index.js',
  374: 'src/native/language.js',
  375: 'src/locales/en_US.js',
  376: 'src/locales/zh_CN.js',
  377: 'src/locales/zh_HK.js',
  378: 'src/locales/zh_TW.js',
  379: "src/components/Input.js",
  380: 'src/components/Icon.js',
  544: 'src/theme/iconGlyphs.js',
  553: 'src/services/trackInfo.js',
  554: 'src/utils/index.js',
  636: 'src/services/trackFields.js',
  637: 'src/services/artistInfo.js',
  651: 'assets/animations/loading.js',
  656: 'src/native/TabbedViewPager.js',
  657: 'src/utils/setDefaultProps.js',
  658: 'src/bootstrap/globals.js',
  659: 'src/services/logger.js',
  661: 'src/native/info.js',
  662: 'src/native/toast.js',
  663: 'src/storage/index.js',
  666: 'src/bootstrap/collections.js',
  668: 'src/modals/index.js',
  670: 'src/components/FadingEdge.js',
  672: 'src/services/index.js',
  673: 'src/services/netease/index.js',
  674: 'src/services/netease/http.js',
  708: 'src/native/crypto.js',
  709: 'src/services/netease/anonymousCookie.js',
  710: 'src/services/provider.js',
  711: 'src/services/qqmusic/index.js',
  712: 'src/services/qqmusic/sign.js',
  713: 'src/storage/users.js',
  717: 'src/storage/playlistFiles.js',
  720: 'src/services/download.js',
  721: 'src/native/audioTagger.js',
  722: 'src/events/queue.js',
  726: 'src/services/sharedUrls.js',
  739: 'src/theme/tabIcons.js',
  742: 'src/settings/defaults.js',
  743: 'src/player/index.js',
  744: 'src/player/PlayerView.js',
  745: 'src/player/buttons.js',
  746: 'src/player/styles.js',
  747: 'src/native/dimensions.js',
  750: 'src/player/playOrder.js',
  770: 'src/player/PlayerController.js',
  771: 'src/native/audioPlayer.js',
  772: 'src/native/timer.js',
  773: 'src/native/mediaStore.js',
  774: 'src/native/shutdown.js',
  775: 'src/native/wakeLock.js',
  776: 'src/storage/lastSong.js',
  777: 'src/storage/lastTime.js',
  778: 'src/storage/lastQueue.js',
  779: 'src/storage/history.js',
  780: 'src/player/cache.js',
  782: 'src/player/lyricPreferences.js',
  783: 'src/player/queue.js',
  784: 'src/player/playMode.js',
  785: 'src/player/lyrics.js',
  786: 'src/player/trackUrl.js',
  787: 'src/player/notification.js',
  788: 'src/settings/notification.js',
  789: 'src/player/queueActions.js',
  790: 'src/player/gestures.js',
  791: 'src/bootstrap/errors.js',
  793: 'src/native/restart.js',
  794: 'src/native/navigationBar.js',
  795: 'src/native/orientation.js',
  796: 'src/native/splash.js',
  797: 'src/native/permissions.js',
  798: 'src/navigation/transition.js',
  799: 'src/services/update.js',
  800: 'src/services/endpoints.js',
  801: 'src/navigation/index.js',
  843: 'src/settings/pages.js',
  850: 'src/native/devMenu.js',
  854: 'src/screens/home/actions.js',
  855: 'src/screens/home/index.js',
  856: 'src/storage/playlists.js',
  857: 'src/screens/home/Playlists.js',
  858: 'src/components/PlaylistTabs.js',
  859: 'src/modals/CreatePlaylist.js',
  860: 'src/screens/home/PlaylistHeader.js',
  866: 'src/components/LoginView.js',
  882: 'src/services/searchTypes.js',
  895: 'src/screens/playlist/sortModes.js',
  910: 'src/screens/search/sections.js',
  936: 'src/native/intentVideo.js'
};
function load(id) {
  return parser.parse(fs.readFileSync(`.recovery/modules/${id}.js`, 'utf8'));
}
function dependencyBindings(id) {
  const bindings = new Map();
  traverse(load(id), {
    VariableDeclarator(p) {
      if (!t.isIdentifier(p.node.id)) return;
      let init = p.node.init;
      if (t.isCallExpression(init) && t.isMemberExpression(init.callee) && init.callee.object.name === 'babelHelpers') init = init.arguments[0];
      if (t.isCallExpression(init) && init.callee.name === 'require' && t.isMemberExpression(init.arguments[0]) && init.arguments[0].object.name === 'dependencyMap') bindings.set(p.node.id.name, map.modules.find(m => m.id === id).dependencies[init.arguments[0].property.value]);
    }
  });
  return bindings;
}
for (const [id, directory] of [[309, 'src/components'], [554, 'src/utils'], [668, 'src/modals']]) {
  const bindings = dependencyBindings(id);
  traverse(load(id), {
    CallExpression(p) {
      const n = p.node;
      if (!t.isMemberExpression(n.callee) || n.callee.object.name !== 'Object' || n.callee.property.name !== 'defineProperty' || n.arguments[0]?.name !== 'exports' || !t.isStringLiteral(n.arguments[1]) || n.arguments[1].value === '__esModule') return;
      const getter = n.arguments[2]?.properties?.find(item => item.key.name === 'get');
      const ret = getter?.value.body.body.find(item => t.isReturnStatement(item))?.argument;
      const dep = bindings.get(ret?.object?.name);
      if (dep != null && !names[dep] && !vendorRanges.some(([start, end]) => dep >= start && dep <= end)) names[dep] = `${directory}/${n.arguments[1].value}.js`;
    }
  });
}
const routeBindings = dependencyBindings(801);
traverse(load(801), {
  ObjectProperty(p) {
    if (p.node.key.name !== 'screen') return;
    const id = routeBindings.get(p.node.value.object?.name);
    const route = p.parentPath.parentPath.node.key?.name;
    if (id != null && route && !names[id]) names[id] = `src/screens/${route}.js`;
  }
});
for (const m of map.modules) {
  const vendor = m.id !== 544 && vendorRanges.some(([start, end]) => m.id >= start && m.id <= end);
  m.classification = vendor ? 'third_party' : 'application';
  m.package = packageEntries[m.id] || null;
  m.source = vendor ? null : m.source || names[m.id] || `src/${m.id >= 744 && m.id <= 790 ? 'player' : 'modules'}/module-${m.id}.js`;
}
const byId = new Map(map.modules.map(m => [m.id, m]));
const paths = map.modules.filter(m => m.source).map(m => m.source);
if (new Set(paths).size !== paths.length) throw new Error('源码路径发生冲突');
const outputs = [];
for (const m of map.modules.filter(m => m.source && (!selected.size || selected.has(m.id)))) {
  if (fs.existsSync(m.source) && !replace) throw new Error(`目标已存在，拒绝覆盖 ${m.source}`);
  const wrapper = load(m.id).program.body[0].expression;
  const ast = t.file(t.program(wrapper.body.body, wrapper.body.directives));
  traverse(ast, {
    CallExpression(p) {
      if (p.node.callee.name !== 'require') return;
      const arg = p.node.arguments[0];
      if (t.isStringLiteral(arg)) return;
      if (!t.isMemberExpression(arg) || arg.object.name !== 'dependencyMap' || !t.isNumericLiteral(arg.property)) throw new Error(`模块 ${m.id} 未识别依赖 ${generate(p.node).code}`);
      const dep = byId.get(m.dependencies[arg.property.value]);
      let target = dep.package || `@runtime/${dep.id}`;
      if (dep.source) {
        target = path.relative(path.dirname(m.source), dep.source).replaceAll('\\', '/').replace(/\.js$/, '');
        if (!target.startsWith('.')) target = './' + target;
      }
      p.node.arguments = [t.stringLiteral(target)];
    },
    UnaryExpression(p) {
      if (p.node.operator === '!' && t.isNumericLiteral(p.node.argument) && [0, 1].includes(p.node.argument.value)) p.replaceWith(t.booleanLiteral(!p.node.argument.value));
    },
    ExpressionStatement: {
      exit(p) {
        if (t.isSequenceExpression(p.node.expression)) p.replaceWithMultiple(p.node.expression.expressions.map(expression => t.expressionStatement(expression)));
      }
    },
    ReturnStatement: {
      exit(p) {
        if (t.isSequenceExpression(p.node.argument)) {
          const exprs = p.node.argument.expressions;
          p.replaceWithMultiple([...exprs.slice(0, -1).map(expression => t.expressionStatement(expression)), t.returnStatement(exprs.at(-1))]);
        }
      }
    }
  });
  traverse(ast, {
    Program(p) {
      const usedNames = new Set();
      p.traverse({ Identifier(identifier) { usedNames.add(identifier.node.name); } });
      for (const [name, binding] of Object.entries(p.scope.bindings)) {
        if (!binding.path.isVariableDeclarator()) continue;
        let init = binding.path.node.init;
        if (t.isCallExpression(init) && t.isMemberExpression(init.callee) && init.callee.object.name === 'babelHelpers') init = init.arguments[0];
        if (!t.isCallExpression(init) || init.callee.name !== 'require' || !t.isStringLiteral(init.arguments[0])) continue;
        const spec = init.arguments[0].value;
        const resolved = spec.startsWith('.') ? path.resolve(path.dirname(m.source),spec) : spec;
        let label = spec === 'react' ? 'React' : spec === 'react-native' ? 'ReactNative' : spec.startsWith('@runtime/') ? 'Runtime'+spec.slice(9) : path.basename(spec).replace(/\.js$/, '');
        if (label === 'index') label = path.basename(path.dirname(resolved));
        label = t.toIdentifier(label);
        while (label !== name && usedNames.has(label)) label += 'Module';
        if (label !== name) {
          const references = p.scope.getBinding(name).referencePaths.length;
          p.scope.rename(name,label);
          p.scope.crawl();
          if (p.scope.getBinding(label).referencePaths.length !== references) throw new Error(`模块 ${m.id} 重命名改变了变量绑定`);
          usedNames.add(label);
        }
      }
    }
  });
  outputs.push({
    path: m.source,
    code: generate(ast, {
      comments: false,
      jsescOption: {
        minimal: true
      }
    }).code + '\n'
  });
}
for (const output of outputs) {
  fs.mkdirSync(path.dirname(output.path), {
    recursive: true
  });
  fs.writeFileSync(output.path, output.code);
}
fs.writeFileSync('recovery/module-map.json', JSON.stringify(map, null, 2) + '\n');
console.log(`已写入 ${outputs.length} 个自有模块；${map.modules.filter(m => !m.source).length} 个运行库模块保留兼容映射`);
