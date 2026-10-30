Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var keys = babelHelpers.interopRequireDefault(require("../storage/keys")),
  c = function (t) {
    storage.load({
      key: keys.default.showTrans
    }).then(function (e) {
      t.setState({
        showTrans: e
      });
    }).catch(function (t) {
      return t;
    });
  },
  l = function (t) {
    storage.load({
      key: keys.default.showToolBtnStatus
    }).then(function (e) {
      t.setState({
        showTool: e
      });
    }).catch(function (t) {
      return t;
    });
  },
  f = function (t) {
    storage.load({
      key: keys.default.lyricFontSize
    }).then(function (e) {
      t.setState({
        lyricFontSize: e
      });
    }).catch(function (t) {
      return t;
    });
  },
  i = function (t) {
    storage.load({
      key: keys.default.lastPlayMode
    }).then(function (e) {
      t.setState({
        playMode: e
      });
    }).catch(function (t) {
      return t;
    });
  },
  r = {
    loadAll: function (t) {
      c(t);
      l(t);
      f(t);
      i(t);
    }
  };
exports.default = r;
