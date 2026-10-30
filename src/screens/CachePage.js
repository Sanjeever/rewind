Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  reactNativeSpringScrollview = require("react-native-spring-scrollview"),
  components = require("../components/index"),
  providers = babelHelpers.interopRequireDefault(require("../services/providers")),
  icons = babelHelpers.interopRequireDefault(require("../theme/icons")),
  keys = babelHelpers.interopRequireDefault(require("../storage/keys")),
  locales = babelHelpers.interopRequireDefault(require("../locales/index")),
  utils = require("../utils/index"),
  types = require("../utils/types"),
  files = require("../storage/files"),
  p = function (e) {
    function t() {
      var e, a, n;
      babelHelpers.classCallCheck(this, t);
      for (var r = arguments.length, i = new Array(r), l = 0; l < r; l++) i[l] = arguments[l];
      return babelHelpers.possibleConstructorReturn(n, (a = n = babelHelpers.possibleConstructorReturn(this, (e = babelHelpers.getPrototypeOf(t)).call.apply(e, [this].concat(i))), n.state = {
        caches: [{
          type: providers.default.netEase,
          name: locales.default.NETEASE_MUSIC,
          size: 0
        }, {
          type: providers.default.qqMusic,
          name: locales.default.QQ_MUSIC,
          size: 0
        }],
        maxCacheSize: 200,
        deleted: false,
        cacheSize: 0
      }, n.saveStorageCacheSize = function () {
        var e = n.state,
          t = e.maxCacheSize;
        false === e.deleted && storage.save({
          key: keys.default.maxCacheSize,
          data: t
        });
      }, n.getStorageCacheSize = function () {
        storage.load({
          key: keys.default.maxCacheSize
        }).then(function (e) {
          n.setState({
            maxCacheSize: e
          });
        }).catch(function () {});
      }, n.getCacheSize = function () {
        var e;
        return regeneratorRuntime.async(function (t) {
          for (;;) switch (t.prev = t.next) {
            case 0:
              t.next = 2;
              return regeneratorRuntime.awrap((0, files.getCurrentCache)());
            case 2:
              (e = t.sent) > 0 && n.setState({
                cacheSize: e
              });
            case 4:
            case "end":
              return t.stop();
          }
        }, null, this);
      }, n.removeSettings = function () {
        storage.remove({
          key: keys.default.maxCacheSize
        }).then(function () {
          n.setState({
            deleted: true,
            maxCacheSize: 200
          });
          toast(locales.default.CACHE_SETTING_DONE);
        });
      }, n.onSetCacheMax = function () {
        var e;
        return regeneratorRuntime.async(function (t) {
          for (;;) switch (t.prev = t.next) {
            case 0:
              t.next = 2;
              return regeneratorRuntime.awrap(utils.dialogs.showCacheSizePicker());
            case 2:
              e = t.sent;
              (0, types.isNumber)(e) && n.setState({
                maxCacheSize: e
              });
            case 4:
            case "end":
              return t.stop();
          }
        }, null, this);
      }, n.onDelete = function () {
        toast(locales.default.CACHE_CLEARED);
        (0, files.clearCache)();
        n.setState({
          cacheSize: 0
        });
      }, a));
    }
    babelHelpers.createClass(t, [{
      key: "componentDidMount",
      value: function () {
        this.getCacheSize();
        this.getStorageCacheSize();
      }
    }, {
      key: "componentWillUnmount",
      value: function () {
        this.saveStorageCacheSize();
      }
    }, {
      key: "render",
      value: function () {
        var e = this,
          t = this.state,
          a = t.cacheSize,
          n = t.maxCacheSize;
        return React.default.createElement(components.PageContainer, {
          title: locales.default.CACHE,
          goBack: function () {
            return e.props.navigation.goBack();
          },
          rightIcon: {
            name: icons.default.BACKUP_RESTORE,
            onPress: function () {
              return e.removeSettings();
            }
          }
        }, React.default.createElement(reactNativeSpringScrollview.SpringScrollView, {
          style: g.scrollContainer
        }, React.default.createElement(components.SettingItem, {
          title: locales.default.CACHE_MAX_SIZE,
          subtitle: n + "MB",
          onPress: this.onSetCacheMax,
          showChevron: true
        }), React.default.createElement(components.SettingItem, {
          title: locales.default.CACHE_SIZE,
          subtitle: (0, files.bytesToSize)(a),
          onPress: this.onDelete,
          showChevron: true
        })));
      }
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(React.PureComponent),
  g = ReactNative.StyleSheet.create({
    scrollContainer: {
      paddingHorizontal: 12
    }
  }),
  m = p;
exports.default = m;
