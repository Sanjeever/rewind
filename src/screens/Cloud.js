const _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");
const _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireWildcard(require("react")),
  reactNativeSpringScrollview = require("./../components/Scrolling.js"),
  components = require("../components/index"),
  providers = _interopRequireDefault(require("../services/providers")),
  names = _interopRequireDefault(require("../events/names")),
  locales = _interopRequireDefault(require("../locales/index")),
  services = require("../services/index"),
  events = require("../events/index"),
  types = _interopRequireWildcard(require("../utils/types")),
  trackInfo = require("../services/trackInfo"),
  g = class t extends React.Component {
    constructor() {
      var e, n, r;
      for (var a = arguments.length, o = new Array(a), g = 0; g < a; g++) o[g] = arguments[g];
      return n = r = super(...o), r.state = {
        data: []
      }, r.getList = async function () {
        try {
          const response = await services.Netease.cloud();
          if (response?.code === 301) {
            toast(locales.default.NETEASE_NOT_LOGIN);
            r.props.navigation.navigate('NeteaseLogin');
            return;
          }
          if (!Array.isArray(response?.data)) throw new Error(response?.message || locales.default.ERROR);
          r.setState({
            data: response.data.map(song => ({
              name: song.songName,
              id: song.songId,
              title: song.songName,
              singer: song.artist,
              duration: song.simpleSong.dt,
              ar: [{
                id: -1,
                name: song.artist
              }],
              al: [{
                id: -1,
                name: song.album
              }]
            }))
          });
        } catch (error) {
          toast(error.message);
        }
      }, r.onTop = function () {
        var e, t;
        null === (e = (t = r._scrollView).scrollToBegin) || void 0 === e || e.call(t);
      }, r._renderItem = function (e) {
        var t = e.item,
          n = e.index,
          a = (0, trackInfo.extractFullInfo)(t);
        return React.default.createElement(components.SongRow, {
          key: n,
          index: n,
          song: a.song,
          album: a.album,
          singer: a.singer,
          onPress: function () {
            return r.playMusic(t, n);
          },
          addToQueue: function () {
            return r.addToQueue(t);
          }
        });
      }, r.addToQueue = function (e) {
        var t = r.state.api;
        events.emitter.emit(names.default.InsertToList, {
          data: e,
          type: 'item',
          api: t
        });
      }, r.playMusic = function (e, t) {
        var n = r.state.data;
        (0, events.toPlayer)({
          item: e,
          data: n,
          index: t,
          api: providers.default.netEase
        });
      }, n;
    }
    "componentDidMount"() {
      this.getList();
    }
    "render"() {
      var e = this,
        t = this.state.data;
      return React.default.createElement(components.PageContainer, {
        goBack: function () {
          return e.props.navigation.goBack();
        },
        onTop: this.onTop,
        title: locales.default.CLOUD_DRIVE
      }, React.default.createElement(reactNativeSpringScrollview.SpringScrollView, {
        ref: function (t) {
          return e._scrollView = t;
        }
      }, t.map(function (t, n) {
        return e._renderItem({
          item: t,
          index: n
        });
      })));
    }
  };
exports.default = g;
