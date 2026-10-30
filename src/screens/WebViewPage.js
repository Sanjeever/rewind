const _WebView = require("react-native-webview").WebView;
const _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  components = require("../components/index"),
  constants = require("../theme/constants"),
  c = "\n  (function() {\n    function changeFrame(){\n        var iframe = document.getElementById('g_iframe');\n        console.log('iframe', iframe);\n        if(iframe){\n            iframe.style.width = '" + 3 * constants.DEVICE_WIDTH + "px';\n            iframe.style.height = '" + 2 * constants.DEVICE_HEIGHT + "px';\n        }\n    };\n    changeFrame();\n  })();\n",
  u = class t extends React.Component {
    constructor() {
      var e, a, n;
      for (var r = arguments.length, l = new Array(r), i = 0; i < r; i++) l[i] = arguments[i];
      return a = n = super(...l), n.state = {
        url: ''
      }, n.goBack = function () {
        n.props.navigation.goBack();
      }, a;
    }
    "componentDidMount"() {
      var e = this.props.route.params.url;
      this.setState({
        url: e
      });
    }
    "render"() {
      var e = this.state.url;
      return React.default.createElement(ReactNative.Modal, {
        onRequestClose: this.goBack,
        animationType: 'fade'
      }, React.default.createElement(ReactNative.View, {
        style: d.container
      }, React.default.createElement(components.Background, null), React.default.createElement(_WebView, {
        ref: instance => this.webView = instance,
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
  },
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
