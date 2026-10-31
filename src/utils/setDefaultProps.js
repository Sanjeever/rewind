const _objectSpread = require('@babel/runtime/helpers/objectSpread2');
Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;
exports.default = function (e, r) {
  var t = e.render,
    l = e.defaultProps;
  e.defaultProps = _objectSpread({}, l, r);
  e.render = function (e) {
    var l = e;
    e = _objectSpread({}, e, {
      style: [r.style, e.style],
    });
    try {
      return t.apply(this, arguments);
    } finally {
      e = l;
    }
  };
};
