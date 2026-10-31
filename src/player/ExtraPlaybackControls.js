const _default = require('./../components/Pager.js').default;
const _interopRequireWildcard = require('@babel/runtime/helpers/interopRequireWildcard');
const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');
Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;
var React = _interopRequireWildcard(require('react')),
  ReactNative = require('react-native'),
  tabIcons = _interopRequireDefault(require('../theme/tabIcons')),
  buttons = _interopRequireDefault(require('./buttons')),
  styles = _interopRequireDefault(require('./styles')),
  ControlIcon = _interopRequireDefault(require('./ControlIcon')),
  d = class t extends React.PureComponent {
    constructor() {
      return super(...arguments);
    }
    render() {
      var e = this.props,
        t = e.animatedOpacity,
        l = e.onLike,
        a = e.onComment,
        n = e.onDetail,
        d = e.onFmMode,
        p = e.onTimer,
        c = e.onCheck,
        m = e.showLyric,
        y = e.color,
        b = e.isFM,
        E = e.isLike;
      return React.default.createElement(
        ReactNative.Animated.View,
        {
          style: [
            styles.default.totalTool,
            {
              opacity: t,
            },
          ],
        },
        React.default.createElement(
          _default,
          {
            style: {
              flex: 1,
              height: '100%',
            },
          },
          React.default.createElement(
            ReactNative.View,
            {
              style: {
                flex: 1,
                height: '100%',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: 'row',
                paddingHorizontal: 45,
              },
            },
            React.default.createElement(ControlIcon.default, {
              name: true === E ? buttons.default.HEART.name : buttons.default.HEART_OFF.name,
              type: buttons.default.HEART.type,
              onPress: l,
              color: m ? '#fff' : y,
              size: 23,
            }),
            React.default.createElement(ControlIcon.default, {
              name: buttons.default.COMMENT.name,
              type: buttons.default.COMMENT.type,
              onPress: a,
              color: y,
              size: 23,
            }),
            React.default.createElement(ControlIcon.default, {
              name: buttons.default.MORE.name,
              type: buttons.default.MORE.type,
              onPress: n,
              color: m ? '#fff' : y,
              size: 23,
            }),
          ),
          React.default.createElement(
            ReactNative.View,
            {
              style: {
                flex: 1,
                height: '100%',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: 'row',
                paddingHorizontal: 45,
              },
            },
            React.default.createElement(ControlIcon.default, {
              name: buttons.default.TIMER.name,
              type: buttons.default.TIMER.type,
              onPress: p,
              color: y,
              size: 23,
            }),
            React.default.createElement(ControlIcon.default, {
              name: buttons.default.CHECK.name,
              type: buttons.default.CHECK.type,
              onPress: c,
              color: y,
              size: 24,
            }),
            React.default.createElement(ControlIcon.default, {
              name: tabIcons.default.FM.name,
              type: tabIcons.default.FM.type,
              onPress: d,
              color: y,
              style: [
                {
                  opacity: 0.7,
                },
                true === b && {
                  opacity: 1,
                },
              ],
              size: 23,
            }),
          ),
        ),
      );
    }
  };
exports.default = d;
