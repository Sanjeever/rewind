const _default = require("./../components/Text.js").default;
const _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");
const _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  FadingEdge = _interopRequireDefault(require("../components/FadingEdge")),
  reactNativeSpringScrollview = require("./../components/Scrolling.js"),
  TouchableScale = _interopRequireDefault(require("../components/TouchableScale")),
  components = require("../components/index"),
  providers = _interopRequireDefault(require("../services/providers")),
  icons = _interopRequireDefault(require("../theme/icons")),
  locales = _interopRequireDefault(require("../locales/index")),
  users = _interopRequireDefault(require("../storage/users")),
  m = class t extends React.PureComponent {
    constructor() {
      var e, r, l;
      for (var a = arguments.length, o = new Array(a), i = 0; i < a; i++) o[i] = arguments[i];
      return r = l = super(...o), l.state = {
        api: providers.default.netEase,
        playlist: []
      }, l.loadPlaylist = async function (api) {
        const stored = await users.default.getUserPlayList();
        if (api === providers.default.netEase) l.setState({
          playlist: stored?.netEase || []
        });
      }, l.onTop = function () {
        var e, t;
        null === (e = (t = l._scrollView).scrollToBegin) || void 0 === e || e.call(t);
      }, l._renderItem = function (e) {
        var t = e.item,
          r = l.formatItem(t);
        return React.default.createElement(y, {
          title: r.title,
          img: r.img,
          onPress: function () {
            return l.props.onSelect(t);
          },
          trackCount: r.trackCount
        });
      }, l.formatItem = function (e) {
        var t = {};
        l.state.api === providers.default.netEase && (t.title = e.name, t.img = e.coverImgUrl + '?param=200y200', t.trackCount = e.trackCount);
        return t;
      }, r;
    }
    "componentDidMount"() {
      this.loadPlaylist(this.state.api);
    }
    "render"() {
      var e = this,
        t = this.props,
        r = t.visible,
        l = t.onRequestClose,
        a = this.state.playlist;
      return React.default.createElement(ReactNative.Modal, {
        animationType: "fade",
        transparent: true,
        onRequestClose: l,
        visible: r
      }, React.default.createElement(ReactNative.View, {
        style: h.container
      }, React.default.createElement(components.Background, {
        imageStyle: {
          opacity: .5
        },
        blur: true
      }), React.default.createElement(ReactNative.TouchableWithoutFeedback, {
        onPress: this.onClosed
      }, React.default.createElement(ReactNative.View, {
        style: [ReactNative.StyleSheet.absoluteFill]
      })), React.default.createElement(TouchableScale.default, {
        onPress: this.onTop
      }, React.default.createElement(_default, {
        style: [h.text, h.title]
      }, locales.default.COMPARE_WITH)), React.default.createElement(FadingEdge.default, {
        top: 30
      }, React.default.createElement(reactNativeSpringScrollview.SpringScrollView, {
        ref: function (t) {
          return e._scrollView = t;
        },
        style: {
          paddingHorizontal: '20%'
        }
      }, a.map(function (t, r) {
        return e._renderItem({
          item: t,
          index: r
        });
      }), React.default.createElement(ReactNative.View, {
        style: h.footer
      })))));
    }
  },
  y = class t extends React.PureComponent {
    constructor() {
      return super(...arguments);
    }
    "render"() {
      var e = this.props,
        t = e.onPress,
        r = e.title,
        l = e.img,
        a = e.trackCount;
      return React.default.createElement(ReactNative.TouchableOpacity, {
        onPress: t,
        style: {
          marginTop: 15,
          alignItems: 'center'
        }
      }, l ? React.default.createElement(ReactNative.Image, {
        style: h.cover,
        source: {
          uri: l
        }
      }) : React.default.createElement(ReactNative.View, {
        style: [h.cover, {
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fff'
        }]
      }, React.default.createElement(components.Icon, {
        name: icons.default.DISC,
        size: 35,
        color: '#111'
      })), React.default.createElement(_default, {
        numberOfLines: 2,
        style: [h.text, {
          fontSize: 14,
          marginTop: 5,
          fontWeight: 'bold',
          textAlign: 'center'
        }]
      }, r), React.default.createElement(_default, {
        style: [h.text, {
          fontSize: 14,
          marginTop: -3
        }]
      }, "- ", a, " -"));
    }
  },
  h = ReactNative.StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000',
      alignItems: 'center'
    },
    text: {
      fontSize: 16
    },
    title: {
      marginTop: '15%',
      marginBottom: 10,
      fontWeight: 'bold'
    },
    cover: {
      height: 80,
      width: 80,
      borderRadius: 40
    },
    footer: {
      height: 50
    }
  }),
  g = m;
exports.default = g;
