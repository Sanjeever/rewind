const _default = require('./../../components/Text.js').default;
const _interopRequireWildcard = require('@babel/runtime/helpers/interopRequireWildcard');
const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');
Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;
var React = _interopRequireWildcard(require('react')),
  ReactNative = require('react-native'),
  components = require('../../components/index'),
  constants = require('../../theme/constants'),
  icons = _interopRequireDefault(require('../../theme/icons')),
  d = class t extends React.PureComponent {
    constructor() {
      return super(...arguments);
    }
    render() {
      var e = this.props,
        t = e.isOpen,
        n = e.onRequestClose;
      return React.default.createElement(
        ReactNative.Modal,
        {
          visible: t,
          backdropOpacity: 0.8,
          onRequestClose: n,
          position: 'center',
          animationType: 'fade',
        },
        React.default.createElement(
          ReactNative.View,
          {
            style: {
              flex: 1,
              padding: 20,
              paddingTop: constants.STATUS_BAR_HEIGHT + 20,
            },
          },
          React.default.createElement(components.Background, null),
          React.default.createElement(
            ReactNative.View,
            {
              style: {
                justifyContent: 'center',
                flexDirection: 'row',
                paddingHorizontal: 10,
              },
            },
            React.default.createElement(components.Icon, {
              name: icons.default.WINDOW_CLOSE,
              size: 25,
              onPress: n,
            }),
          ),
          React.default.createElement(
            ReactNative.View,
            {
              style: {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              },
            },
            React.default.createElement(
              _default,
              {
                style: {
                  fontSize: 16,
                },
              },
              "1.当使用QQ登入或微博登入时，可能会看到 { code:401, msg:'授权出现异常' } 相关提示，请返回登入界面点击登出后重试。\n                  \n2.无法登入的原因一般有：\n                  \n\ti.设置了登入保护（网易云音乐 - 设置 - 登入保护 - 关闭）\n                  \n\tii.登入超时（当用邮箱或手机号登入时需要跑网易云登入算法，过量请求有时候会被拒绝）\n                  \n\tiii.重复登入（即使用不同端登入时冲突，会被拒绝访问）\n              ",
            ),
          ),
        ),
      );
    }
  };
exports.default = d;
