Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireWildcard(require("react")),
  components = require("../components/index"),
  providers = babelHelpers.interopRequireDefault(require("../services/providers")),
  locales = babelHelpers.interopRequireDefault(require("../locales/index")),
  utils = require("../utils/index"),
  p = function (e) {
    function t() {
      var e, r, a;
      babelHelpers.classCallCheck(this, t);
      for (var l = arguments.length, p = new Array(l), b = 0; b < l; b++) p[b] = arguments[b];
      return babelHelpers.possibleConstructorReturn(a, (r = a = babelHelpers.possibleConstructorReturn(this, (e = babelHelpers.getPrototypeOf(t)).call.apply(e, [this].concat(p))), a.formatListItem = function (e) {
        var t = {};
        switch (a.props.api) {
          case providers.default.netEase:
            var r = utils.timeFormatter.localeString(e.publishTime);
            t.title = e.name;
            t.subtitle = e.size + " " + locales.default.SONG_COUNT + ", " + r;
            t.img = e.picUrl + '?param=150y150';
            t.trans = (0, utils.delve)(e, 'alias.0') || (0, utils.delve)(e, 'transNames.0');
            break;
          case providers.default.qqMusic:
            t.title = e.albumName;
            t.subtitle = e.latest_song.song_count + " " + locales.default.SONG_COUNT + ", " + e.pubTime;
            t.img = "http://y.gtimg.cn/music/photo_new/T002R150x150M000" + e.albumMID + ".jpg";
            break;
          default:
            t.title = null;
            t.subtitle = null;
            t.img = null;
        }
        return t;
      }, a._renderItem = function (e) {
        var t = e.item,
          r = e.index,
          l = a.formatListItem(t);
        return React.default.createElement(components.ListItem, {
          key: r,
          img: l.img,
          title: l.title,
          subtitle: l.subtitle,
          trans: l.trans,
          onPress: function () {
            return a.albumPage(t, a.props.api);
          }
        });
      }, a.albumPage = function (e, t) {
        a.props.navigation.navigate('AlbumPage', {
          item: e,
          api: t
        });
      }, r));
    }
    babelHelpers.createClass(t, [{
      key: "render",
      value: function () {
        var e = this;
        return this.props.albums.map(function (t, r) {
          return e._renderItem({
            item: t,
            index: r
          });
        });
      }
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(React.PureComponent);
exports.default = p;
