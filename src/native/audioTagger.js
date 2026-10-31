Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;
var i = require('react-native').NativeModules.RNAudioTagger,
  a = {
    commit: function (e, t) {
      return i.commit(e, t);
    },
  };
exports.default = a;
