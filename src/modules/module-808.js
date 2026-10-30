Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireDefault(require("react")),
  ReactNative = require("react-native"),
  module803 = babelHelpers.interopRequireDefault(require("./module-803")),
  module807 = babelHelpers.interopRequireDefault(require("./module-807")),
  i = function (e) {
    var t = e.info;
    return React.default.createElement(React.default.Fragment, null, React.default.createElement(module803.default.Text, {
      style: [module807.default.text, {
        marginBottom: 10,
        paddingLeft: 9
      }],
      numbers: 22
    }), t.sites.map(function (e, t) {
      return React.default.createElement(ReactNative.View, {
        style: module807.default.itemStyle,
        key: t
      }, React.default.createElement(module803.default.Avatar, {
        style: module807.default.avatar
      }), React.default.createElement(ReactNative.View, {
        style: {
          marginHorizontal: 10,
          flex: 1
        }
      }, React.default.createElement(module803.default.Text, {
        style: [module807.default.text, {
          marginLeft: 5
        }],
        numbers: 8
      }), React.default.createElement(module803.default.Text, {
        style: [module807.default.text, {
          marginLeft: 5,
          fontSize: 13
        }],
        numbers: 12
      })));
    }), React.default.createElement(module803.default.Text, {
      style: [module807.default.title, {
        fontSize: 16,
        marginLeft: 5
      }],
      numbers: 3
    }), t.persons.map(function (e, t) {
      return React.default.createElement(ReactNative.View, {
        style: module807.default.itemStyle,
        key: t
      }, React.default.createElement(module803.default.Avatar, {
        style: module807.default.avatar
      }), React.default.createElement(ReactNative.View, {
        style: {
          paddingHorizontal: 10,
          flex: 1
        }
      }, React.default.createElement(module803.default.Text, {
        style: [module807.default.text],
        numbers: 5
      }), React.default.createElement(module803.default.Text, {
        style: [module807.default.text, {
          fontSize: 13
        }],
        numbers: 10
      })));
    }), React.default.createElement(module803.default.Text, {
      style: [module807.default.title, {
        fontSize: 16,
        marginLeft: 5
      }],
      numbers: 3
    }), React.default.createElement(ReactNative.View, {
      style: [module807.default.osCon, {
        paddingLeft: 15
      }]
    }, React.default.createElement(module803.default.Text, {
      numberOfLines: 1,
      style: [module807.default.text],
      numbers: 3
    }), React.default.createElement(module803.default.Text, {
      numberOfLines: 1,
      style: [module807.default.text]
    })));
  };
exports.default = i;
