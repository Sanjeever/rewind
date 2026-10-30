const _default = require("./../components/Text.js").default;
const _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");
const _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  TouchableScale = _interopRequireDefault(require("../components/TouchableScale")),
  o = class t extends React.PureComponent {
    constructor() {
      return super(...arguments);
    }
    "render"() {
      var e = this.props,
        t = e.onPress,
        l = e.title,
        n = e.value;
      return React.default.createElement(TouchableScale.default, {
        onPress: function () {
          null === t || void 0 === t || t();
        },
        style: {
          width: '100%'
        },
        activeScale: 1.1
      }, React.default.createElement(ReactNative.View, {
        style: {
          width: '100%',
          padding: 8,
          justifyContent: 'center'
        }
      }, n ? React.default.createElement(_default, {
        style: [u.text, u.listItemText, u.highlight, n.length > 10 && {
          fontSize: 15
        }]
      }, n) : null, React.default.createElement(_default, {
        style: [u.text, u.listItemText, n && u.mini]
      }, n ? "- " + l + " -" : l)));
    }
  };
exports.default = o;
var u = ReactNative.StyleSheet.create({
  text: {
    fontSize: 16,
    textAlign: 'center'
  },
  listItemText: {
    alignSelf: 'center',
    textAlign: 'center'
  },
  mini: {
    marginTop: -2,
    fontSize: 12
  },
  highlight: {
    fontWeight: 'bold'
  }
});
