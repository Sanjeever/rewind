const _default = require("./../components/Text.js").default;
const _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");
const _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  utils = require("../utils/index"),
  styles = _interopRequireDefault(require("./styles")),
  u = class t extends React.PureComponent {
    constructor() {
      return super(...arguments);
    }
    "render"() {
      var e = this.props,
        t = e.color,
        r = e.duration,
        l = e.currentTime,
        a = e.showLyric;
      return React.default.createElement(ReactNative.View, {
        style: [styles.default.progressBar, a && styles.default.sliderHide, {
          marginTop: -5,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column'
        }, styles.default.timeSoftPadding]
      }, React.default.createElement(_default, {
        style: [styles.default.text, {
          opacity: .7,
          color: t
        }, a && {
          fontSize: 12
        }]
      }, utils.timeFormatter.parseTime(l) + "  \t/\t  " + utils.timeFormatter.parseTime(r)));
    }
  };
exports.default = u;
