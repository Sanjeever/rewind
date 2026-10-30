Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  FadingEdge = babelHelpers.interopRequireDefault(require("../components/FadingEdge")),
  constants = require("../theme/constants"),
  MiniPlayerContent = babelHelpers.interopRequireDefault(require("./MiniPlayerContent")),
  PlayButton = babelHelpers.interopRequireDefault(require("./PlayButton")),
  p = function (e) {
    function t() {
      babelHelpers.classCallCheck(this, t);
      return babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(t).apply(this, arguments));
    }
    babelHelpers.createClass(t, [{
      key: "render",
      value: function () {
        var e = this.props,
          t = e.playingIndex,
          r = e.tracks,
          n = e.changeSong,
          l = e.playerOpen,
          p = e.playMode,
          c = e.onDetail,
          f = e.playState,
          y = e.togglePlay,
          b = e.loaded,
          h = e.hideTopBorder,
          g = e.isRound,
          m = e.unknown,
          C = e.currentMiniLyric,
          H = e.onNowPlaying,
          P = e.randomArray;
        return React.default.createElement(ReactNative.View, {
          ref: "imgCon",
          style: [{
            height: '100%',
            width: '100%',
            alignItems: 'center',
            flexDirection: 'row',
            paddingRight: 5
          }, h ? {
            elevation: 5
          } : {
            borderTopColor: constants.COLORS.primaryAlpha10,
            borderTopWidth: ReactNative.StyleSheet.hairlineWidth
          }]
        }, React.default.createElement(FadingEdge.default, {
          left: 20,
          right: 100
        }, React.default.createElement(MiniPlayerContent.default, {
          coverStyle: {
            alignItems: 'center',
            justifyContent: 'center'
          },
          index: t,
          data: r,
          next: function () {
            return n('next');
          },
          prev: function () {
            return n('pre');
          },
          playerOpen: l,
          playMode: p,
          onPress: c,
          isRound: g,
          unknown: m,
          togglePlay: y,
          currentMiniLyric: C,
          randomArray: P
        })), React.default.createElement(ReactNative.View, {
          style: {
            width: 60,
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center'
          }
        }, React.default.createElement(PlayButton.default, {
          size: 25,
          spinSize: 30,
          playState: f,
          loaded: b,
          onPress: y,
          onLongPress: H
        })));
      }
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(React.PureComponent);
exports.default = p;
