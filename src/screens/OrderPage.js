const _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");
const _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
const _appStorage = require("./../storage/index.js");
const _defineProperty = require("@babel/runtime/helpers/defineProperty");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var immer = require("immer"),
  React = _interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  SegmentedControl = _interopRequireDefault(require("../components/SegmentedControl")),
  components = require("../components/index"),
  TabbedViewPager = _interopRequireDefault(require("../native/TabbedViewPager")),
  pagesModule = _interopRequireDefault(require("../settings/pages")),
  icons = _interopRequireDefault(require("../theme/icons")),
  keys = _interopRequireDefault(require("../storage/keys")),
  locales = _interopRequireDefault(require("../locales/index")),
  restartModule = _interopRequireDefault(require("../native/restart")),
  ProviderSelector = _interopRequireDefault(require("./../modules/ProviderSelector.js")),
  v = class a extends React.PureComponent {
    constructor() {
      var e, t, r;
      for (var n = arguments.length, s = new Array(n), i = 0; i < n; i++) s[i] = arguments[i];
      return t = r = super(...s), r._TAB_NAMES = ['Up', 'Down'], r.state = {
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
          _appStorage.storage.save({
            key: keys.default.apisOrder,
            data: u
          });
          _appStorage.storage.save({
            key: keys.default.pagesOrder,
            data: i
          });
        }
      }, r.loadOrder = function () {
        _appStorage.storage.load({
          key: keys.default.pagesOrder
        }).then(function (e) {
          e && r.setState({
            pages: e
          });
        }).catch(function () {
          return null;
        });
        _appStorage.storage.load({
          key: keys.default.apisOrder
        }).then(function (e) {
          e && r.setState({
            apis: e
          });
        }).catch(function () {
          return null;
        });
      }, r.removeStorage = function () {
        _appStorage.storage.remove({
          key: keys.default.apisOrder
        });
        _appStorage.storage.remove({
          key: keys.default.pagesOrder
        });
        toast(locales.default.CACHE_CLEARED);
      }, r.renderPageRow = function (e) {
        var a = e.data,
          t = e.active;
        return React.default.createElement(ProviderSelector.default, {
          data: a,
          active: t,
          type: "pages"
        });
      }, r.onReleaseRow = function (e, a, t) {
        var n;
        r.setState((n = {}, _defineProperty(n, t + "Order", a), _defineProperty(n, "changed", true), n));
      }, r.renderApiRow = function (e) {
        var a = e.data,
          t = e.active;
        return React.default.createElement(ProviderSelector.default, {
          data: a,
          active: t,
          type: "apis"
        });
      }, t;
    }
    "componentDidMount"() {
      this.loadOrder();
      this.backSubscription = ReactNative.BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    }
    "componentWillUnmount"() {
      this.backSubscription?.remove();
    }
    "alertChange"() {
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
    "render"() {
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
  };
exports.default = v;
