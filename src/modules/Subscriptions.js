const _default = require('./../components/Text.js').default;
const _interopRequireWildcard = require('@babel/runtime/helpers/interopRequireWildcard');
const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');
Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;
var React = _interopRequireWildcard(require('react')),
  ReactNative = require('react-native'),
  reactNativeLargelist = require('./../components/Scrolling.js'),
  components = require('../components/index'),
  ParallaxList = _interopRequireDefault(require('../components/ParallaxList')),
  providers = _interopRequireDefault(require('../services/providers')),
  constants = require('../theme/constants'),
  names = _interopRequireDefault(require('../events/names')),
  locales = _interopRequireDefault(require('../locales/index')),
  services = require('../services/index'),
  utils = require('../utils/index'),
  h = class t extends React.PureComponent {
    constructor() {
      var e, a, n;
      for (var r = arguments.length, o = new Array(r), u = 0; u < r; u++) o[u] = arguments[u];
      return (
        (a = n = super(...o)),
        (n.state = {
          data: [],
          offset: 0,
        }),
        (n.onTop = function () {
          var e, t;
          0 === n.props.index
            ? null === (e = n._artistList) ||
              void 0 === e ||
              e.scrollTo({
                x: 0,
                y: 0,
              })
            : null === (t = n._albumList) ||
              void 0 === t ||
              t.scrollTo({
                x: 0,
                y: 0,
              });
        }),
        (n.loadData = function () {
          switch (n.props.type) {
            case 'artist':
              n.loadArtist();
              break;
            case 'album':
              n.loadAlbum();
          }
        }),
        (n.renderSectionHeader = function (e) {
          var t,
            a = e.section;
          if ((null === (t = a.data) || void 0 === t ? void 0 : t.length) > 0)
            return React.default.createElement(
              ReactNative.View,
              {
                style: {
                  padding: 10,
                },
              },
              React.default.createElement(
                _default,
                {
                  style: [v.text, v.sectionHeader],
                },
                a.key,
              ),
            );
        }),
        (n.unLogined = function () {
          toast(locales.default.NETEASE_NOT_LOGIN);
          n.props.navigation.navigate('NeteaseLogin');
        }),
        (n._renderIndexPath = function (e) {
          var t = e.row;
          return n._renderItem({
            item: n.state.data[t],
            index: t,
          });
        }),
        (n.searchSong = function (e) {
          var t,
            a = n.state.data;
          t = e ? n.filterList(e, a) : n.state.initData;
          n.setState({
            data: t,
          });
        }),
        (n.filterList = function (e, t) {
          var a = e.replace(/\?/gi, '\\?').replace(/\s/, ''),
            n = new RegExp(a, 'gi');
          return (
            t.filter(function (e) {
              return e.name.match(n);
            }) || t
          );
        }),
        (n.loadArtist = async function () {
          const response = await services.Netease.sublist_artist({
            offset: 0,
          });
          if (response?.code === 200)
            n.setState({
              data: response.data,
              initData: response.data,
            });
          else if (response?.code === 301) n.unLogined();
          else throw new Error(response?.message || locales.default.ERROR);
        }),
        (n.loadAlbum = async function () {
          const response = await services.Netease.sublist_album({
            offset: 0,
          });
          if (response?.code === 200)
            n.setState({
              data: response.data,
              initData: response.data,
            });
        }),
        (n.getMore = function () {
          n.setState(
            {
              offset: n.state.offset + 1,
            },
            function () {
              var e = n.state.offset;
              switch (n.props.type) {
                case 'artist':
                  n.loadArtistMore(1e3 * e);
                  break;
                case 'album':
                  n.loadAlbumMore(30 * e);
              }
            },
          );
        }),
        (n.loadArtistMore = async function (offset) {
          try {
            const response = await services.Netease.sublist_artist({
              offset,
            });
            if (response?.code === 200) {
              n.setState((previous) => ({
                data: [...previous.data, ...response.data],
              }));
              n._artistList?.endLoading?.(!response.data.length);
            }
          } catch (error) {
            n._artistList?.endLoading?.();
            toast(error.message);
          }
        }),
        (n.loadAlbumMore = async function (offset) {
          try {
            const response = await services.Netease.sublist_album({
              offset,
            });
            if (response?.code === 200) {
              n.setState((previous) => ({
                data: [...previous.data, ...response.data],
              }));
              n._albumList?.endLoading?.(!response.data.length);
            }
          } catch (error) {
            n._albumList?.endLoading?.();
            toast(error.message);
          }
        }),
        (n.formatData = function (e) {
          var t = n.props.type,
            a = {},
            r = null === e || void 0 === e ? void 0 : e.artists;
          switch (t) {
            case 'artist':
              a.title = e.name;
              a.subtitle = e.albumSize ? e.albumSize + ' ' + locales.default.ALBUM_COUNT : null;
              a.img = e.img1v1Url
                ? e.img1v1Url + '?param=200y200'
                : 'http://y.gtimg.cn/music/photo_new/T001R150x150M000' + e.mid + '.jpg';
              break;
            case 'album':
              a.title = e.name || e.albumname;
              a.subtitle = r
                ? e.artists[0].name + '  |  ' + e.size + ' ' + locales.default.SONG_COUNT
                : e.singername + '  |  ' + e.songnum;
              a.img = e.picUrl ? e.picUrl + '?param=200y200' : e.pic;
          }
          return a;
        }),
        (n._renderItem = function (e) {
          var t = e.item,
            a = n.formatData(t);
          return React.default.createElement(components.ListItem, {
            title: a.title,
            subtitle: a.subtitle,
            img: a.img,
            onPress: function () {
              return n.onPress(t);
            },
          });
        }),
        (n.onPress = function (e) {
          var t = n.props.type,
            a = providers.default.netEase;
          switch (t) {
            case 'artist':
              n.props.onArtist(e, a);
              break;
            case 'album':
              n.props.onAlbum(e, a);
          }
        }),
        a
      );
    }
    componentDidUpdate(e) {
      this.props.searchText !== e.searchText && this.searchSong(this.props.searchText);
    }
    componentDidMount() {
      var e = this;
      this.sub = ReactNative.DeviceEventEmitter.addListener(names.default.UserLogined, function () {
        e.loadData();
      });
      this.loadData();
    }
    componentWillUnmount() {
      var e, t;
      null === (e = (t = this.sub).remove) || void 0 === e || e.call(t);
    }
    render() {
      var e = this,
        t = this.state.data;
      return !t || t.length < 1
        ? React.default.createElement(components.Spinkit, null)
        : t
          ? React.default.createElement(reactNativeLargelist.LargeList, {
              ref: function (t) {
                return (e['_' + e.props.type + 'List'] = t);
              },
              data: [
                {
                  items: t,
                },
              ],
              heightForIndexPath: function () {
                return constants.ITEM_HEIGHT;
              },
              renderIndexPath: this._renderIndexPath,
              onLoading: this.getMore,
              loadingFooter: ParallaxList.default,
            })
          : null;
    }
  };
exports.default = h;
var v = ReactNative.StyleSheet.create({
  sectionHeader: {
    borderRadius: 5,
    fontSize: 14,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 14,
    padding: 5,
  },
});
