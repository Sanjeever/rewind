const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');
const _objectWithoutProperties = require('@babel/runtime/helpers/objectWithoutProperties');
const _extends = require('@babel/runtime/helpers/extends');
Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;
var React = _interopRequireDefault(require('react')),
  PulsingPlaceholder = _interopRequireDefault(require('../../components/PulsingPlaceholder')),
  i = {
    PlaceHolder: function (e) {
      var t = e.style;
      return React.default.createElement(PulsingPlaceholder.default, {
        style: [
          {
            borderRadius: 20,
          },
          t,
        ],
      });
    },
    Avatar: function (e) {
      var t = e.style,
        r = e.size,
        l = e.radius,
        a = void 0 === l ? r / 2 : l;
      return React.default.createElement(PulsingPlaceholder.default, {
        style: [
          {
            width: r,
            height: r,
            borderRadius: a,
          },
          t,
        ],
      });
    },
    Text: function (e) {
      var t = e.numbers,
        r = void 0 === t ? 14 : t,
        l = _objectWithoutProperties(e, ['numbers']);
      return React.default.createElement(
        PulsingPlaceholder.default,
        _extends({}, l, {
          textMode: true,
        }),
        '■'.repeat(r).split('').join(' '),
      );
    },
  };
exports.default = i;
