const _default = require("./../components/Text.js").default;
const _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  s = class t extends React.PureComponent {
    constructor() {
      return super(...arguments);
    }
    "render"() {
      var e = this.props,
        t = e.extraBottomValue,
        r = e.animtedOpacity,
        l = e.currentIndex,
        a = e.tracksLength;
      return React.default.createElement(ReactNative.Animated.View, {
        accessible: false,
        style: [{
          position: 'absolute',
          padding: 10,
          alignSelf: 'center',
          bottom: 5 + t,
          opacity: r
        }]
      }, React.default.createElement(_default, {
        style: [{
          fontSize: 11,
          textAlign: 'center',
          opacity: .5
        }]
      }, l, " / ", a));
    }
  };
exports.default = s;
