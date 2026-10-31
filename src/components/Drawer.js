const _interopRequireWildcard = require('@babel/runtime/helpers/interopRequireWildcard');
const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');
Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;
var React = _interopRequireWildcard(require('react')),
  ReactNative = require('react-native'),
  reactNativeSpringScrollview = require('./Scrolling.js'),
  components = require('./index'),
  utils = require('../utils/index'),
  updateModule = _interopRequireDefault(require('../services/update')),
  ProfileHeader = _interopRequireDefault(require('./ProfileHeader')),
  DrawerActions = _interopRequireDefault(require('./DrawerActions')),
  b = class t extends React.PureComponent {
    constructor() {
      var e, n, r;
      for (var a = arguments.length, l = new Array(a), i = 0; i < a; i++) l[i] = arguments[i];
      return (
        (n = r = super(...l)),
        (r._nativeOffset = {
          x: new ReactNative.Animated.Value(0),
          y: new ReactNative.Animated.Value(0),
        }),
        n
      );
    }
    render() {
      var e = this.props.navigation;
      return React.default.createElement(
        ReactNative.View,
        {
          style: {
            flex: 1,
            backgroundColor: '#303636',
          },
        },
        React.default.createElement(components.Background, null),
        React.default.createElement(
          reactNativeSpringScrollview.SpringScrollView,
          {
            onNativeContentOffsetExtract: this._nativeOffset,
          },
          React.default.createElement(ProfileHeader.default, {
            onNavigate: function (t) {
              return e.navigate(t);
            },
            nativeOffset: this._nativeOffset,
          }),
          React.default.createElement(DrawerActions.default, {
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
              return updateModule.default.checkAndAlert();
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
            navigation: e,
          }),
        ),
      );
    }
  };
exports.default = b;
