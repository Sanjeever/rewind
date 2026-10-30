Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  reactNativeAnimatable = babelHelpers.interopRequireWildcard(require("react-native-animatable")),
  components = require("../components/index"),
  providers = babelHelpers.interopRequireDefault(require("../services/providers")),
  constants = require("../theme/constants"),
  names = babelHelpers.interopRequireDefault(require("../events/names")),
  icons = babelHelpers.interopRequireDefault(require("../theme/icons")),
  locales = babelHelpers.interopRequireDefault(require("../locales/index")),
  events = require("../events/index"),
  trackInfo = require("../services/trackInfo"),
  sharedUrlsModule = require("../services/sharedUrls"),
  h = function (e) {
    return e.replace(/100y100/gi, '500y500').replace(/150x150/, '500x500');
  },
  C = 'song',
  y = 'artist',
  I = 'album',
  v = function (e) {
    function t() {
      var e, n, a;
      babelHelpers.classCallCheck(this, t);
      for (var l = arguments.length, r = new Array(l), o = 0; o < l; o++) r[o] = arguments[o];
      return babelHelpers.possibleConstructorReturn(a, (n = a = babelHelpers.possibleConstructorReturn(this, (e = babelHelpers.getPrototypeOf(t)).call.apply(e, [this].concat(r))), a.state = {
        visible: false,
        defaultType: true
      }, a.onClose = function () {
        a.setState({
          visible: false,
          defaultType: true,
          obj: null,
          item: null
        });
      }, a.getImg = function (e) {
        if (e) {
          var t = (0, trackInfo.extractFullInfo)(e);
          return h(t.img);
        }
      }, a.onChangeType = function () {
        a.setState({
          defaultType: !a.state.defaultType
        });
      }, a.onPressIcon = function (e) {
        var t = a.state,
          n = t.obj,
          l = t.defaultType;
        t.item && (false === l ? a.openUrl(n, e) : 'song' === e ? a.copy(n.song) : 'artist' === e ? a.copy(n.singer[0].name) : 'album' === e && a.copy(n.album), a.onClose());
      }, a.openUrl = function (e, t) {
        var n,
          l = e.api,
          r = T(a.state.item, t);
        l === providers.default.netEase ? n = sharedUrlsModule.sharedUrls.netEase[t] + r : l === providers.default.qqMusic && (n = sharedUrlsModule.sharedUrls.qqMusic[t] + r + '.html');
        a.linking(n);
      }, a.copy = function (e) {
        ReactNative.Clipboard.setString(e);
        toast(locales.default.COPIED + " " + e);
      }, a.linking = function (e) {
        ReactNative.Linking.openURL(e);
      }, n));
    }
    babelHelpers.createClass(t, [{
      key: "componentDidMount",
      value: function () {
        var e = this;
        this.sub = events.emitter.addListener(names.default.LongPressModal, function (t) {
          var n = t.item;
          e.setState({
            item: n,
            obj: (0, trackInfo.extractFullInfo)(n),
            visible: true
          });
        });
      }
    }, {
      key: "componentWillUnmount",
      value: function () {
        var e, t;
        null === (e = (t = this.sub).remove) || void 0 === e || e.call(t);
      }
    }, {
      key: "render",
      value: function () {
        var e = this,
          t = this.state,
          n = t.visible,
          a = t.item,
          l = this.getImg(a);
        return React.default.createElement(ReactNative.Modal, {
          animationType: "fade",
          onRequestClose: this.onClose,
          visible: n
        }, React.default.createElement(ReactNative.View, {
          style: H.container
        }, l && React.default.createElement(components.Background, {
          blur: true,
          coverUrl: l
        }), React.default.createElement(ReactNative.TouchableWithoutFeedback, {
          onPress: this.onClose
        }, React.default.createElement(ReactNative.View, {
          style: [ReactNative.StyleSheet.absoluteFill]
        })), React.default.createElement(reactNativeAnimatable.View, {
          useNativeDriver: true,
          animation: "bounceIn",
          easing: 'ease-out',
          style: H.imgCon
        }, React.default.createElement(ReactNative.Image, {
          style: H.img,
          source: {
            uri: l
          }
        }), React.default.createElement(ReactNative.View, {
          style: {
            flex: 1,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 20
          }
        }, React.default.createElement(components.Icon, {
          name: this.state.defaultType ? icons.default.CONTENT_COPY : icons.default.LINK_VARIANT,
          onPress: this.onChangeType,
          color: "#000"
        }), React.default.createElement(components.Icon, {
          name: icons.default.MUSIC_CIRCLE_OUTLINE,
          onPress: function () {
            return e.onPressIcon(C);
          },
          color: "#000"
        }), React.default.createElement(components.Icon, {
          name: icons.default.ACCOUNT_MUSIC_OUTLINE,
          onPress: function () {
            return e.onPressIcon(y);
          },
          color: "#000"
        }), React.default.createElement(components.Icon, {
          name: icons.default.ALBUM,
          onPress: function () {
            return e.onPressIcon(I);
          },
          color: "#000"
        })))));
      }
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(React.PureComponent),
  E = function (e, t) {
    switch (t) {
      case 'song':
        return e;
      case 'artist':
        return (e.singer || e.ar || e.artist)[0];
      case 'album':
        return e.al || e.album;
    }
  },
  T = function (e, t) {
    var n,
      a = E(e, t);
    switch (t) {
      case 'song':
        n = a.songmid || a.mid || a.id;
        break;
      case 'artist':
        n = a.mid || a.id;
        break;
      case 'album':
        n = e.albummid || a.mid || a.id;
    }
    return n;
  },
  H = ReactNative.StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    imgCon: {
      backgroundColor: '#fff',
      justifyContent: 'center',
      height: .95 * constants.DEVICE_WIDTH,
      width: .8 * constants.DEVICE_WIDTH,
      borderRadius: 15,
      elevation: 2
    },
    img: {
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
      height: .8 * constants.DEVICE_WIDTH,
      width: .8 * constants.DEVICE_WIDTH
    }
  }),
  D = v;
exports.default = D;
