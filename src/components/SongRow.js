Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  reactNativeAnimatable = babelHelpers.interopRequireWildcard(require("react-native-animatable")),
  TouchableScale = babelHelpers.interopRequireDefault(require("./TouchableScale")),
  components = require("./index"),
  constants = require("../theme/constants"),
  icons = babelHelpers.interopRequireDefault(require("../theme/icons")),
  events = require("../events/index"),
  utils = require("../utils/index"),
  g = function (e) {
    function t(e) {
      var n;
      babelHelpers.classCallCheck(this, t);
      (n = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(t).call(this, e))).handleOnPress = function () {
        requestAnimationFrame(function () {
          var e, t;
          null === (e = (t = n.props).onPress) || void 0 === e || e.call(t);
        });
      };
      n.onLongPress = function () {
        var e = n.props.songItem;
        e && (0, events.toLongPressModal)({
          item: e
        });
      };
      n.state = {
        singer: null,
        song: '',
        album: ''
      };
      return n;
    }
    babelHelpers.createClass(t, [{
      key: "render",
      value: function () {
        var e = this.props,
          t = e.img,
          n = e.index,
          a = e.song,
          l = e.album,
          o = e.singer,
          u = e.detail,
          f = e.onMV,
          g = e.showMV,
          y = e.textStyle,
          x = e.playing,
          v = e.addToQueue,
          R = e.containerStyle,
          C = e.deleteBtn,
          w = e.isExist,
          P = e.alias,
          H = e.isChecked,
          O = e.disabled,
          k = e.showRank,
          _ = void 0 !== k && k,
          S = e.lastRank,
          L = o && (0, utils.parseArtist)(o);
        return React.default.createElement(ReactNative.TouchableNativeFeedback, {
          disabled: O,
          onPress: this.handleOnPress,
          onLongPress: this.onLongPress
        }, React.default.createElement(ReactNative.View, {
          style: [T.container, R]
        }, true === H && React.default.createElement(reactNativeAnimatable.View, {
          useNativeDriver: true,
          animation: "fadeIn",
          style: {
            width: 5,
            height: '100%',
            backgroundColor: constants.COLORS.secondary,
            borderRadius: 1
          }
        }), b({
          img: t,
          addToQueue: v
        }), p({
          index: n,
          img: t,
          addToQueue: v,
          playing: x,
          showRank: _,
          lastRank: S
        }), I({
          textStyle: y,
          song: a,
          playing: x,
          alias: P,
          isExist: w,
          singers: L,
          album: l
        }), g && f ? React.default.createElement(E, {
          onPress: f
        }) : null, u ? React.default.createElement(h, {
          onPress: u,
          style: T.next
        }) : null, C ? React.default.createElement(h, {
          name: icons.default.WINDOW_CLOSE,
          size: 20,
          onPress: C,
          style: T.delete
        }) : null));
      }
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(React.PureComponent),
  E = function (e) {
    var t = e.onPress;
    return React.default.createElement(ReactNative.TouchableOpacity, {
      onPress: t,
      style: {
        height: '100%',
        paddingLeft: 10,
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, React.default.createElement(components.Icon, {
      name: icons.default.PLAY,
      size: 12,
      style: T.mv
    }));
  },
  h = function (e) {
    var t = e.style,
      n = e.onPress,
      a = e.name,
      l = e.size;
    return React.default.createElement(TouchableScale.default, {
      onPress: n,
      activeScale: .7
    }, React.default.createElement(ReactNative.View, {
      style: t
    }, React.default.createElement(components.Icon, {
      name: a || icons.default.DOTS_VERTICAL,
      size: l || 20
    })));
  },
  y = function (e) {
    var t = e.showRank,
      n = e.lastRank,
      a = e.index;
    if (t) {
      var l = '',
        s = '';
      if (n || 0 === n) {
        var o = n - a;
        if (0 === o) s = icons.default.TRENDING_NEUTRAL;else {
          s = o > 0 ? icons.default.TRENDING_UP : icons.default.TRENDING_DOWN;
          l = Math.abs(o);
        }
      } else s = icons.default.NEW_BOX;
      return React.default.createElement(ReactNative.View, {
        style: {
          alignItems: 'center'
        }
      }, s ? React.default.createElement(components.Icon, {
        name: s,
        size: 15
      }) : null, l ? React.default.createElement(ReactNative.Text, {
        style: T.rank
      }, l) : null);
    }
  },
  b = function (e) {
    var t = e.img,
      n = e.addToQueue;
    if (t) return React.default.createElement(TouchableScale.default, {
      onPress: n
    }, React.default.createElement(ReactNative.View, {
      style: T.key
    }, React.default.createElement(ReactNative.Image, {
      style: [T.img],
      source: {
        uri: t
      }
    })));
  },
  p = function (e) {
    var t = e.index,
      n = e.img,
      a = e.addToQueue,
      l = e.playing,
      s = e.showRank,
      o = e.lastRank;
    if (null !== t && !n) return React.default.createElement(ReactNative.TouchableOpacity, {
      onPress: a
    }, React.default.createElement(ReactNative.View, {
      style: T.index
    }, l ? React.default.createElement(components.Icon, {
      name: icons.default.EMOTICON_HAPPY_OUTLINE,
      size: 20
    }) : React.default.createElement(ReactNative.Text, {
      style: [T.song, T.indexText]
    }, 1 + (0 | t)), y({
      showRank: s,
      lastRank: o,
      index: t
    })));
  },
  I = function (e) {
    var t = e.textStyle,
      n = e.song,
      a = e.playing,
      l = e.alias,
      o = e.isExist,
      d = e.singers,
      f = e.album;
    return React.default.createElement(ReactNative.View, {
      style: [T.textCon, t]
    }, React.default.createElement(ReactNative.Text, {
      numberOfLines: 1,
      style: [T.song, a && {
        fontWeight: 'bold'
      }]
    }, n, l && React.default.createElement(ReactNative.Text, {
      style: T.alias
    }, " (", l, ")")), React.default.createElement(ReactNative.View, {
      style: {
        flexDirection: 'row'
      }
    }, o ? React.default.createElement(reactNativeAnimatable.View, {
      animation: "fadeIn",
      useNativeDriver: true
    }, React.default.createElement(components.Icon, {
      name: icons.default.CHECK_CIRCLE,
      size: 15,
      style: {
        marginRight: 3
      }
    })) : null, (null === d || void 0 === d ? void 0 : d.length) > 0 ? React.default.createElement(ReactNative.Text, {
      numberOfLines: 1,
      style: [T.singer]
    }, d, " ", f && '|  ' + f) : null));
  },
  T = ReactNative.StyleSheet.create({
    container: {
      height: constants.ITEM_HEIGHT,
      width: '100%',
      alignItems: 'center',
      flexDirection: 'row',
      padding: 5
    },
    img: {
      width: 50,
      height: 50,
      borderRadius: 25
    },
    textCon: {
      flex: 1
    },
    song: {
      fontSize: 15
    },
    alias: {
      fontSize: 13,
      color: constants.COLORS.primaryAlpha70
    },
    singer: {
      fontSize: 12,
      opacity: .8
    },
    key: {
      width: constants.ITEM_HEIGHT,
      height: constants.ITEM_HEIGHT,
      alignItems: 'center',
      justifyContent: 'center'
    },
    index: {
      width: 40,
      height: constants.ITEM_HEIGHT,
      alignItems: 'center',
      justifyContent: 'center',
      opacity: .8
    },
    indexText: {
      fontSize: 14
    },
    next: {
      height: constants.ITEM_HEIGHT,
      width: 50,
      alignItems: 'center',
      justifyContent: 'center'
    },
    delete: {
      height: constants.ITEM_HEIGHT,
      width: 50,
      alignItems: 'center',
      justifyContent: 'center'
    },
    mv: {
      height: 15,
      width: 20,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      borderRadius: 5,
      borderWidth: 1,
      borderColor: constants.COLORS.secondary,
      opacity: .8
    },
    rank: {
      fontSize: 9
    }
  }),
  x = g;
exports.default = x;
