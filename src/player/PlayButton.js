const _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");
const _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  components = require("../components/index"),
  buttons = _interopRequireDefault(require("./buttons")),
  ControlIcon = _interopRequireDefault(require("./ControlIcon")),
  u = {
    playing: {
      name: buttons.default.PAUSE.name,
      type: buttons.default.PAUSE.type
    },
    paused: {
      name: buttons.default.PLAY.name,
      type: buttons.default.PLAY.type
    }
  },
  d = class t extends React.PureComponent {
    constructor() {
      return super(...arguments);
    }
    "render"() {
      var e = this.props,
        t = e.playState,
        l = e.disabled,
        a = e.loaded,
        r = e.color,
        o = e.onPress,
        d = e.onLongPress,
        b = e.size,
        f = void 0 === b ? 55 : b,
        c = e.spinSize,
        y = void 0 === c ? 50 : c;
      return true === a ? React.default.createElement(ControlIcon.default, {
        color: r,
        name: u[t].name,
        type: u[t].type,
        size: f,
        onPress: o,
        onLongPress: d,
        disabled: l,
        style: !f && {
          padding: 0
        }
      }) : React.default.createElement(ReactNative.View, {
        style: {
          alignItems: 'center',
          justifyContent: 'center',
          width: f + 12
        }
      }, React.default.createElement(components.Spinkit, {
        size: y
      }));
    }
  };
exports.default = d;
