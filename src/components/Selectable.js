const _default = require("./Text.js").default;
const _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");
const _objectWithoutProperties = require("@babel/runtime/helpers/objectWithoutProperties");
const _extends = require("@babel/runtime/helpers/extends");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  o = class r extends React.PureComponent {
    constructor() {
      return super(...arguments);
    }
    "render"() {
      var e = this.props,
        r = e.children,
        l = _objectWithoutProperties(e, ["children"]);
      return React.default.createElement(_default, _extends({
        selectable: true,
        selectionColor: "#e41749"
      }, l), r);
    }
  };
exports.default = o;
