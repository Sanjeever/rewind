Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  reactNavigation = require("react-navigation"),
  components = require("../components/index"),
  constants = require("../theme/constants"),
  icons = babelHelpers.interopRequireDefault(require("../theme/icons")),
  devMenu = babelHelpers.interopRequireDefault(require("../native/devMenu")),
  info = require("../native/info"),
  module851 = babelHelpers.interopRequireDefault(require("../modules/module-851")),
  home = babelHelpers.interopRequireDefault(require("./home/index")),
  h = function (e) {
    function t() {
      var e, n, r;
      babelHelpers.classCallCheck(this, t);
      for (var a = arguments.length, l = new Array(a), o = 0; o < a; o++) l[o] = arguments[o];
      return babelHelpers.possibleConstructorReturn(r, (n = r = babelHelpers.possibleConstructorReturn(this, (e = babelHelpers.getPrototypeOf(t)).call.apply(e, [this].concat(l))), r.onDevMenu = function () {
        info.isDebug && devMenu.default.show();
      }, r.onSearch = function () {
        r.props.navigation.navigate('SearchPage');
      }, r.onDrawer = function () {
        r.props.navigation.navigate('DrawerOpen');
      }, n));
    }
    babelHelpers.createClass(t, [{
      key: "render",
      value: function () {
        return React.default.createElement(ReactNative.View, {
          style: g.container
        }, React.default.createElement(home.default, {
          navigation: this.props.navigation
        }), React.default.createElement(components.TouchableBorderless, {
          onPress: this.onDrawer,
          onLongPress: this.onDevMenu,
          style: g.onDrawerBtn
        }, React.default.createElement(components.Icon, {
          name: icons.default.MENU,
          style: g.iconStyle
        })), React.default.createElement(components.TouchableBorderless, {
          onPress: this.onSearch,
          style: [g.onDrawerBtn, {
            left: null,
            right: 10
          }]
        }, React.default.createElement(components.Icon, {
          name: icons.default.MAGNIFY,
          style: g.iconStyle
        })));
      }
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(React.PureComponent),
  g = ReactNative.StyleSheet.create({
    container: {
      flex: 1
    },
    onDrawerBtn: {
      position: 'absolute',
      top: constants.STATUS_BAR_HEIGHT,
      left: 10,
      justifyContent: 'center',
      alignItems: 'center'
    },
    iconStyle: {
      height: '100%',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1
    }
  }),
  v = (0, reactNavigation.DrawerNavigator)({
    Home: {
      screen: h
    }
  }, {
    navigationOptions: {
      drawerLockMode: 'locked-closed'
    },
    drawerWidth: .7 * constants.DEVICE_WIDTH,
    drawerPosition: 'left',
    contentComponent: function (e) {
      return React.default.createElement(module851.default, e);
    }
  });
exports.default = v;
