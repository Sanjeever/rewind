Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  components = require("../components/index"),
  icons = babelHelpers.interopRequireDefault(require("../theme/icons")),
  endpoints = require("../services/endpoints"),
  c = function (e) {
    function t() {
      var e, a, n;
      babelHelpers.classCallCheck(this, t);
      for (var r = arguments.length, o = new Array(r), i = 0; i < r; i++) o[i] = arguments[i];
      return babelHelpers.possibleConstructorReturn(n, (a = n = babelHelpers.possibleConstructorReturn(this, (e = babelHelpers.getPrototypeOf(t)).call.apply(e, [this].concat(o))), n.state = {
        url: endpoints.HOST_PAGE + "/tutorial"
      }, n.back = function () {
        n.props.navigation.goBack();
      }, n.onLink = function () {
        ReactNative.Linking.openURL(n.state.url);
      }, n.goBack = function () {
        n.props.navigation.goBack();
      }, a));
    }
    babelHelpers.createClass(t, [{
      key: "componentDidMount",
      value: function () {
        var e = this.props.navigation.state.params;
        if (e) {
          var t = e.url;
          this.setState({
            url: t
          });
        }
      }
    }, {
      key: "render",
      value: function () {
        return React.default.createElement(ReactNative.Modal, {
          onRequestClose: this.goBack,
          animationType: 'fade'
        }, React.default.createElement(ReactNative.View, {
          style: p.container
        }, React.default.createElement(ReactNative.WebView, {
          ref: "webView",
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
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(React.Component);
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
