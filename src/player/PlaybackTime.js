const _interopRequireWildcard = require('@babel/runtime/helpers/interopRequireWildcard');
Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;
var React = _interopRequireWildcard(require('react')),
  ReactNative = require('react-native'),
  reactNativeAnimatable = _interopRequireWildcard(require('react-native-animatable')),
  utils = require('../utils/index'),
  p = class t extends React.PureComponent {
    constructor() {
      return super(...arguments);
    }
    render() {
      var e = this.props,
        t = e.width,
        r = e.animatedOpacity,
        i = e.color,
        a = e.duration,
        p = e.currentTime,
        u = utils.timeFormatter.parseTime(p) + ' / ' + utils.timeFormatter.parseTime(a);
      return React.default.createElement(
        reactNativeAnimatable.View,
        {
          pointerEvents: 'none',
          ref: (instance) => (this.slidingTimeText = instance),
          animation: 'fadeIn',
          useNativeDriver: true,
          style: [
            {
              width: t,
              position: 'absolute',
              top: t,
              height: 30,
              justifyContent: 'center',
              alignItems: 'center',
              opacity: 0.5,
            },
          ],
        },
        React.default.createElement(
          ReactNative.Animated.Text,
          {
            style: [
              {
                color: i,
                opacity: r,
              },
            ],
          },
          u,
        ),
      );
    }
  };
exports.default = p;
