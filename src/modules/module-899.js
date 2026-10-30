Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  FadingEdge = babelHelpers.interopRequireDefault(require("../components/FadingEdge")),
  reactNativeSpringScrollview = require("react-native-spring-scrollview"),
  module547 = babelHelpers.interopRequireDefault(require("./module-547")),
  components = require("../components/index"),
  providers = babelHelpers.interopRequireDefault(require("../services/providers")),
  icons = babelHelpers.interopRequireDefault(require("../theme/icons")),
  locales = babelHelpers.interopRequireDefault(require("../locales/index")),
  users = babelHelpers.interopRequireDefault(require("../storage/users")),
  m = function (e) {
    function t() {
      var e, r, l;
      babelHelpers.classCallCheck(this, t);
      for (var a = arguments.length, o = new Array(a), i = 0; i < a; i++) o[i] = arguments[i];
      return babelHelpers.possibleConstructorReturn(l, (r = l = babelHelpers.possibleConstructorReturn(this, (e = babelHelpers.getPrototypeOf(t)).call.apply(e, [this].concat(o))), l.state = {
        api: providers.default.netEase,
        playlist: []
      }, l.loadPlaylist = function (e) {
        var t;
        return regeneratorRuntime.async(function (r) {
          for (;;) switch (r.prev = r.next) {
            case 0:
              r.next = 2;
              return regeneratorRuntime.awrap(users.default.getUserPlayList());
            case 2:
              if ((t = r.sent) || 0 !== Object.keys(t).length) {
                r.next = 5;
                break;
              }
              return r.abrupt("return");
            case 5:
              r.t0 = e;
              r.next = r.t0 === providers.default.netEase ? 8 : 10;
              break;
            case 8:
              t.netEase && l.setState({
                playlist: t.netEase
              });
              return r.abrupt("break", 10);
            case 10:
            case "end":
              return r.stop();
          }
        }, null, this);
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
      }, r));
    }
    babelHelpers.createClass(t, [{
      key: "componentDidMount",
      value: function () {
        this.loadPlaylist(this.state.api);
      }
    }, {
      key: "render",
      value: function () {
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
        })), React.default.createElement(module547.default, {
          onPress: this.onTop
        }, React.default.createElement(ReactNative.Text, {
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
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(React.PureComponent),
  y = function (e) {
    function t() {
      babelHelpers.classCallCheck(this, t);
      return babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(t).apply(this, arguments));
    }
    babelHelpers.createClass(t, [{
      key: "render",
      value: function () {
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
        })), React.default.createElement(ReactNative.Text, {
          numberOfLines: 2,
          style: [h.text, {
            fontSize: 14,
            marginTop: 5,
            fontWeight: 'bold',
            textAlign: 'center'
          }]
        }, r), React.default.createElement(ReactNative.Text, {
          style: [h.text, {
            fontSize: 14,
            marginTop: -3
          }]
        }, "- ", a, " -"));
      }
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(React.PureComponent),
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
