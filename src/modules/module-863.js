Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireWildcard(require("react")),
  reactNativeSpringScrollview = require("react-native-spring-scrollview"),
  components = require("../components/index"),
  u = function (e) {
    function r() {
      var e, t, n;
      babelHelpers.classCallCheck(this, r);
      for (var l = arguments.length, i = new Array(l), u = 0; u < l; u++) i[u] = arguments[u];
      return babelHelpers.possibleConstructorReturn(n, (t = n = babelHelpers.possibleConstructorReturn(this, (e = babelHelpers.getPrototypeOf(r)).call.apply(e, [this].concat(i))), n.onTop = function () {
        var e, r;
        null === (e = (r = n._scrollView).scrollToBegin) || void 0 === e || e.call(r);
      }, n.formatAudioName = function (e) {
        return e.replace(/\.mp3/, '');
      }, n._renderItem = function (e) {
        var r = e.item,
          t = e.index;
        return React.default.createElement(components.SongRow, {
          key: t,
          song: n.formatAudioName(r.filename || r.title || r.album || r.artist),
          singer: true !== n.props.nosinger && (r.singer || r.artist),
          onPress: function () {
            return n.props.playMusic(r, t);
          },
          index: t,
          addToQueue: function () {
            return n.props.addToQueue(r);
          },
          detail: function () {
            return n.props.onDetail(r, t);
          }
        });
      }, t));
    }
    babelHelpers.createClass(r, [{
      key: "render",
      value: function () {
        var e = this,
          r = this.props.data;
        return r ? React.default.createElement(reactNativeSpringScrollview.SpringScrollView, {
          ref: function (r) {
            return e._scrollView = r;
          }
        }, r.map(function (r, t) {
          return e._renderItem({
            item: r,
            index: t
          });
        })) : React.default.createElement(components.Spinkit, null);
      }
    }]);
    babelHelpers.inherits(r, e);
    return r;
  }(React.Component);
exports.default = u;
