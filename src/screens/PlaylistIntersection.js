const _interopRequireWildcard = require('@babel/runtime/helpers/interopRequireWildcard');
const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');
const _toConsumableArray = require('@babel/runtime/helpers/toConsumableArray');
Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;
var React = _interopRequireWildcard(require('react')),
  ReactNative = require('react-native'),
  reactNativeLargelist = require('./../components/Scrolling.js'),
  components = require('../components/index'),
  constants = require('../theme/constants'),
  locales = _interopRequireDefault(require('../locales/index')),
  services = require('../services/index'),
  events = require('../events/index'),
  trackInfo = require('../services/trackInfo'),
  IntersectionHeader = _interopRequireDefault(require('./../modules/IntersectionHeader.js')),
  PlaylistComparison = _interopRequireDefault(require('./../modules/PlaylistComparison.js')),
  b = {
    intersection: 'intersection',
    difference: 'difference',
  },
  y = class t extends React.PureComponent {
    constructor() {
      var e, n, r;
      for (var a = arguments.length, l = new Array(a), o = 0; o < a; o++) l[o] = arguments[o];
      return (
        (n = r = super(...l)),
        (r.state = {
          item: null,
          left: null,
          right: null,
          selectorShow: false,
          data: [],
          intersectionData: [],
          differenceData: [],
          type: b.intersection,
        }),
        (r.init = async function (item) {
          const response = await services.Netease.playlist_detail(item.id);
          if (!response?.playlist) throw new Error(response?.message || locales.default.ERROR);
          r.setState({
            left: {
              ...item,
              playlist: response.playlist,
            },
            selectorShow: true,
          });
        }),
        (r.onTop = function () {
          var e;
          null === (e = r._list) ||
            void 0 === e ||
            e.scrollToIndexPath({
              row: 0,
            });
        }),
        (r._renderIndexPath = function (e) {
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
                index: l,
              });
            },
            detail: function () {
              return (0, events.toDetailModal)({
                item: a,
                index: l,
              });
            },
            addToQueue: function () {
              return (0, events.toInsertToList)({
                data: a,
              });
            },
          });
        }),
        (r.toggleType = function () {
          var e,
            t,
            n = r.state,
            a = n.type,
            i = n.intersectionData,
            l = n.differenceData;
          a === b.intersection ? ((e = b.difference), (t = l)) : ((e = b.intersection), (t = i));
          r.setState({
            type: e,
            data: t,
          });
        }),
        (r.onSelect = function (e) {
          r.setState(
            {
              right: e,
              selectorShow: false,
            },
            function () {
              r.fetchRightPlaylist();
            },
          );
        }),
        (r.fetchRightPlaylist = async function () {
          const response = await services.Netease.playlist_detail(r.state.right.id, true);
          if (response?.playlist) r.intersection(response);
        }),
        (r.intersection = function (e) {
          var t = r.state.left;
          if (t && e) {
            var n = t.playlist.tracks,
              a = e.playlist.tracks,
              i = [];
            if (
              (n.forEach(function (e) {
                return a.forEach(function (t) {
                  e.id === t.id && i.push(e);
                });
              }),
              0 !== i.length)
            ) {
              r.setState({
                data: i,
                intersectionData: i,
                type: b.intersection,
              });
              r.difference(n, a, i);
            } else {
              var l = _toConsumableArray(n).concat(_toConsumableArray(a));
              r.setState({
                data: l,
                type: b.difference,
                differenceData: l,
              });
            }
          }
        }),
        (r.difference = function (e, t, n) {
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
            differenceData: a,
          });
        }),
        n
      );
    }
    componentDidMount() {
      var e = this.props.route.params;
      if (e) {
        var t = e.item;
        this.init(t);
      }
    }
    render() {
      var e = this,
        t = this.state,
        n = t.left,
        r = t.right,
        a = t.selectorShow,
        f = t.data,
        d = t.type,
        p = d === b.intersection ? locales.default.INTERSECTION : locales.default.DIFFERENCE;
      return React.default.createElement(
        React.default.Fragment,
        null,
        React.default.createElement(
          components.PageContainer,
          {
            title: p,
            goBack: this.props.navigation.goBack,
            onTop: this.onTop,
          },
          React.default.createElement(reactNativeLargelist.LargeList, {
            ref: function (t) {
              return (e._list = t);
            },
            data: [
              {
                items: f,
              },
            ],
            heightForIndexPath: function () {
              return constants.ITEM_HEIGHT;
            },
            renderIndexPath: this._renderIndexPath,
            renderHeader: function () {
              return React.default.createElement(
                ReactNative.View,
                {
                  style: {
                    paddingTop: 20,
                  },
                },
                React.default.createElement(IntersectionHeader.default, {
                  left: n,
                  right: r,
                  onChangePlaylist: function () {
                    return e.setState({
                      selectorShow: true,
                    });
                  },
                  iLength: f ? f.length : 0,
                  type: d,
                  toggleType: e.toggleType,
                }),
              );
            },
          }),
        ),
        React.default.createElement(PlaylistComparison.default, {
          visible: a,
          onSelect: this.onSelect,
          onRequestClose: function () {
            return e.setState({
              selectorShow: false,
            });
          },
        }),
      );
    }
  };
exports.default = y;
