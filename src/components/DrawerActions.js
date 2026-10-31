const _default = require('./Text.js').default;
const _interopRequireWildcard = require('@babel/runtime/helpers/interopRequireWildcard');
const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');
Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;
var React = _interopRequireWildcard(require('react')),
  ReactNative = require('react-native'),
  components = require('./index'),
  actions = _interopRequireDefault(require('../screens/home/actions')),
  names = _interopRequireDefault(require('../events/names')),
  locales = _interopRequireDefault(require('../locales/index')),
  services = require('../services/index'),
  events = require('../events/index'),
  p = class t extends React.PureComponent {
    constructor() {
      var e, n, a;
      for (var r = arguments.length, s = new Array(r), l = 0; l < r; l++) s[l] = arguments[l];
      return (
        (n = a = super(...s)),
        (a.state = {
          netEaseLogined: true,
        }),
        (a.checkNetEaseLogined = async function () {
          try {
            const result = await services.Netease.cloud(1);
            if (result)
              a.setState({
                netEaseLogined: result.code !== 301,
              });
          } catch (error) {
            toast(error.message);
          }
        }),
        (a.sponsor = function () {
          events.emitter.emit(names.default.SavePicModal, {
            type: 'sponsor',
            song: 'sponsor',
          });
        }),
        (a.onPress = function (e) {
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
        }),
        n
      );
    }
    componentDidMount() {
      var e = this;
      this.checkNetEaseLogined();
      this.sub = events.emitter.addListener(names.default.UserLogined, function () {
        setTimeout(function () {
          e.checkNetEaseLogined();
        }, 500);
      });
    }
    componentWillUnmount() {
      this.sub.remove();
    }
    render() {
      var e = this;
      return React.default.createElement(
        ReactNative.View,
        {
          style: b.container,
        },
        actions.default.map(function (t, n) {
          return n < 2 && !e.state.netEaseLogined
            ? null
            : React.default.createElement(
                ReactNative.TouchableNativeFeedback,
                {
                  key: n,
                  onPress: function () {
                    requestAnimationFrame(function () {
                      e.onPress(t);
                    });
                  },
                },
                React.default.createElement(
                  ReactNative.View,
                  {
                    style: b.btn,
                  },
                  React.default.createElement(components.Icon, {
                    name: t.icon.name,
                    key: n,
                    size: 20,
                    style: {
                      width: 25,
                    },
                  }),
                  React.default.createElement(
                    _default,
                    {
                      style: b.text,
                    },
                    t.name,
                  ),
                ),
              );
        }),
      );
    }
  },
  b = ReactNative.StyleSheet.create({
    container: {
      width: '100%',
      alignSelf: 'flex-start',
      height: '100%',
      paddingLeft: 20,
    },
    btn: {
      paddingHorizontal: 20,
      flexDirection: 'row',
      alignItems: 'center',
      height: 45,
    },
    text: {
      marginLeft: 10,
      fontSize: 15,
    },
  }),
  m = p;
exports.default = m;
