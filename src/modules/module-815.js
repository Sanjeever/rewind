Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireWildcard(require("react")),
  components = require("../components/index"),
  providers = babelHelpers.interopRequireDefault(require("../services/providers")),
  utils = require("../utils/index"),
  queue = babelHelpers.interopRequireDefault(require("../events/queue")),
  p = function (e) {
    function t() {
      var e, r, l;
      babelHelpers.classCallCheck(this, t);
      for (var i = arguments.length, p = new Array(i), b = 0; b < i; b++) p[b] = arguments[b];
      return babelHelpers.possibleConstructorReturn(l, (r = l = babelHelpers.possibleConstructorReturn(this, (e = babelHelpers.getPrototypeOf(t)).call.apply(e, [this].concat(p))), l.formatListItem = function (e) {
        var t = {};
        switch (l.props.api) {
          case providers.default.netEase:
            var r = utils.timeFormatter.parseTime(e.duration / 1e3);
            t.title = e.name;
            t.subtitle = r + ' | ' + e.publishTime;
            t.img = e.imgurl + '?param=500y500';
            break;
          case providers.default.qqMusic:
            t.title = e.title;
            t.subtitle = e.date;
            t.img = e.pic;
            break;
          default:
            t.title = null;
            t.subtitle = null;
            t.img = null;
        }
        return t;
      }, l._renderItem = function (e) {
        var t = e.item,
          r = e.index,
          i = l.formatListItem(t);
        return React.default.createElement(components.ListItem, {
          key: r,
          img: i.img,
          title: i.title,
          subtitle: i.subtitle,
          onPress: function () {
            return l.playMV(t, l.props.api);
          },
          numberOfLines: 2
        });
      }, l.playMV = function (e, t) {
        var r = t === providers.default.netEase ? e.id : e.vid;
        queue.default.playMV(r, t);
      }, r));
    }
    babelHelpers.createClass(t, [{
      key: "render",
      value: function () {
        var e = this;
        return this.props.mvs.map(function (t, r) {
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
