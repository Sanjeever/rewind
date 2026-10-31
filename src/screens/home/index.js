const _default = require('./../../components/Pager.js').default;
const _interopRequireWildcard = require('@babel/runtime/helpers/interopRequireWildcard');
const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');
const _appStorage = require('./../../storage/index.js');
Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;
var immer = require('immer'),
  React = _interopRequireWildcard(require('react')),
  ReactNative = require('react-native'),
  FadingEdge = _interopRequireDefault(require('../../components/FadingEdge')),
  components = require('../../components/index'),
  providers = _interopRequireDefault(require('../../services/providers')),
  defaults = require('../../settings/defaults'),
  constants = require('../../theme/constants'),
  names = _interopRequireDefault(require('../../events/names')),
  pagesModule = _interopRequireDefault(require('../../settings/pages')),
  keysModule = _interopRequireDefault(require('../../storage/keys')),
  endpoints = require('../../services/endpoints'),
  services = require('../../services/index'),
  events = require('../../events/index'),
  utils = require('../../utils/index'),
  types = _interopRequireWildcard(require('../../utils/types')),
  playlists = _interopRequireDefault(require('../../storage/playlists')),
  users = _interopRequireDefault(require('../../storage/users')),
  Playlists = _interopRequireDefault(require('./Playlists')),
  PlaylistHeader = _interopRequireDefault(require('./PlaylistHeader')),
  P = class t extends React.PureComponent {
    constructor() {
      var e, a, r;
      for (var n = arguments.length, l = new Array(n), o = 0; o < n; o++) l[o] = arguments[o];
      return (
        (a = r = super(...l)),
        (r.showNetease = true),
        (r.showQQMusic = true),
        (r.state = {
          netEase: [],
          qqMusic: [],
          showList: true,
          isConnected: true,
          userId: 0,
          autoSetPlaylistOrder: defaults.defaultSettings.autoSetPlaylistOrder.on,
          pagesOrder: pagesModule.default.pages,
          apisOrder: pagesModule.default.apis,
        }),
        (r.dailySignin = async function () {
          try {
            return await services.Netease.daily_signin();
          } catch (error) {
            log('签到失败', error.message);
          }
        }),
        (r.happyBirthday = async function () {
          const id = (await users.default.getUserInfo())?.netEase?.userId;
          if (!id) return;
          const response = await services.Netease.profile(id);
          if (response?.code === 200 && utils.timeFormatter.isToday(response.profile.birthday))
            r.props.navigation.navigate('HappyBirthday', {
              profile: response.profile,
            });
        }),
        (r.loadOrder = function () {
          _appStorage.storage
            .load({
              key: keysModule.default.pagesOrder,
            })
            .then(function (e) {
              e &&
                r.setState({
                  pagesOrder: e,
                });
            })
            .catch(function () {
              return null;
            });
          _appStorage.storage
            .load({
              key: keysModule.default.apisOrder,
            })
            .then(function (e) {
              e &&
                r.setState({
                  apisOrder: e,
                });
            })
            .catch(function () {
              return null;
            });
        }),
        (r.alertOpenTip = function () {
          ReactNative.Alert.alert('首次启动', '需要查看操作指南吗？', [
            {
              text: '不用了',
              onPress: function () {
                return null;
              },
              style: 'cancel',
            },
            {
              text: '应用内查看',
              onPress: function () {
                return r.props.navigation.navigate('Tip');
              },
            },
            {
              text: '用浏览器打开',
              onPress: function () {
                return ReactNative.Linking.openURL(endpoints.HOST_PAGE + '/tutorial');
              },
            },
          ]);
        }),
        (r.isValid = function (e, t) {
          return e && e[t] && types.isObject(e[t]);
        }),
        (r.loadStorage = async function () {
          const stored = await users.default.getUserPlayList();
          if (stored) {
            if (r.isValid(stored, providers.default.netEase))
              r.setState({
                netEase: stored.netEase,
              });
            if (r.isValid(stored, providers.default.qqMusic))
              r.setState({
                qqMusic: stored.qqMusic,
              });
          } else await r.loadPlaylistById();
        }),
        (r.loadPlaylistById = async function (api, list) {
          try {
            if (r.state.isConnected !== true) return;
            const accounts = await users.default.getUserInfo();
            if (!accounts) return;
            if (api) await r['loadPlaylist_' + api](accounts);
            else {
              await r.loadPlaylist_netEase(accounts);
              await r.loadPlaylist_qqMusic(accounts);
            }
          } catch (error) {
            toast('歌单加载失败：' + error.message);
          } finally {
            list?.endRefresh?.();
          }
        }),
        (r.loadPlaylist_netEase = async function (accounts) {
          const id = accounts?.netEase?.userId;
          if (!id) return;
          r.setState({
            userId: id,
          });
          await r.getNeteasePlaylist(id);
          await r.netEaselikelist(id);
        }),
        (r.loadPlaylist_qqMusic = async function (accounts) {
          const id = accounts?.qqMusic?.userId;
          if (!id) return;
          await r.getQQMusicPlaylist(id);
          await r.qqMusicLikelist();
        }),
        (r.setDefaultState = function () {
          r.setState({
            netEase: [],
            qqMusic: [],
            showList: true,
            isConnected: true,
            userId: 0,
          });
        }),
        (r.netEaseRefreshLogin = async function () {
          if (r.state.isConnected === true) {
            try {
              return await services.Netease.login_refresh();
            } catch (error) {
              log('刷新登录失败', error.message);
            }
          }
        }),
        (r.netEaselikelist = async function (id) {
          if (!id) return;
          const response = await services.Netease.likelist(id);
          if (response?.code === 200)
            await users.default.saveUserLikeList(response.ids, providers.default.netEase);
        }),
        (r.qqMusicLikelist = function () {
          _appStorage.storage
            .load({
              key: keysModule.default.playlist,
            })
            .then(function (e) {
              if (e.qqMusic) {
                var t = (0, utils.delve)(e, 'qqMusic.0.id');
                services.QQMusic.disslist({
                  id: t,
                }).then(function (e) {
                  if (types.isArray(e) && !(e.length < 1)) {
                    var t = [];
                    e[0].songlist.map(function (e) {
                      t.push(e.songmid);
                    });
                    users.default.saveUserLikeList(t, providers.default.qqMusic);
                  }
                });
              }
            })
            .catch(function (e) {
              return e;
            });
        }),
        (r.getQQMusicPlaylist = async function (id) {
          if (!id) return;
          const profile = await services.QQMusic.profile(id);
          if (!profile?.mymusic) throw new Error(locales.default.PLAYLIST_FETCH_FAILED);
          const created = await services.QQMusic.user_created_list(id);
          const liked = profile.mymusic.find(
            (item) => item.title === '喜欢' || item.title === '我喜欢',
          );
          const items = [...(liked ? [liked] : []), ...profile.mydiss.list, ...created];
          const ordered = await playlists.default.newOrder({
            api: providers.default.qqMusic,
            newArr: items,
            on: r.state.autoSetPlaylistOrder,
          });
          await users.default.saveUserPlayList(ordered, providers.default.qqMusic);
          r.setState({
            qqMusic: ordered,
          });
        }),
        (r.getNeteasePlaylist = async function (id) {
          if (!id) return;
          const response = await services.Netease.user_playlist(id);
          if (!Array.isArray(response?.playlist))
            throw new Error(response?.message || locales.default.PLAYLIST_FETCH_FAILED);
          const ordered = await playlists.default.newOrder({
            api: providers.default.netEase,
            newArr: response.playlist,
            on: r.state.autoSetPlaylistOrder,
          });
          await users.default.saveUserPlayList(ordered, providers.default.netEase);
          r.setState({
            netEase: ordered,
          });
        }),
        (r.Playlist = function (e, t, a) {
          var n = r.state.userId;
          switch (t) {
            case providers.default.netEase:
              r.props.navigation.navigate('Playlist', {
                playlist: e,
                userId: n,
                api: providers.default.netEase,
                index: a,
                subscribed: true,
              });
              break;
            case providers.default.qqMusic:
              r.props.navigation.navigate('Playlist', {
                playlist: e,
                api: providers.default.qqMusic,
                index: a,
                subscribed: true,
              });
              break;
            case providers.default.local:
              r.props.navigation.navigate('CustomPlaylist', {
                playlist: e,
                index: a,
              });
          }
        }),
        (r.collectPlaylistOrder = async function ({api, index}) {
          try {
            const result = await playlists.default.collect({
              playlist: {
                netEase: r.state.netEase,
                qqMusic: r.state.qqMusic,
              },
              api,
              index,
            });
            if (result)
              r.setState({
                [api]: result,
              });
          } catch (error) {
            toast('保存歌单顺序失败：' + error.message);
          }
        }),
        (r.renderPager = function () {
          var e = r.state.pagesOrder;
          return (0, utils.groupedArray)(e, 4).map(function (e, t) {
            return React.default.createElement(
              ReactNative.View,
              {
                style: M.compCon,
                key: t,
              },
              e.map(function (e, t) {
                return React.default.createElement(PlaylistHeader.default, {
                  icon: e.icon,
                  key: t,
                  onPress: function () {
                    return r.goToPage(e.page);
                  },
                });
              }),
            );
          });
        }),
        (r.renderHeader = function () {
          return React.default.createElement(
            _default,
            {
              initialPage: 0,
              style: {
                height: 100,
                width: '100%',
              },
            },
            r.renderPager(),
          );
        }),
        (r.goToPage = function (e) {
          switch (e) {
            case 'localMusic':
              r.props.navigation.navigate('LocalMusic');
              break;
            case 'history':
              r.props.navigation.navigate('MusicHistory');
              break;
            case 'recommend':
              r.props.navigation.navigate('MusicRecommend');
              break;
            case 'radio':
              r.props.navigation.navigate('Radio');
              break;
            case 'privateFM':
              events.emitter.emit(names.default.FM_MODE);
              break;
            case 'charts':
              r.props.navigation.navigate('Charts');
              break;
            case 'favs':
              r.props.navigation.navigate('Favs');
              break;
            case 'hotPlaylist':
              r.props.navigation.navigate('HotPlaylist');
              break;
            case 'subNewSongs':
              r.props.navigation.navigate('SubNewSongs');
          }
        }),
        a
      );
    }
    UNSAFE_componentWillMount() {
      var e = this;
      utils.firstTimeChecker.check().then(function (t) {
        true === t && e.alertOpenTip();
      });
    }
    componentDidMount() {
      var e = this;
      require('@react-native-community/netinfo')
        .default.fetch()
        .then(function (network) {
          var t = network.isConnected;
          e.setState(
            {
              isConnected: t,
            },
            function () {
              e.loadStorage();
              e.loadPlaylistById();
              e.dailySignin();
            },
          );
        });
      this.loginedListener = events.emitter.addListener(names.default.UserLogined, function () {
        setTimeout(function () {
          e.loadStorage();
          e.loadPlaylistById();
        }, 500);
      });
      this.playlistSetOrderListener = events.emitter.addListener(
        names.default.PlaylistSetOrder,
        function (t) {
          var a = t.index,
            r = t.api;
          true === e.state.autoSetPlaylistOrder &&
            e.collectPlaylistOrder({
              index: a,
              api: r,
            });
        },
      );
      this.setStateListener = events.emitter.addListener(names.default.SetHomeState, function (t) {
        e.setState(
          (0, immer.produce)(function (e) {
            Object.keys(t).forEach(function (a) {
              e[a] = t[a];
            });
          }),
        );
      });
      this.loadOrder();
      this.happyBirthday();
      this.netEaseRefreshLogin();
    }
    componentWillUnmount() {
      this.loginedListener.remove();
      this.playlistSetOrderListener.remove();
      this.setStateListener.remove();
    }
    render() {
      var e = this.state,
        t = e.netEase,
        a = e.qqMusic,
        r = e.apisOrder;
      return React.default.createElement(
        ReactNative.View,
        {
          style: M.container,
        },
        React.default.createElement(components.Background, null),
        this.renderHeader(),
        React.default.createElement(
          FadingEdge.default,
          {
            top: 30,
          },
          React.default.createElement(Playlists.default, {
            apisOrder: r,
            navigation: this.props.navigation,
            netEase: t,
            qqMusic: a,
            Playlist: this.Playlist,
            onRefresh: this.loadPlaylistById,
          }),
        ),
      );
    }
  };
exports.default = P;
var M = ReactNative.StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: constants.STATUS_BAR_HEIGHT + 40,
  },
  compCon: {
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});
