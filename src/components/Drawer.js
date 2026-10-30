Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  reactNativeSpringScrollview = require("react-native-spring-scrollview"),
  components = require("./index"),
  utils = require("../utils/index"),
  update = babelHelpers.interopRequireDefault(require("../services/update")),
  ProfileHeader = babelHelpers.interopRequireDefault(require("./ProfileHeader")),
  DrawerActions = babelHelpers.interopRequireDefault(require("./DrawerActions")),
  b = function (e) {
    function t() {
      var e, n, r;
      babelHelpers.classCallCheck(this, t);
      for (var a = arguments.length, l = new Array(a), i = 0; i < a; i++) l[i] = arguments[i];
      return babelHelpers.possibleConstructorReturn(r, (n = r = babelHelpers.possibleConstructorReturn(this, (e = babelHelpers.getPrototypeOf(t)).call.apply(e, [this].concat(l))), r._nativeOffset = {
        x: new ReactNative.Animated.Value(0),
        y: new ReactNative.Animated.Value(0)
      }, n));
    }
    babelHelpers.createClass(t, [{
      key: "render",
      value: function () {
        var e = this.props.navigation;
        return React.default.createElement(ReactNative.View, {
          style: {
            flex: 1,
            backgroundColor: '#303636'
          }
        }, React.default.createElement(components.Background, null), React.default.createElement(reactNativeSpringScrollview.SpringScrollView, {
          onNativeContentOffsetExtract: this._nativeOffset
        }, React.default.createElement(ProfileHeader.default, {
          onNavigate: function (t) {
            return e.navigate(t);
          },
          nativeOffset: this._nativeOffset
        }), React.default.createElement(DrawerActions.default, {
          envelop: function () {
            return e.navigate('Msg');
          },
          about: function () {
            return e.navigate('About');
          },
          settings: function () {
            return e.navigate('Settings');
          },
          update: function () {
            return update.default.checkAndAlert();
          },
          timer: function () {
            return utils.stopTimer.open();
          },
          cloud: function () {
            return e.navigate('Cloud');
          },
          feature: function () {
            return e.navigate('FeaturePage');
          },
          navigation: e
        })));
      }
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(React.PureComponent);
exports.default = b;
