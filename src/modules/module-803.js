Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireDefault(require("react")),
  module804 = babelHelpers.interopRequireDefault(require("./module-804")),
  i = {
    PlaceHolder: function (e) {
      var t = e.style;
      return React.default.createElement(module804.default, {
        style: [{
          borderRadius: 20
        }, t]
      });
    },
    Avatar: function (e) {
      var t = e.style,
        r = e.size,
        l = e.radius,
        a = void 0 === l ? r / 2 : l;
      return React.default.createElement(module804.default, {
        style: [{
          width: r,
          height: r,
          borderRadius: a
        }, t]
      });
    },
    Text: function (e) {
      var t = e.numbers,
        r = void 0 === t ? 14 : t,
        l = babelHelpers.objectWithoutProperties(e, ["numbers"]);
      return React.default.createElement(module804.default, babelHelpers.extends({}, l, {
        textMode: true
      }), '\u25a0'.repeat(r).split('').join(' '));
    }
  };
exports.default = i;
