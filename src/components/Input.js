const _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");
const _objectWithoutProperties = require("@babel/runtime/helpers/objectWithoutProperties");
const _extends = require("@babel/runtime/helpers/extends");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  constants = require("../theme/constants"),
  p = class r extends React.PureComponent {
    constructor() {
      return super(...arguments);
    }
    "render"() {
      var e = this.props,
        r = e.style,
        t = e.maxLength,
        l = _objectWithoutProperties(e, ["style", "maxLength"]);
      return React.default.createElement(ReactNative.TextInput, _extends({
        autoCorrect: false,
        maxLength: t || 40,
        underlineColorAndroid: 'transparent',
        style: [{
          color: constants.COLORS.primary
        }, r],
        placeholderTextColor: constants.COLORS.primaryAlpha70,
        selectionColor: constants.COLORS.primaryAlpha70
      }, l));
    }
  };
exports.default = p;
