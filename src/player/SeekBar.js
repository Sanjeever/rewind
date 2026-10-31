const _interopRequireWildcard = require('@babel/runtime/helpers/interopRequireWildcard');
const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');
Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;
var React = _interopRequireWildcard(require('react')),
  reactNativeSlider = _interopRequireDefault(require('@react-native-community/slider')),
  styles = _interopRequireDefault(require('./styles')),
  u = class t extends React.PureComponent {
    constructor() {
      return super(...arguments);
    }
    render() {
      var e = this.props,
        t = e.showLyric,
        i = e.isRound,
        l = e.duration,
        r = e.currentTime,
        u = e.loaded,
        d = e.slidingStart,
        s = e.onSliderValueChange,
        b = e.slidingEnd,
        p = e.width,
        h = e.disabled;
      return React.default.createElement(reactNativeSlider.default, {
        disabled: h,
        animateTransitions: false,
        style: [
          {
            width: p,
            position: 'absolute',
            top: p,
            bottom: 0,
            height: 40,
            opacity: 1,
          },
          t && {
            width: p,
            position: 'absolute',
            bottom: 0,
            top: p,
            opacity: 1,
          },
          t && styles.default.sliderHide,
          i && !t && styles.default.roundStyle,
        ],
        maximumTrackTintColor: 'rgba(0,0,0,0)',
        minimumTrackTintColor: 'rgba(255,255,255,0.8)',
        thumbTintColor: 'rgba(255,255,255,0.8)',
        maximumValue: l && l > 0 ? l : 0,
        value: u && r && r > 0 ? r : 0,
        trackStyle: [
          {
            top: 0,
            height: 2,
            borderRadius: 1,
          },
          (true === i || true === t) && {
            top: null,
            bottom: 0,
          },
        ],
        thumbStyle: [
          {
            height: 2,
            width: 2,
            backgroundColor: 0,
          },
        ],
        onSlidingStart: d,
        onValueChange: s,
        onSlidingComplete: b,
        thumbTouchSize: {
          height: 40,
          width: 2 * p,
        },
      });
    }
  };
exports.default = u;
