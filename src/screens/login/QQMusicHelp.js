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
  u = class t extends React.PureComponent {
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
            ReactNative.ScrollView,
            {
              overScrollMode: 'never',
              showsVerticalScrollIndicator: false,
              contentContainerStyle: {
                paddingTop: 50,
              },
              style: {
                flex: 1,
              },
            },
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
                't.QQ\u767b\u5165\u6210\u529f\u540e\u65e0\u6cd5\u83b7\u53d6\u6b4c\u5355\u7684\u8bdd\uff0c\u8bf7\u53bbQQ\u97f3\u4e50\u5b98\u65b9\u5e94\u7528\u6216\u7f51\u9875\u53d6\u6d88\u79c1\u5bc6\u6b4c\u5355/\u4ed6\u4eba\u4e0d\u53ef\u89c1\u8bbe\u7f6e\uff0c\u7531\u4e8e\u9a8c\u8bc1\u95ee\u9898\uff0c\u5f00\u542f\u79c1\u5bc6\u6b4c\u5355\u540e\u672c\u5e94\u7528\u65e0\u6cd5\u83b7\u53d6\u5230\u6b4c\u5355\u6570\u636e\u3002\n                  \n1.\u8f93\u5165QQ\u53f7\u83b7\u53d6\u6b4c\u5355\u9700\u8981\u767b\u5165\u624d\u53ef\u4f7f\u7528\uff08\u6709\u65f6\u5019\u4e0d\u7528\uff09\uff0c\u8be5\u63a5\u53e3\u66f4\u65b0\u540e\u5e26\u6709\u767b\u5165\u9a8c\u8bc1\u3002\n                  \n2.\u5fae\u4fe1\u626b\u7801\u767b\u5165\u9700\u8981\u53e6\u4e00\u53f0\u8bbe\u5907\u6765\u626b\uff0c\u622a\u56fe\u626b\u63cf\u65e0\u7528\u3002\u8be5\u65b9\u5f0f\u5b9e\u5c5e\u9e21\u808b\u3002\uff08\u4fc3\u8fdb\u6d88\u8d39\uff0c\u4eba\u624b\u4e24\u53f0\u673a\uff09\n                  \n3.\u6709\u5173\u767b\u5165\u72b6\u6001\u7ecf\u5e38\u5931\u6548\uff1a\n                  \n\tq.\u767b\u5165\u72b6\u6001\u7684\u5931\u6548\u4f1a\u5bfc\u81f4\u7f16\u8f91\u6b4c\u5355\u7b49\u64cd\u4f5c\u7684\u5931\u6548\uff0c\u539f\u56e0\u662f\uff1f\n                  \n\ta.QQ\u97f3\u4e50\u548c\u7f51\u6613\u4e91\u97f3\u4e50\u8fd9\u4e24\u7aef\u767b\u5165\u7684\u65b9\u5f0f\u5927\u4f53\u76f8\u540c\uff0c\u4f46QQ\u97f3\u4e50\u7f51\u9875\u7aef\u4f3c\u4e4e\u65e0\u6cd5\u4f7f\u767b\u5165\u72b6\u6001\u6301\u4e45\u5316\uff08\u4e5f\u6709\u53ef\u80fd\u53ea\u662f\u6211\u505a\u4e0d\u5230\u800c\u5df2\uff09\u3002\n                  \n\tq.\u5982\u4f55\u89e3\u51b3\u6216\u8005\u907f\u514d\uff1f\n                  \n\ta.\u76ee\u524d\u4ecd\u7136\u65e0\u89e3\uff0c\u53ea\u80fd\u624b\u52a8\u91cd\u65b0\u767b\u5165\u3002\n                  ',
              ),
            ),
          ),
        ),
      );
    }
  };
exports.default = u;
