const _default = require('./../components/Text.js').default;
const _interopRequireWildcard = require('@babel/runtime/helpers/interopRequireWildcard');
Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;
var React = _interopRequireWildcard(require('react')),
  ReactNative = require('react-native'),
  utils = require('../utils/index'),
  s = class t extends React.PureComponent {
    constructor() {
      var e, a, n;
      for (var r = arguments.length, l = new Array(r), i = 0; i < r; i++) l[i] = arguments[i];
      return (
        (a = n = super(...l)),
        (n.state = {
          avatarUrl: null,
          nickname: null,
          living: null,
        }),
        (n.onCake = function () {
          n.props.navigation.navigate('SearchPage', {
            text: '生日快乐',
          });
        }),
        a
      );
    }
    componentDidMount() {
      var e = this.props.route.params;
      if (e) {
        var t = e.profile,
          a = t.birthday,
          n = t.avatarUrl,
          r = t.nickname;
        this.setState({
          avatarUrl: n,
          nickname: r,
          living: utils.timeFormatter.diffInDays(new Date(a), new Date()),
        });
      }
    }
    render() {
      var e = this.state,
        t = e.avatarUrl,
        a = e.nickname,
        n = e.living;
      return React.default.createElement(
        ReactNative.View,
        {
          style: c.container,
        },
        React.default.createElement(ReactNative.StatusBar, {
          hidden: true,
        }),
        t &&
          React.default.createElement(ReactNative.Image, {
            source: {
              uri: t,
            },
            style: c.avatar,
          }),
        a &&
          React.default.createElement(
            _default,
            {
              style: c.normal,
            },
            a,
          ),
        React.default.createElement(
          ReactNative.TouchableOpacity,
          {
            onPress: this.onCake,
          },
          React.default.createElement(
            _default,
            {
              style: [
                c.text,
                {
                  marginVertical: 32,
                },
              ],
            },
            '生日快乐',
            '\n',
            '🎂',
          ),
        ),
        n &&
          React.default.createElement(
            _default,
            {
              style: [
                c.normal,
                {
                  opacity: 0.5,
                },
              ],
            },
            '你已存在 ',
            n,
            ' 天',
          ),
      );
    }
  },
  c = ReactNative.StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000',
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      fontSize: 32,
      textAlign: 'center',
      fontWeight: 'bold',
    },
    normal: {
      fontSize: 20,
    },
    avatar: {
      height: 88,
      width: 88,
      borderRadius: 44,
    },
  }),
  u = s;
exports.default = u;
