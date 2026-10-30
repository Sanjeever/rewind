const _WebView = require("react-native-webview").WebView;
const _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");
const _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  components = require("../components/index"),
  icons = _interopRequireDefault(require("../theme/icons")),
  endpoints = require("../services/endpoints"),
  c = class t extends React.Component {
    constructor() {
      var e, a, n;
      for (var r = arguments.length, o = new Array(r), i = 0; i < r; i++) o[i] = arguments[i];
      return a = n = super(...o), n.state = {
        url: endpoints.HOST_PAGE + "/tutorial"
      }, n.back = function () {
        n.props.navigation.goBack();
      }, n.onLink = function () {
        ReactNative.Linking.openURL(n.state.url);
      }, n.goBack = function () {
        n.props.navigation.goBack();
      }, a;
    }
    "componentDidMount"() {
      var e = this.props.route.params;
      if (e) {
        var t = e.url;
        this.setState({
          url: t
        });
      }
    }
    "render"() {
      return React.default.createElement(ReactNative.Modal, {
        onRequestClose: this.goBack,
        animationType: 'fade'
      }, React.default.createElement(ReactNative.View, {
        style: p.container
      }, React.default.createElement(_WebView, {
        ref: instance => this.webView = instance,
        style: {
          flex: 1,
          width: '100%',
          height: '100%'
        },
        source: {
          uri: this.state.url
        },
        javaScriptEnabled: true,
        domStorageEnabled: true,
        startInLoadingState: true,
        automaticallyAdjustContentInsets: false,
        useWebKit: true
      }), React.default.createElement(components.Icon, {
        name: icons.default.LINK_VARIANT,
        color: "#000",
        size: 22,
        style: p.linkIcon,
        onPress: this.onLink
      })));
    }
  };
exports.default = c;
var p = ReactNative.StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000'
  },
  linkIcon: {
    position: 'absolute',
    top: ReactNative.StatusBar.currentHeight,
    right: 10
  }
});
