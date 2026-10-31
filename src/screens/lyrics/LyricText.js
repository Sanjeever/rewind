const _default = require('./../../components/Text.js').default;
const _interopRequireWildcard = require('@babel/runtime/helpers/interopRequireWildcard');
Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;
var React = _interopRequireWildcard(require('react')),
  ReactNative = require('react-native'),
  o = class t extends React.PureComponent {
    constructor() {
      return super(...arguments);
    }
    render() {
      var e = this.props,
        t = e.lyric,
        l = e.trans,
        n = e.onPress,
        r = e.style,
        o = e.hidden;
      return React.default.createElement(
        ReactNative.TouchableOpacity,
        {
          onPress: n,
          activeOpacity: 0.6,
        },
        React.default.createElement(
          ReactNative.View,
          {
            style: [
              s.textCon,
              r,
              o && {
                opacity: 0,
              },
            ],
          },
          (null === t || void 0 === t ? void 0 : t.length) > 0
            ? React.default.createElement(
                _default,
                {
                  style: [s.text],
                },
                t,
              )
            : null,
          (null === l || void 0 === l ? void 0 : l.length) > 0
            ? React.default.createElement(
                _default,
                {
                  style: [s.text],
                },
                l || '',
              )
            : null,
        ),
      );
    }
  };
exports.default = o;
var s = ReactNative.StyleSheet.create({
  textCon: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    padding: 8,
    paddingHorizontal: 20,
  },
  text: {
    color: '#000',
    fontSize: 16,
  },
});
