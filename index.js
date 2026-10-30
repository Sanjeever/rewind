var ReactNative = require("react-native"),
  App = babelHelpers.interopRequireDefault(require("./src/App"));
ReactNative.AppRegistry.registerComponent('rewind', function () {
  return App.default;
});
