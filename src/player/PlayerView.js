Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderPlayerComponent = exports.MiniPlayerWrapper = void 0;
var React = babelHelpers.interopRequireDefault(require("react")),
  ReactNative = require("react-native"),
  reactNativeAnimatable = babelHelpers.interopRequireWildcard(require("react-native-animatable")),
  components = require("../components/index"),
  constants = require("../theme/constants"),
  buttons = babelHelpers.interopRequireDefault(require("./buttons")),
  styles = babelHelpers.interopRequireDefault(require("./styles")),
  utils = require("../utils/index"),
  dimensions = babelHelpers.interopRequireDefault(require("../native/dimensions")),
  module748 = babelHelpers.interopRequireDefault(require("./module-748")),
  module749 = babelHelpers.interopRequireDefault(require("./module-749")),
  module751 = babelHelpers.interopRequireDefault(require("./module-751")),
  module752 = babelHelpers.interopRequireDefault(require("./module-752")),
  module753 = babelHelpers.interopRequireDefault(require("./module-753")),
  module754 = babelHelpers.interopRequireDefault(require("./module-754")),
  module759 = babelHelpers.interopRequireDefault(require("./module-759")),
  module762 = babelHelpers.interopRequireDefault(require("./module-762")),
  module764 = babelHelpers.interopRequireDefault(require("./module-764")),
  module765 = babelHelpers.interopRequireDefault(require("./module-765")),
  module767 = babelHelpers.interopRequireDefault(require("./module-767")),
  module768 = babelHelpers.interopRequireDefault(require("./module-768"));
exports.MiniPlayerWrapper = function (e) {
  var t = e.that,
    a = t.state,
    n = a.currentMiniLyric,
    l = a.playMode,
    i = a.playState,
    o = a.loaded,
    d = a.showLyric,
    s = a.color,
    u = a.isFM,
    c = a.randomArray,
    p = t.props,
    y = p.settings,
    f = y.hideMiniPlayerTopBorder,
    m = y.hideMiniLyric,
    g = y.isRound,
    b = p.playingIndex,
    h = p.tracks;
  return React.default.createElement(module759.default, {
    playingIndex: b,
    tracks: h,
    changeSong: t.changeSong,
    playerOpen: t._playerOpen,
    playMode: l,
    randomArray: c,
    onDetail: t.onDetail,
    playState: i,
    togglePlay: t.togglePlay,
    loaded: o,
    onNowPlaying: t.onNowPlaying,
    onChangePlayStatus: t.onChangePlayStatus,
    showLyric: d,
    color: s,
    hideTopBorder: f,
    isRound: g,
    unknown: true === u,
    currentMiniLyric: !m && 'playing' === i && n
  });
};
exports.renderPlayerComponent = function (e, t) {
  var a = e.state,
    n = a.url,
    l = a.playState,
    E = a.loaded,
    P = a.showSlider,
    H = a.currentTime,
    C = a.duration,
    D = a.playMode,
    I = a.showLyric,
    _ = a.color,
    k = a.showTool,
    v = a.isFM,
    M = a.isLike,
    x = a.lrcText,
    B = a.showTrans,
    F = a.lyricFontSize,
    q = a.showCoverElevation,
    A = a.randomArray,
    N = e.props,
    V = N.settings,
    U = V.navbarPadding,
    z = V.isRound,
    G = V.hideBottomTip,
    W = V.hidePlayingTime,
    Y = V.hideFloatLyric,
    j = V.reverseGestureHands,
    X = V.hideRoundSlider,
    K = N.playingIndex,
    Q = N.tracks,
    J = true === U ? dimensions.default.get('SOFT_MENU_BAR_HEIGHT') : 0,
    Z = e.props.songItemInfo.song,
    $ = false === j ? {
      left: e._sliderPanResponder,
      right: e._volumePanResponder
    } : {
      left: e._volumePanResponder,
      right: e._sliderPanResponder
    },
    ee = null;
  switch (t) {
    case 'QUEUE_NOW':
      if (true === G) return null;
      I || (ee = React.default.createElement(module764.default, {
        extraBottomValue: J,
        animatedOpacity: e.animatedOpacity,
        currentIndex: K + 1,
        tracksLength: Q.length
      }));
      break;
    case 'PLAY_BUTTONS':
      k && (ee = React.default.createElement(module762.default, {
        animatedOpacity: e.animatedOpacity,
        playMode: D,
        playState: l,
        onChangePlayStatus: e.onChangePlayStatus,
        showLyric: I,
        changeSong: e.changeSong,
        togglePlay: e.togglePlay,
        onNowPlaying: e.onNowPlaying,
        color: _,
        loaded: E
      }));
      break;
    case 'LOADING':
      I || k || false !== E || (ee = React.default.createElement(ReactNative.View, {
        style: [styles.default.blankLyric]
      }, React.default.createElement(components.Spinkit, {
        size: 55
      })));
      break;
    case 'SHOW_TOOL':
      if (!k) return null;
      ee = React.default.createElement(ReactNative.View, {
        style: [styles.default.topBtn, {
          right: 10,
          left: null
        }]
      }, React.default.createElement(module752.default, {
        name: buttons.default.CIRCLE.name,
        type: buttons.default.CIRCLE.type,
        color: _,
        size: 23,
        onPress: e.showToolBtn
      }));
      break;
    case 'CLOSE':
      k && (ee = React.default.createElement(ReactNative.View, {
        style: [styles.default.topBtn, {
          left: 10,
          right: null
        }]
      }, React.default.createElement(module752.default, {
        name: buttons.default.CLOSE.name,
        type: buttons.default.CLOSE.type,
        onPress: e._playerClose,
        color: I ? '#fff' : _,
        size: 23
      })));
      break;
    case 'TOTAL_TOOLS':
      k && !I && (ee = React.default.createElement(module768.default, {
        animatedOpacity: e.animatedOpacity,
        onLike: e.onLike,
        onComment: e.onComment,
        onDetail: e.onDetail,
        onFmMode: e.onFmMode,
        onTimer: e.onTimer,
        showLyric: I,
        playState: l,
        color: _,
        isFM: v,
        isLike: M,
        onCheck: e.onCheck
      }));
      break;
    case 'SLIDER':
      if (P) {
        if ((null === e.y0 || !e.sliding) && X && z) return null;
        ee = React.default.createElement(module765.default, {
          SOFT_MENU_HEIGHT: J,
          showLyric: I,
          isRound: z,
          duration: C,
          currentTime: H,
          loaded: E,
          slidingStart: e.slidingStart,
          onSliderValueChange: e.onSliderValueChange,
          slidingEnd: e.slidingEnd,
          width: constants.DEVICE_WIDTH
        });
      }
      break;
    case 'AUTO_FADE_TIME':
      if (z || W) return null;
      (!I && e.sliding || !I && 'paused' === l && E) && (ee = React.default.createElement(module748.default, {
        width: constants.DEVICE_WIDTH,
        animatedOpacity: e.animatedOpacity,
        color: _,
        duration: C,
        currentTime: H
      }));
      break;
    case 'TIME':
      if (true === W) return null;
      I && (ee = React.default.createElement(module767.default, {
        color: _,
        duration: C,
        currentTime: H,
        showLyric: I
      }));
      break;
    case 'LEFT_RESPONDER':
      $.left && (ee = React.default.createElement(ReactNative.View, babelHelpers.extends({
        pointerEvents: I || k ? 'none' : 'auto',
        style: styles.default.vertical
      }, $.left.panHandlers)));
      break;
    case 'RIGHT_RESPONDER':
      $.right && (ee = React.default.createElement(ReactNative.View, babelHelpers.extends({
        pointerEvents: I || k ? 'none' : 'auto',
        style: [styles.default.vertical, {
          left: null,
          right: 0
        }]
      }, $.right.panHandlers)));
      break;
    case 'LYRIC':
      I && (ee = React.default.createElement(module754.default, {
        showTool: k,
        animatedOpacity: e.animatedOpacity,
        hidePlayingTime: W,
        lyric: e.props.lyric,
        hasTrans: e.props.hasTrans,
        playState: l,
        currentTime: H,
        onTap: e.onTap,
        playSound: e.playSound,
        seekTo: e.seekTo,
        lrcText: x,
        showTrans: B,
        changeShowTrans: e.onChangeShowTrans,
        changeFontSize: e.onChangeLyricFontSize,
        lyricFontSize: F,
        getLyricIndex: e.getLyricIndex
      }));
      break;
    case 'FLOAT_LYRIC':
      if (!I && !k && !Y) {
        var te = e.props.lyric;
        if (!te) return;
        ee = React.default.createElement(module753.default, {
          currentTime: H,
          getLyricIndex: e.getLyricIndex,
          lyric: te,
          showTrans: B,
          animatedOpacity: e.animatedOpacity,
          SOFT_MENU_HEIGHT: J,
          width: constants.DEVICE_WIDTH,
          isRound: z
        });
      }
      break;
    case 'RESPONDER_TEXT':
      e.y0 && e.sliding && (ee = React.default.createElement(reactNativeAnimatable.View, {
        pointerEvents: 'none',
        animation: "fadeIn",
        style: [{
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          bottom: 100,
          alignSelf: 'center'
        }]
      }, React.default.createElement(ReactNative.Text, {
        style: [styles.default.text, {
          fontSize: 16
        }]
      }, utils.timeFormatter.parseTime(H), ' / ', utils.timeFormatter.parseTime(C))));
      break;
    case 'COVER':
      false === I && (ee = React.default.createElement(ReactNative.Animated.View, {
        style: [styles.default.lyric, false === k && styles.default.toolHide, {
          opacity: e.animatedOpacity
        }]
      }, React.default.createElement(module749.default, {
        reverseGestureHands: j,
        onPlay: k ? null : e.togglePlay,
        onTap: e.onTap,
        url: n,
        song: Z,
        data: Q,
        index: K,
        randomArray: A,
        onNext: function () {
          return e.changeSong('next');
        },
        onPrev: function () {
          return e.changeSong('pre');
        },
        unknown: v,
        playMode: D,
        playState: l,
        playerClose: e._playerClose,
        showToolBtn: e.showToolBtn,
        onDetail: e.onDetail,
        onNowPlaying: e.onNowPlaying,
        isRound: z,
        showTool: k,
        showElevation: q
      })));
      break;
    case 'COVER_TITLE':
      if (true === I) {
        var ae = e.props.songItemInfo.singer,
          ne = (0, utils.parseArtist)(ae);
        ee = React.default.createElement(module751.default, {
          viewStyle: [styles.default.songTitleCon, false === k && {
            alignItems: 'center',
            alignSelf: 'center',
            top: constants.STATUS_BAR_HEIGHT
          }],
          title: Z,
          subtitle: ne,
          numberOfLines: 1,
          titleStyle: [styles.default.text, 'paused' === l && {
            opacity: .7
          }],
          authorStyle: {
            fontSize: 13
          },
          onPress: e.togglePlay
        });
      }
      break;
    case 'BACKGROUND_MAX':
      ee = React.default.createElement(components.Background, {
        blur: true,
        coverUrl: n,
        bgStyle: {
          top: null,
          bottom: 0
        },
        imageStyle: [z && {
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0
        }, I && {
          opacity: .7,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0
        }]
      });
  }
  return ee;
};
