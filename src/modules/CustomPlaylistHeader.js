const _default = require('./../components/Text.js').default;
const _interopRequireWildcard = require('@babel/runtime/helpers/interopRequireWildcard');
const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');
Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;
var React = _interopRequireWildcard(require('react')),
  ReactNative = require('react-native'),
  components = require('../components/index'),
  icons = _interopRequireDefault(require('../theme/icons')),
  u = class t extends React.PureComponent {
    constructor() {
      return super(...arguments);
    }
    render() {
      var e = this.props,
        t = e.onPress,
        l = e.title,
        r = e.img,
        n = e.trackCount;
      return React.default.createElement(
        ReactNative.TouchableOpacity,
        {
          onPress: t,
        },
        React.default.createElement(
          ReactNative.View,
          {
            style: {
              marginTop: 15,
              alignItems: 'center',
            },
          },
          r
            ? React.default.createElement(ReactNative.Image, {
                style: c.cover,
                source: {
                  uri: r,
                },
              })
            : React.default.createElement(
                ReactNative.View,
                {
                  style: [
                    c.cover,
                    {
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#fff',
                    },
                  ],
                },
                React.default.createElement(components.Icon, {
                  name: icons.default.DISC,
                  size: 35,
                  color: '#111',
                }),
              ),
          React.default.createElement(
            ReactNative.View,
            {
              style: c.textCon,
            },
            React.default.createElement(
              _default,
              {
                style: [c.title],
                numberOfLines: 2,
              },
              l,
            ),
            React.default.createElement(
              _default,
              {
                style: [c.subtitle],
              },
              '- ',
              n,
              ' -',
            ),
          ),
        ),
      );
    }
  };
exports.default = u;
var c = ReactNative.StyleSheet.create({
  cover: {
    height: 80,
    width: 80,
    borderRadius: 40,
  },
  textCon: {
    width: 160,
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    fontSize: 14,
    marginTop: 5,
    fontWeight: 'bold',
  },
});
