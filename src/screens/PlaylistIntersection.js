Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  reactNativeLargelist = require("react-native-largelist"),
  components = require("../components/index"),
  constants = require("../theme/constants"),
  locales = babelHelpers.interopRequireDefault(require("../locales/index")),
  services = require("../services/index"),
  events = require("../events/index"),
  trackInfo = require("../services/trackInfo"),
  module898 = babelHelpers.interopRequireDefault(require("../modules/module-898")),
  module899 = babelHelpers.interopRequireDefault(require("../modules/module-899")),
  b = {
    intersection: 'intersection',
    difference: 'difference'
  },
  y = function (e) {
    function t() {
      var e, n, r;
      babelHelpers.classCallCheck(this, t);
      for (var a = arguments.length, l = new Array(a), o = 0; o < a; o++) l[o] = arguments[o];
      return babelHelpers.possibleConstructorReturn(r, (n = r = babelHelpers.possibleConstructorReturn(this, (e = babelHelpers.getPrototypeOf(t)).call.apply(e, [this].concat(l))), r.state = {
        item: null,
        left: null,
        right: null,
        selectorShow: false,
        data: [],
        intersectionData: [],
        differenceData: [],
        type: b.intersection
      }, r.init = function (e) {
        var t;
        return regeneratorRuntime.async(function (n) {
          for (;;) switch (n.prev = n.next) {
            case 0:
              n.next = 2;
              return regeneratorRuntime.awrap(services.Netease.playlist_detail(e.id));
            case 2:
              t = n.sent;
              e.playlist = t.playlist;
              r.setState({
                left: e,
                selectorShow: true
              });
            case 5:
            case "end":
              return n.stop();
          }
        }, null, this);
      }, r.onTop = function () {
        var e;
        null === (e = r._list) || void 0 === e || e.scrollToIndexPath({
          row: 0
        });
      }, r._renderIndexPath = function (e) {
        var t = e.row,
          n = r.state.data,
          a = n[t],
          l = t,
          o = (0, trackInfo.extractFullInfo)(a);
        return React.default.createElement(components.SongRow, {
          song: o.song,
          singer: o.singer,
          album: o.album,
          index: l,
          alias: o.alias,
          onPress: function () {
            return (0, events.toPlayer)({
              item: a,
              data: n,
              index: l
            });
          },
          detail: function () {
            return (0, events.toDetailModal)({
              item: a,
              index: l
            });
          },
          addToQueue: function () {
            return (0, events.toInsertToList)({
              data: a
            });
          }
        });
      }, r.toggleType = function () {
        var e,
          t,
          n = r.state,
          a = n.type,
          i = n.intersectionData,
          l = n.differenceData;
        a === b.intersection ? (e = b.difference, t = l) : (e = b.intersection, t = i);
        r.setState({
          type: e,
          data: t
        });
      }, r.onSelect = function (e) {
        r.setState({
          right: e,
          selectorShow: false
        }, function () {
          r.fetchRightPlaylist();
        });
      }, r.fetchRightPlaylist = function () {
        var e, t;
        return regeneratorRuntime.async(function (n) {
          for (;;) switch (n.prev = n.next) {
            case 0:
              e = r.state.right;
              n.next = 3;
              return regeneratorRuntime.awrap(services.Netease.playlist_detail(e.id, true));
            case 3:
              (t = n.sent) && r.intersection(t);
            case 5:
            case "end":
              return n.stop();
          }
        }, null, this);
      }, r.intersection = function (e) {
        var t = r.state.left;
        if (t && e) {
          var n = t.playlist.tracks,
            a = e.playlist.tracks,
            i = [];
          if (n.forEach(function (e) {
            return a.forEach(function (t) {
              e.id === t.id && i.push(e);
            });
          }), 0 !== i.length) {
            r.setState({
              data: i,
              intersectionData: i,
              type: b.intersection
            });
            r.difference(n, a, i);
          } else {
            var l = babelHelpers.toConsumableArray(n).concat(babelHelpers.toConsumableArray(a));
            r.setState({
              data: l,
              type: b.difference,
              differenceData: l
            });
          }
        }
      }, r.difference = function (e, t, n) {
        var a = [],
          i = {};
        n.forEach(function (e) {
          i[e.id] = true;
        });
        e.forEach(function (e) {
          i[e.id] || a.push(e);
        });
        t.forEach(function (e) {
          i[e.id] || a.push(e);
        });
        r.setState({
          differenceData: a
        });
      }, n));
    }
    babelHelpers.createClass(t, [{
      key: "componentDidMount",
      value: function () {
        var e = this.props.navigation.state.params;
        if (e) {
          var t = e.item;
          this.init(t);
        }
      }
    }, {
      key: "render",
      value: function () {
        var e = this,
          t = this.state,
          n = t.left,
          r = t.right,
          a = t.selectorShow,
          f = t.data,
          d = t.type,
          p = d === b.intersection ? locales.default.INTERSECTION : locales.default.DIFFERENCE;
        return React.default.createElement(React.default.Fragment, null, React.default.createElement(components.PageContainer, {
          title: p,
          goBack: this.props.navigation.goBack,
          onTop: this.onTop
        }, React.default.createElement(reactNativeLargelist.LargeList, {
          ref: function (t) {
            return e._list = t;
          },
          data: [{
            items: f
          }],
          heightForIndexPath: function () {
            return constants.ITEM_HEIGHT;
          },
          renderIndexPath: this._renderIndexPath,
          renderHeader: function () {
            return React.default.createElement(ReactNative.View, {
              style: {
                paddingTop: 20
              }
            }, React.default.createElement(module898.default, {
              left: n,
              right: r,
              onChangePlaylist: function () {
                return e.setState({
                  selectorShow: true
                });
              },
              iLength: f ? f.length : 0,
              type: d,
              toggleType: e.toggleType
            }));
          }
        })), React.default.createElement(module899.default, {
          visible: a,
          onSelect: this.onSelect,
          onRequestClose: function () {
            return e.setState({
              selectorShow: false
            });
          }
        }));
      }
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(React.PureComponent);
exports.default = y;
