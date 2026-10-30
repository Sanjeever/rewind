const _default = require("./../components/Text.js").default;
const _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  components = require("../components/index"),
  highlightWordsCore = require("highlight-words-core"),
  formatItem = require("../screens/comments/formatItem"),
  u = class t extends React.PureComponent {
    constructor() {
      var e, r, o;
      for (var l = arguments.length, u = new Array(l), c = 0; c < l; c++) u[c] = arguments[c];
      return r = o = super(...u), o.renderContent = function () {
        var e = o.props,
          t = e.item,
          r = e.title,
          l = e.replied,
          u = (0, formatItem.getFormattedItem)(t);
        if (r && u.content) {
          var c = u.content,
            b = (0, highlightWordsCore.findAll)({
              textToHighlight: c,
              searchWords: [r]
            });
          return React.default.createElement(components.Selectable, {
            style: [f.text, true === l && {
              fontSize: 14
            }]
          }, b.map(function (e, t) {
            var r = c.substr(e.start, e.end - e.start);
            return e.highlight ? React.default.createElement(_default, {
              key: t,
              style: f.highlight
            }, r) : r;
          }));
        }
        return React.default.createElement(components.Selectable, {
          style: [f.text, true === l && {
            fontSize: 14
          }]
        }, u.content);
      }, r;
    }
    "render"() {
      var e = this.props,
        t = e.replied,
        r = e.item,
        o = (0, formatItem.getFormattedItem)(r);
      return React.default.createElement(ReactNative.View, {
        style: [{
          alignItems: 'center',
          padding: 20,
          marginBottom: 20
        }, true === t && {
          backgroundColor: '#1a1820',
          borderRadius: 5
        }]
      }, !t && React.default.createElement(c, null), this.renderContent(), React.default.createElement(ReactNative.View, {
        style: {
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 10
        }
      }, React.default.createElement(ReactNative.Image, {
        source: {
          uri: o.userAvatar
        },
        style: {
          height: 25,
          width: 25,
          borderRadius: 12.5
        }
      }), React.default.createElement(components.Selectable, {
        style: [f.text, {
          fontSize: 12,
          marginLeft: 3
        }]
      }, o.userName)), o.time ? React.default.createElement(_default, {
        style: [f.text, {
          fontSize: 10,
          marginTop: 5
        }]
      }, o.time) : null);
    }
  };
exports.default = u;
var c = function () {
    return React.default.createElement(React.default.Fragment, null, React.default.createElement(ReactNative.View, {
      style: f.triangle
    }), React.default.createElement(ReactNative.View, {
      style: f.triangle2
    }), React.default.createElement(ReactNative.View, {
      style: f.outlineRight
    }), React.default.createElement(ReactNative.View, {
      style: f.outlineLeft
    }), React.default.createElement(ReactNative.View, {
      style: f.triangleBorderMsk
    }));
  },
  f = ReactNative.StyleSheet.create({
    text: {
      color: "#c99f63",
      fontSize: 16,
      letterSpacing: 1
    },
    highlight: {
      color: '#d5a157',
      fontWeight: 'bold'
    },
    outlineLeft: {
      top: 8,
      left: 8,
      right: 8,
      bottom: 8,
      borderWidth: 1,
      borderColor: "#c99f63",
      position: 'absolute',
      backgroundColor: "#100f14"
    },
    outlineRight: {
      top: 0,
      left: 15,
      right: 0,
      bottom: 15,
      borderWidth: 1,
      borderColor: "#c99f63",
      position: 'absolute'
    },
    triangle: {
      position: 'absolute',
      bottom: -2,
      left: 8,
      borderLeftWidth: 12,
      borderBottomWidth: 12,
      borderColor: "#c99f63",
      borderTopColor: 0,
      borderRightColor: 0,
      borderBottomColor: 0
    },
    triangle2: {
      position: 'absolute',
      bottom: 1,
      left: 9,
      borderLeftWidth: 7,
      borderBottomWidth: 7,
      borderColor: "#100f14",
      borderTopColor: 0,
      borderRightColor: 0,
      borderBottomColor: 0
    },
    triangleBorderMsk: {
      width: 8,
      height: 1,
      position: 'absolute',
      bottom: 8,
      left: 9,
      backgroundColor: "#100f14"
    }
  });
