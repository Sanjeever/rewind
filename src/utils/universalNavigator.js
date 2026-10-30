Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var o,
  reactNavigation = require("react-navigation");
var u = {
  navigate: function (a, t) {
    var e;
    null === (e = o) || void 0 === e || e.dispatch(reactNavigation.NavigationActions.navigate({
      type: reactNavigation.NavigationActions.NAVIGATE,
      routeName: a,
      params: t
    }));
  },
  setTopLevelNavigator: function (a) {
    o = a;
  }
};
exports.default = u;
