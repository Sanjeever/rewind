const _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");
const _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
const _appStorage = require("./../storage/index.js");
const _asyncRuntime = require("@babel/runtime/helpers/regeneratorRuntime")();
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  reactNativeSpringScrollview = require("./../components/Scrolling.js"),
  components = require("../components/index"),
  providers = _interopRequireDefault(require("../services/providers")),
  icons = _interopRequireDefault(require("../theme/icons")),
  keys = _interopRequireDefault(require("../storage/keys")),
  locales = _interopRequireDefault(require("../locales/index")),
  utils = require("../utils/index"),
  types = require("../utils/types"),
  files = require("../storage/files"),
  p = class t extends React.PureComponent {
    constructor() {
      var e, a, n;
      for (var r = arguments.length, i = new Array(r), l = 0; l < r; l++) i[l] = arguments[l];
      return a = n = super(...i), n.state = {
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
        false === e.deleted && _appStorage.storage.save({
          key: keys.default.maxCacheSize,
          data: t
        });
      }, n.getStorageCacheSize = function () {
        _appStorage.storage.load({
          key: keys.default.maxCacheSize
        }).then(function (e) {
          n.setState({
            maxCacheSize: e
          });
        }).catch(function () {});
      }, n.getCacheSize = function () {
        var e;
        return _asyncRuntime.async(function (t) {
          for (;;) switch (t.prev = t.next) {
            case 0:
              t.next = 2;
              return _asyncRuntime.awrap((0, files.getCurrentCache)());
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
        _appStorage.storage.remove({
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
        return _asyncRuntime.async(function (t) {
          for (;;) switch (t.prev = t.next) {
            case 0:
              t.next = 2;
              return _asyncRuntime.awrap(utils.dialogs.showCacheSizePicker());
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
      }, a;
    }
    "componentDidMount"() {
      this.getCacheSize();
      this.getStorageCacheSize();
    }
    "componentWillUnmount"() {
      this.saveStorageCacheSize();
    }
    "render"() {
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
  },
  g = ReactNative.StyleSheet.create({
    scrollContainer: {
      paddingHorizontal: 12
    }
  }),
  m = p;
exports.default = m;
