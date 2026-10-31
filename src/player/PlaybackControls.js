const _interopRequireWildcard = require('@babel/runtime/helpers/interopRequireWildcard');
const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');
Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;
var React = _interopRequireWildcard(require('react')),
  ReactNative = require('react-native'),
  buttons = _interopRequireDefault(require('./buttons')),
  styles = _interopRequireDefault(require('./styles')),
  ControlIcon = _interopRequireDefault(require('./ControlIcon')),
  PlayButton = _interopRequireDefault(require('./PlayButton')),
  AnimatedPlayButton = _interopRequireDefault(require('./AnimatedPlayButton')),
  f = class t extends React.PureComponent {
    constructor() {
      return super(...arguments);
    }
    render() {
      var e = this.props,
        t = e.animatedOpacity,
        l = e.playMode,
        a = e.onChangePlayStatus,
        r = e.showLyric,
        f = e.changeSong,
        c = e.togglePlay,
        y = e.onNowPlaying,
        b = e.color,
        m = e.playState,
        P = e.loaded;
      return React.default.createElement(
        ReactNative.Animated.View,
        {
          style: [
            styles.default.footer,
            {
              opacity: t,
            },
            r && {
              paddingBottom: 0,
            },
          ],
        },
        React.default.createElement(
          ReactNative.View,
          {
            style: styles.default.toolBar,
          },
          React.default.createElement(AnimatedPlayButton.default, {
            playMode: l,
            onPress: a,
            color: b,
            size: 25,
            style: {
              padding: 5,
            },
          }),
          React.default.createElement(ControlIcon.default, {
            name: buttons.default.PREV.name,
            type: buttons.default.PREV.type,
            onPress: function () {
              return f('pre');
            },
            color: b,
            style: {
              padding: 5,
            },
          }),
          React.default.createElement(PlayButton.default, {
            playState: m,
            onPress: c,
            color: b,
            loaded: P,
          }),
          React.default.createElement(ControlIcon.default, {
            name: buttons.default.NEXT.name,
            type: buttons.default.NEXT.type,
            onPress: function () {
              return f('next');
            },
            color: b,
            style: {
              padding: 5,
            },
          }),
          React.default.createElement(ControlIcon.default, {
            onPress: y,
            name: buttons.default.LIST.name,
            type: buttons.default.LIST.type,
            color: b,
            style: {
              padding: 5,
            },
            size: 25,
          }),
        ),
      );
    }
  };
exports.default = f;
