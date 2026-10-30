const _default = require("./../../components/Text.js").default;
const _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");
const _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  components = require("../../components/index"),
  constants = require("../../theme/constants"),
  icons = _interopRequireDefault(require("../../theme/icons")),
  d = class t extends React.PureComponent {
    constructor() {
      return super(...arguments);
    }
    "render"() {
      var e = this.props,
        t = e.showModal,
        l = e.albumImg,
        r = e.onClose,
        a = e.company,
        d = e.publishTime,
        c = e.description;
      return React.default.createElement(ReactNative.Modal, {
        visible: t,
        backdropOpacity: .8,
        onRequestClose: r,
        position: "center",
        animationType: "fade"
      }, React.default.createElement(ReactNative.View, {
        style: {
          flex: 1,
          paddingTop: constants.STATUS_BAR_HEIGHT + 20
        }
      }, React.default.createElement(components.Background, {
        coverUrl: l,
        blur: true
      }), React.default.createElement(components.Icon, {
        name: icons.default.WINDOW_CLOSE,
        size: 25,
        onPress: r
      }), React.default.createElement(ReactNative.ScrollView, {
        overScrollMode: "never",
        style: {
          marginTop: constants.STATUS_BAR_HEIGHT + 20,
          height: '100%',
          flex: 1,
          paddingHorizontal: 20
        }
      }, React.default.createElement(ReactNative.View, {
        style: {
          flex: 1
        }
      }, React.default.createElement(_default, null), React.default.createElement(_default, {
        style: [{
          fontSize: 15,
          lineHeight: 30
        }]
      }, "\u53d1\u884c\u516c\u53f8\uff1a", a, '\n', "\u53d1\u884c\u65e5\u671f\uff1a", d, '\n\n', c)), React.default.createElement(ReactNative.View, {
        style: {
          height: 200
        }
      }))));
    }
  };
exports.default = d;
