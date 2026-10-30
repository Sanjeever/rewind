Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  components = require("../components/index"),
  actions = babelHelpers.interopRequireDefault(require("../screens/home/actions")),
  names = babelHelpers.interopRequireDefault(require("../events/names")),
  locales = babelHelpers.interopRequireDefault(require("../locales/index")),
  services = require("../services/index"),
  events = require("../events/index"),
  p = function (e) {
    function t() {
      var e, n, a;
      babelHelpers.classCallCheck(this, t);
      for (var r = arguments.length, s = new Array(r), l = 0; l < r; l++) s[l] = arguments[l];
      return babelHelpers.possibleConstructorReturn(a, (n = a = babelHelpers.possibleConstructorReturn(this, (e = babelHelpers.getPrototypeOf(t)).call.apply(e, [this].concat(s))), a.state = {
        netEaseLogined: true
      }, a.checkNetEaseLogined = function () {
        var e;
        return regeneratorRuntime.async(function (t) {
          for (;;) switch (t.prev = t.next) {
            case 0:
              t.next = 2;
              return regeneratorRuntime.awrap(services.Netease.cloud(1));
            case 2:
              (e = t.sent) && (301 === e.code ? a.setState({
                netEaseLogined: false
              }) : a.setState({
                netEaseLogined: true
              }));
            case 4:
            case "end":
              return t.stop();
          }
        }, null, this);
      }, a.sponsor = function () {
        events.emitter.emit(names.default.SavePicModal, {
          type: 'sponsor',
          song: 'sponsor'
        });
      }, a.onPress = function (e) {
        var t = a.props,
          n = t.envelop,
          r = t.about,
          s = t.settings,
          l = t.update,
          o = t.timer,
          i = t.cloud,
          u = t.feature;
        switch (e.name) {
          case locales.default.INBOX:
            n();
            break;
          case locales.default.ABOUT:
            r();
            break;
          case locales.default.SETTING:
            s();
            break;
          case locales.default.UPDATE:
            l();
            break;
          case locales.default.COUNTDOWN:
            o();
            break;
          case locales.default.SPONSOR:
            a.sponsor();
            break;
          case locales.default.CLOUD_DRIVE:
            i();
            break;
          case locales.default.FEATURE:
            u();
        }
      }, n));
    }
    babelHelpers.createClass(t, [{
      key: "componentDidMount",
      value: function () {
        var e = this;
        this.checkNetEaseLogined();
        this.sub = events.emitter.addListener(names.default.UserLogined, function () {
          setTimeout(function () {
            e.checkNetEaseLogined();
          }, 500);
        });
      }
    }, {
      key: "componentWillUnmount",
      value: function () {
        this.sub.remove();
      }
    }, {
      key: "render",
      value: function () {
        var e = this;
        return React.default.createElement(ReactNative.View, {
          style: b.container
        }, actions.default.map(function (t, n) {
          return n < 2 && !e.state.netEaseLogined ? null : React.default.createElement(ReactNative.TouchableNativeFeedback, {
            key: n,
            onPress: function () {
              requestAnimationFrame(function () {
                e.onPress(t);
              });
            }
          }, React.default.createElement(ReactNative.View, {
            style: b.btn
          }, React.default.createElement(components.Icon, {
            name: t.icon.name,
            key: n,
            size: 20,
            style: {
              width: 25
            }
          }), React.default.createElement(ReactNative.Text, {
            style: b.text
          }, t.name)));
        }));
      }
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(React.PureComponent),
  b = ReactNative.StyleSheet.create({
    container: {
      width: '100%',
      alignSelf: 'flex-start',
      height: '100%',
      paddingLeft: 20
    },
    btn: {
      paddingHorizontal: 20,
      flexDirection: 'row',
      alignItems: 'center',
      height: 45
    },
    text: {
      marginLeft: 10,
      fontSize: 15
    }
  }),
  m = p;
exports.default = m;
