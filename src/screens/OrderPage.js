Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var immer = require("immer"),
  React = babelHelpers.interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  SegmentedControl = babelHelpers.interopRequireDefault(require("../components/SegmentedControl")),
  components = require("../components/index"),
  TabbedViewPager = babelHelpers.interopRequireDefault(require("../native/TabbedViewPager")),
  pagesModule = babelHelpers.interopRequireDefault(require("../settings/pages")),
  icons = babelHelpers.interopRequireDefault(require("../theme/icons")),
  keys = babelHelpers.interopRequireDefault(require("../storage/keys")),
  locales = babelHelpers.interopRequireDefault(require("../locales/index")),
  restartModule = babelHelpers.interopRequireDefault(require("../native/restart")),
  module844 = babelHelpers.interopRequireDefault(require("../modules/module-844")),
  v = function (e) {
    function a() {
      var e, t, r;
      babelHelpers.classCallCheck(this, a);
      for (var n = arguments.length, s = new Array(n), i = 0; i < n; i++) s[i] = arguments[i];
      return babelHelpers.possibleConstructorReturn(r, (t = r = babelHelpers.possibleConstructorReturn(this, (e = babelHelpers.getPrototypeOf(a)).call.apply(e, [this].concat(s))), r._TAB_NAMES = ['Up', 'Down'], r.state = {
        pages: pagesModule.default.pages,
        apis: pagesModule.default.apis,
        pagesOrder: null,
        apisOrder: null,
        changed: false
      }, r.onBackPress = function () {
        return !!r.state.changed && (r.alertChange(), true);
      }, r.confirmChange = function () {
        r.saveOrder();
        setTimeout(function () {
          restartModule.default.restart();
        }, 99);
      }, r.saveOrder = function () {
        var e = r.state,
          a = e.pages,
          t = e.apis,
          n = e.changed,
          o = e.pagesOrder,
          s = e.apisOrder;
        if (n) {
          var i = (0, immer.produce)(a, function (e) {
              null === o || void 0 === o || o.forEach(function (t, r) {
                e[r] = a[t];
              });
            }),
            u = (0, immer.produce)(t, function (e) {
              null === s || void 0 === s || s.forEach(function (a, r) {
                e[r] = t[a];
              });
            });
          storage.save({
            key: keys.default.apisOrder,
            data: u
          });
          storage.save({
            key: keys.default.pagesOrder,
            data: i
          });
        }
      }, r.loadOrder = function () {
        storage.load({
          key: keys.default.pagesOrder
        }).then(function (e) {
          e && r.setState({
            pages: e
          });
        }).catch(function () {
          return null;
        });
        storage.load({
          key: keys.default.apisOrder
        }).then(function (e) {
          e && r.setState({
            apis: e
          });
        }).catch(function () {
          return null;
        });
      }, r.removeStorage = function () {
        storage.remove({
          key: keys.default.apisOrder
        });
        storage.remove({
          key: keys.default.pagesOrder
        });
        toast(locales.default.CACHE_CLEARED);
      }, r.renderPageRow = function (e) {
        var a = e.data,
          t = e.active;
        return React.default.createElement(module844.default, {
          data: a,
          active: t,
          type: "pages"
        });
      }, r.onReleaseRow = function (e, a, t) {
        var n;
        r.setState((n = {}, babelHelpers.defineProperty(n, t + "Order", a), babelHelpers.defineProperty(n, "changed", true), n));
      }, r.renderApiRow = function (e) {
        var a = e.data,
          t = e.active;
        return React.default.createElement(module844.default, {
          data: a,
          active: t,
          type: "apis"
        });
      }, t));
    }
    babelHelpers.createClass(a, [{
      key: "componentDidMount",
      value: function () {
        this.loadOrder();
        ReactNative.BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
      }
    }, {
      key: "componentWillUnmount",
      value: function () {
        ReactNative.BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
      }
    }, {
      key: "alertChange",
      value: function () {
        var e = this;
        ReactNative.Alert.alert(locales.default.WARN, locales.default.NEED_RELOAD_APP, [{
          text: locales.default.CANCEL,
          onPress: function () {
            e.props.navigation.goBack();
          },
          style: 'cancel'
        }, {
          text: locales.default.CONFIRM,
          onPress: this.confirmChange
        }]);
      }
    }, {
      key: "render",
      value: function () {
        var e = this,
          a = this.state,
          t = a.pages,
          r = a.apis;
        return React.default.createElement(components.PageContainer, {
          title: locales.default.ORDER,
          goBack: this.props.navigation.goBack,
          rightIcon: [{
            name: icons.default.CHECK,
            onPress: function () {
              return e.alertChange();
            }
          }, {
            name: icons.default.WINDOW_CLOSE,
            onPress: function () {
              return e.removeStorage();
            }
          }],
          disabledTopFadingEdge: true
        }, React.default.createElement(TabbedViewPager.default, {
          tabNames: this._TAB_NAMES
        }, React.default.createElement(SegmentedControl.default, {
          style: {
            padding: 10,
            paddingHorizontal: 15
          },
          data: t,
          renderRow: this.renderPageRow,
          onReleaseRow: function (a, t) {
            return e.onReleaseRow(a, t, 'pages');
          }
        }), React.default.createElement(SegmentedControl.default, {
          style: {
            padding: 10,
            paddingHorizontal: 15
          },
          data: r,
          renderRow: this.renderApiRow,
          onReleaseRow: function (a, t) {
            return e.onReleaseRow(a, t, 'apis');
          }
        })));
      }
    }]);
    babelHelpers.inherits(a, e);
    return a;
  }(React.PureComponent);
exports.default = v;
