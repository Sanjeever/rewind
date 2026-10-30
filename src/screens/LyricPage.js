const _default = require("./../components/Text.js").default;
const _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");
const _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var immer = require("immer"),
  React = _interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  providers = _interopRequireDefault(require("../services/providers")),
  constants = require("../theme/constants"),
  endpoints = require("../services/endpoints"),
  services = require("../services/index"),
  utils = require("../utils/index"),
  trackInfo = require("../services/trackInfo"),
  LyricText = _interopRequireDefault(require("./lyrics/LyricText")),
  p = class t extends React.PureComponent {
    constructor() {
      var e, r, n;
      for (var a = arguments.length, s = new Array(a), c = 0; c < a; c++) s[c] = arguments[c];
      return r = n = super(...s), n.state = {
        img: null,
        songName: null,
        qrcode: null,
        trans: [],
        lyric: []
      }, n.songName = function (e) {
        var t = (0, utils.parseArtist)(e.singer);
        return e.song + " \xb7 " + t;
      }, n.getQRCode = function (e, t) {
        var r;
        switch (t) {
          case providers.default.netEase:
            r = "http://music.163.com/song?id=" + e;
            break;
          case providers.default.qqMusic:
            r = "https://y.qq.com/n/yqq/song/" + e + ".html";
        }
        n.setState({
          qrcode: endpoints.QRCODE_API + "?text=" + r + "&size=128&margin=0"
        });
      }, n.getLyric = function (e, t) {
        switch (t) {
          case providers.default.netEase:
            services.Netease.lyric(e).then(function (e) {
              var t = (0, utils.parseLyric)(e.lrc.lyric),
                r = [];
              e.tlyric.lyric && (r = (0, utils.parseLyric)(e.tlyric.lyric));
              e.transUser && t.push({
                txt: '\u7ffb\u8bd1\u8d21\u732e\u8005\uff1a' + e.transUser.nickname
              });
              n.setState({
                lyric: t,
                trans: r
              });
            }).catch(function () {
              return null;
            });
            break;
          case providers.default.qqMusic:
            services.QQMusic.getLyric(e).then(function (e) {
              var t = e.lyric,
                r = e.trans;
              n.setState({
                lyric: t,
                trans: r
              });
            });
        }
      }, n.onClose = function () {
        n.props.navigation.goBack();
      }, n.renderTxt = function (e) {
        return e.replace(/&apos;/gm, "'").replace(/\/\//g, '').replace(/&quot;/g, '"').replace(/\[.+\]/gi, '');
      }, n.getTrans = function (e) {
        var t = n.state.trans;
        return (null === t || void 0 === t ? void 0 : t.length) > 0 ? t.find(function (t) {
          return e === t.total || Math.abs(e - t.total) < 1;
        }) : null;
      }, n.renderItem = function (e) {
        var t = e.item,
          r = e.index,
          a = n.getTrans(t.total),
          i = t.hidden || false;
        return React.default.createElement(LyricText.default, {
          hidden: i,
          lyric: n.renderTxt(t.txt),
          trans: a ? n.renderTxt(a.txt) : '',
          onPress: function () {
            return n.onPress(r);
          }
        });
      }, n.onPress = function (e) {
        var t = (0, immer.produce)(n.state.lyric, function (t) {
          t[e].hidden = !t[e].hidden || !t[e].hidden;
        });
        n.setState({
          lyric: t
        });
      }, r;
    }
    "componentDidMount"() {
      var e = this.props.route.params;
      if (e) {
        var t = e.id,
          r = e.api,
          n = e.item,
          a = (0, trackInfo.extractFullInfo)(n, 'big');
        this.setState({
          img: a.img,
          songName: this.songName(a)
        });
        this.getLyric(t, r);
        this.getQRCode(t, r);
        ReactNative.StatusBar.setHidden(true);
      }
    }
    "componentWillUnmount"() {
      ReactNative.StatusBar.setHidden(false);
    }
    "render"() {
      var e = this,
        t = this.state,
        r = t.lyric,
        n = t.img,
        a = t.songName,
        i = t.qrcode;
      return React.default.createElement(ReactNative.Modal, {
        animationType: "fade",
        transparent: true,
        onRequestClose: this.onClose
      }, React.default.createElement(ReactNative.View, {
        style: h.container
      }, React.default.createElement(ReactNative.ScrollView, null, React.default.createElement(ReactNative.View, {
        style: {
          height: constants.STATUS_BAR_HEIGHT
        }
      }), React.default.createElement(ReactNative.View, {
        style: h.cover
      }, n ? React.default.createElement(ReactNative.Image, {
        style: h.coverImg,
        source: {
          uri: n
        }
      }) : null, i ? React.default.createElement(ReactNative.Image, {
        source: {
          uri: i
        },
        style: h.qrcode
      }) : null), r.map(function (t, r) {
        return e.renderItem({
          item: t,
          index: r
        });
      }), React.default.createElement(ReactNative.View, {
        style: h.info
      }, React.default.createElement(_default, {
        style: [h.text, h.songName]
      }, "\u2014\u2014 ", a)), React.default.createElement(ReactNative.View, {
        style: {
          height: constants.STATUS_BAR_HEIGHT
        }
      }))));
    }
  },
  h = ReactNative.StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff'
    },
    text: {
      color: '#000',
      fontSize: 14
    },
    cover: {
      marginVertical: .05 * constants.DEVICE_WIDTH,
      alignSelf: 'center',
      height: .9 * constants.DEVICE_WIDTH,
      width: .9 * constants.DEVICE_WIDTH
    },
    coverImg: {
      width: '100%',
      height: '100%',
      borderRadius: 6
    },
    songName: {
      padding: 5,
      fontSize: 16
    },
    info: {
      paddingVertical: 8,
      paddingHorizontal: .05 * constants.DEVICE_WIDTH
    },
    qrcode: {
      width: 40,
      height: 40,
      right: 0,
      bottom: 0,
      position: 'absolute'
    }
  }),
  y = p;
exports.default = y;
