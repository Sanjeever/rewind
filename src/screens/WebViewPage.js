Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  components = require("../components/index"),
  constants = require("../theme/constants"),
  c = "\n  (function() {\n    function changeFrame(){\n        var iframe = document.getElementById('g_iframe');\n        console.log('iframe', iframe);\n        if(iframe){\n            iframe.style.width = '" + 3 * constants.DEVICE_WIDTH + "px';\n            iframe.style.height = '" + 2 * constants.DEVICE_HEIGHT + "px';\n        }\n    };\n    changeFrame();\n  })();\n",
  u = function (e) {
    function t() {
      var e, a, n;
      babelHelpers.classCallCheck(this, t);
      for (var r = arguments.length, l = new Array(r), i = 0; i < r; i++) l[i] = arguments[i];
      return babelHelpers.possibleConstructorReturn(n, (a = n = babelHelpers.possibleConstructorReturn(this, (e = babelHelpers.getPrototypeOf(t)).call.apply(e, [this].concat(l))), n.state = {
        url: ''
      }, n.goBack = function () {
        n.props.navigation.goBack();
      }, a));
    }
    babelHelpers.createClass(t, [{
      key: "componentDidMount",
      value: function () {
        var e = this.props.navigation.state.params.url;
        this.setState({
          url: e
        });
      }
    }, {
      key: "render",
      value: function () {
        var e = this.state.url;
        return React.default.createElement(ReactNative.Modal, {
          onRequestClose: this.goBack,
          animationType: 'fade'
        }, React.default.createElement(ReactNative.View, {
          style: d.container
        }, React.default.createElement(components.Background, null), React.default.createElement(ReactNative.WebView, {
          ref: "webView",
          style: {
            flex: 1,
            width: '100%',
            height: '100%'
          },
          source: {
            uri: e
          },
          userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36",
          injectedJavaScript: c,
          javaScriptEnabled: true,
          domStorageEnabled: true,
          startInLoadingState: true,
          automaticallyAdjustContentInsets: false
        }), React.default.createElement(components.HeaderBar, {
          headerStyle: d.header,
          goBack: this.goBack
        })));
      }
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(React.Component),
  d = ReactNative.StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: constants.STATUS_BAR_HEIGHT
    },
    header: {
      position: 'absolute',
      top: 0
    }
  }),
  p = u;
exports.default = p;
