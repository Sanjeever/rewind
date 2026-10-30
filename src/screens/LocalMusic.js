Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireWildcard(require("react")),
  components = require("../components/index"),
  providers = babelHelpers.interopRequireDefault(require("../services/providers")),
  names = babelHelpers.interopRequireDefault(require("../events/names")),
  icons = babelHelpers.interopRequireDefault(require("../theme/icons")),
  locales = babelHelpers.interopRequireDefault(require("../locales/index")),
  events = require("../events/index"),
  utils = require("../utils/index"),
  mediaStore = babelHelpers.interopRequireDefault(require("../native/mediaStore")),
  module863 = babelHelpers.interopRequireDefault(require("../modules/module-863")),
  h = {
    time: 'random',
    random: 'song',
    song: 'artist',
    artist: 'album',
    album: 'time'
  },
  v = function (e) {
    function t() {
      var e, a, r;
      babelHelpers.classCallCheck(this, t);
      for (var n = arguments.length, i = new Array(n), l = 0; l < n; l++) i[l] = arguments[l];
      return babelHelpers.possibleConstructorReturn(r, (a = r = babelHelpers.possibleConstructorReturn(this, (e = babelHelpers.getPrototypeOf(t)).call.apply(e, [this].concat(i))), r.state = {
        playList: null,
        oriList: [],
        sortMode: 'time'
      }, r.loadPlayList = function () {
        mediaStore.default.getPlayList().then(function (e) {
          if (e) {
            var t = e.data.filter(function (e) {
              return e.duration / 1e3 > 30 && !e.path.includes('record');
            });
            t.reverse();
            r.setState({
              oriList: t,
              playList: t
            });
          }
        });
      }, r.goBack = function () {
        return r.props.navigation.goBack();
      }, r.onSort = function () {
        var e,
          t = r.state,
          a = t.sortMode,
          n = t.oriList,
          i = h[a];
        switch (i) {
          case 'time':
            e = locales.default.DEFAULT_ORDER;
            r.setState({
              playList: n
            });
            break;
          case 'song':
            e = locales.default.SONG_ORDER;
            r.searchSong(':1', false, false);
            break;
          case 'artist':
            e = locales.default.ARTIST_ORDER;
            r.searchSong(':2', false, false);
            break;
          case 'album':
            e = locales.default.ALBUM_ORDER;
            r.searchSong(':3', false, false);
            break;
          case 'random':
            e = locales.default.RANDOM_ORDER;
            r.searchSong(':4', false, false);
        }
        toast(e);
        r.setState({
          sortMode: i
        });
      }, r.searchSong = function (e) {
        var t = r.state.oriList;
        if (t) {
          var a = utils.filterHelper.search(t, e);
          r.setState({
            playList: a
          });
        }
      }, r.onTop = function () {
        var e, t;
        null === (e = (t = r.refs.listParent).onTop) || void 0 === e || e.call(t);
      }, a));
    }
    babelHelpers.createClass(t, [{
      key: "componentDidMount",
      value: function () {
        var e = this;
        this.deleteReciver = events.emitter.addListener(names.default.DeleteFromLocal, function (t) {
          var a = t.deleteIndex,
            r = e.state.playList;
          if (r) {
            var n = r.filter(function (e, t) {
              return a !== t;
            });
            e.setState({
              playList: n
            });
          }
        });
        this.loadPlayList();
      }
    }, {
      key: "componentWillUnmount",
      value: function () {
        this.deleteReciver.remove();
      }
    }, {
      key: "render",
      value: function () {
        var e = this;
        return React.default.createElement(components.PageContainer, {
          title: locales.default.LOCAL_MUSIC,
          goBack: this.goBack,
          opacity: this.opacity,
          onTop: this.onTop,
          onChangeText: function (t) {
            return e.searchSong(t);
          },
          rightIcon: [{
            name: icons.default.SORT_VARIANT,
            onPress: this.onSort
          }, {
            name: icons.default.MAGNIFY
          }]
        }, React.default.createElement(module863.default, {
          data: this.state.playList,
          playMusic: function (t, a) {
            return e.playMusic(t, a);
          },
          onDetail: function (e, t) {
            return (0, events.toDetailModal)({
              item: e,
              index: t,
              api: providers.default.local
            });
          },
          addToQueue: function (e) {
            return (0, events.toInsertToList)({
              data: e,
              api: providers.default.local
            });
          },
          ref: "listParent"
        }));
      }
    }, {
      key: "playMusic",
      value: function (e) {
        var t = this.state.playList,
          a = t,
          r = t.findIndex(function (t) {
            return t.title === e.title;
          });
        (0, events.toPlayer)({
          item: e,
          data: a,
          index: r,
          api: providers.default.local
        });
      }
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(React.Component);
exports.default = v;
