const _default = require("./../components/Pager.js").default;
const _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");
const _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
const _extends = require("@babel/runtime/helpers/extends");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  components = require("../components/index"),
  constants = require("../theme/constants"),
  names = _interopRequireDefault(require("../events/names")),
  events = require("../events/index"),
  utils = require("../utils/index"),
  trackInfo = require("../services/trackInfo"),
  playOrder = require("./playOrder"),
  TrackTitle = _interopRequireDefault(require("./TrackTitle")),
  g = class t extends React.PureComponent {
    constructor() {
      var e, n, r;
      for (var a = arguments.length, g = new Array(a), y = 0; y < a; y++) g[y] = arguments[y];
      return n = r = super(...g), r._onPanResponderRelease = function (e, t) {
        var n = r.props,
          a = n.onTap,
          o = n.playerClose,
          l = n.showToolBtn,
          i = n.onDetail,
          s = n.onNowPlaying,
          u = n.reverseGestureHands;
        if (!(t.y0 < 50)) {
          var d = t.dy,
            p = t.dx,
            c = l,
            f = o,
            h = u ? i : s,
            g = u ? s : i;
          Math.abs(d) > Math.abs(p) ? d < -10 ? c() : d > 10 ? f() : a() : p > 20 ? g() : p < -20 ? h() : a();
        }
      }, r._panResponder = ReactNative.PanResponder.create({
        onStartShouldSetPanResponder: function () {
          return true;
        },
        onStartShouldSetPanResponderCapture: function () {
          return true;
        },
        onMoveShouldSetPanResponder: function () {
          return true;
        },
        onMoveShouldSetPanResponderCapture: function () {
          return true;
        },
        onPanResponderRelease: r._onPanResponderRelease
      }), r.renderCoverImage = function () {
        var e = r.props,
          t = e.isRound,
          n = e.url,
          a = e.showElevation,
          u = e.showTool,
          d = .65 * constants.DEVICE_WIDTH;
        return false === t ? React.default.createElement(React.default.Fragment, null, React.default.createElement(ReactNative.Image, {
          source: {
            uri: n
          },
          style: m.img
        }), u && React.default.createElement(React.default.Fragment, null, React.default.createElement(components.GradientMask, {
          from: "top",
          style: {
            height: 80,
            top: 0
          }
        }), React.default.createElement(components.GradientMask, {
          from: "bottom",
          style: {
            height: 50,
            top: constants.DEVICE_WIDTH - 50
          }
        }))) : React.default.createElement(ReactNative.View, {
          style: [m.coverCon, {
            flex: 1,
            backgroundColor: 0
          }]
        }, React.default.createElement(ReactNative.View, {
          style: [{
            width: d,
            height: d,
            borderRadius: d / 2
          }, true === a && {
            elevation: 5
          }]
        }, React.default.createElement(ReactNative.Image, {
          source: {
            uri: n
          },
          style: {
            width: d,
            height: d,
            borderRadius: d / 2
          }
        })));
      }, r.onPageSelected = function (e) {
        var t = e.nativeEvent.position;
        if (1 !== t) {
          var n = r.props,
            a = n.onPrev,
            o = n.onNext;
          0 === t ? a() : o();
          r.pager.setPageWithoutAnimation(1);
        }
      }, r.renderItem = function (e) {
        var t = r.props,
          n = t.index,
          a = t.data,
          i = t.unknown,
          s = t.playMode,
          u = t.playState,
          d = t.randomArray,
          g = (0, playOrder.getNextPlayIndexByPagerPos)({
            pos: e,
            playMode: s,
            playingIndex: n,
            randomArray: d,
            len: a.length
          }),
          y = i && 2 === e ? {
            song: '? ? ?'
          } : (0, trackInfo.extractFullInfo)(a[g]);
        return React.default.createElement(ReactNative.View, {
          style: {
            flex: 1
          },
          key: e
        }, React.default.createElement(TrackTitle.default, {
          onPress: r.props.onPlay,
          viewStyle: [m.songTitleCon, {
            paddingHorizontal: 70
          }],
          title: y.song,
          subtitle: y.singer && (0, utils.parseArtist)(y.singer),
          authorStyle: {
            fontSize: 14,
            textAlign: 'center'
          },
          titleStyle: [{
            fontSize: 18,
            textAlign: 'center'
          }, 'paused' === u && {
            opacity: .7
          }],
          numberOfLines: 2
        }));
      }, r.savePic = function (e, t) {
        events.emitter.emit(names.default.SavePicModal, {
          img: e,
          song: t
        });
      }, n;
    }
    "shouldComponentUpdate"(e) {
      var t = this.props,
        n = t.song,
        r = t.showTool,
        a = t.url,
        o = t.playState;
      return n !== e.song || r !== e.showTool || a !== e.url || o !== e.playState;
    }
    "render"() {
      var e = this,
        t = this.props,
        n = t.url,
        r = t.containerStyle;
      return React.default.createElement(ReactNative.View, {
        style: [m.container, r]
      }, React.default.createElement(ReactNative.View, _extends({
        onLongPress: this.props.onTap,
        style: m.coverCon
      }, this._panResponder.panHandlers), '' !== n ? this.renderCoverImage() : null), React.default.createElement(_default, {
        ref: function (t) {
          return e.pager = t;
        },
        onPageSelected: this.onPageSelected,
        initialPage: 1,
        style: {
          height: constants.DEVICE_HEIGHT - constants.DEVICE_WIDTH - 150,
          width: constants.DEVICE_WIDTH,
          flex: 1
        }
      }, this.renderItem(0), this.renderItem(1), this.renderItem(2)));
    }
  },
  m = ReactNative.StyleSheet.create({
    container: {
      height: '100%',
      width: '100%',
      alignItems: 'center'
    },
    songTitleCon: {
      paddingTop: 20,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    coverCon: {
      width: constants.DEVICE_WIDTH,
      height: constants.DEVICE_WIDTH,
      alignItems: 'center',
      justifyContent: 'center'
    },
    img: {
      position: 'absolute',
      width: '100%',
      height: '100%'
    }
  }),
  y = g;
exports.default = y;
