const _interopRequireWildcard = require('@babel/runtime/helpers/interopRequireWildcard');
const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');
const _extends = require('@babel/runtime/helpers/extends');
Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;
var React = _interopRequireWildcard(require('react')),
  ReactNative = require('react-native'),
  FadingEdge = _interopRequireDefault(require('../components/FadingEdge')),
  reactNativeLargelist = require('./../components/Scrolling.js'),
  components = require('../components/index'),
  constants = require('../theme/constants'),
  names = _interopRequireDefault(require('../events/names')),
  icons = _interopRequireDefault(require('../theme/icons')),
  tabIcons = _interopRequireDefault(require('../theme/tabIcons')),
  locales = _interopRequireDefault(require('../locales/index')),
  events = require('../events/index'),
  utils = require('../utils/index'),
  b = (require('../utils/types'), require('../services/trackInfo')),
  x = {
    normal: 'normal',
    deleting: 'deleting',
    filtering: 'filtering',
  },
  y = class t extends React.PureComponent {
    constructor() {
      var e, n, a;
      for (var r = arguments.length, o = new Array(r), i = 0; i < r; i++) o[i] = arguments[i];
      return (
        (n = a = super(...o)),
        (a.state = {
          filterText: '',
          filterList: [],
          mode: x.normal,
        }),
        (a.handledBack = function () {
          return (
            a.state.mode !== x.normal &&
            (a.setState({
              mode: x.normal,
            }),
            true)
          );
        }),
        (a.onClose = function () {
          a.handledBack() || a.forceClose();
        }),
        (a.forceClose = function () {
          var e = a.props,
            t = e.setDisplayNowPlaying;
          false !== e.show &&
            (t(false),
            a.setState({
              filterText: '',
              filterList: [],
              mode: x.normal,
            }));
        }),
        (a.onSubmitEditing = function () {
          var e = a.state.filterText,
            t = a.props.data;
          if (e.length > 0) {
            var n = utils.filterHelper.quickSearch(t, e);
            a.setState({
              filterList: n,
            });
          } else
            a.setState({
              filterList: [],
            });
        }),
        (a.onChangeText = function (e) {
          a.onSubmitEditing();
          a.setState({
            filterText: e,
          });
        }),
        (a.changePlaylist = function () {
          events.emitter.emit(names.default.ChangePlaylist);
        }),
        (a.onMode = function (e) {
          a.setState({
            mode: e,
          });
        }),
        (a.renderTools = function () {
          switch (a.state.mode) {
            case x.normal:
              return React.default.createElement(
                React.default.Fragment,
                null,
                React.default.createElement(components.Icon, {
                  name: icons.default.MAGNIFY,
                  onPress: function () {
                    return a.onMode(x.filtering);
                  },
                }),
                React.default.createElement(components.Icon, {
                  name: tabIcons.default.DISC.name,
                  onPress: a.changePlaylist,
                }),
                React.default.createElement(components.Icon, {
                  name: icons.default.DELETE_OUTLINE,
                  onPress: function () {
                    return a.onMode(x.deleting);
                  },
                  containerStyle: {
                    marginRight: 3,
                  },
                }),
              );
            case x.deleting:
              return React.default.createElement(
                React.default.Fragment,
                null,
                React.default.createElement(components.Icon, {
                  name: icons.default.ARROW_LEFT,
                  onPress: function () {
                    return a.onMode(x.normal);
                  },
                }),
                React.default.createElement(components.Icon, {
                  name: icons.default.NOTIFICATION_CLEAR_ALL,
                  onPress: a.onClear,
                  containerStyle: {
                    marginRight: 3,
                  },
                }),
              );
            case x.filtering:
              return React.default.createElement(
                React.default.Fragment,
                null,
                React.default.createElement(components.Icon, {
                  name: icons.default.ARROW_LEFT,
                  onPress: function () {
                    return a.onMode(x.normal);
                  },
                  style: {
                    paddding: 5,
                  },
                }),
                React.default.createElement(components.Input, {
                  autoFocus: true,
                  style: E.textInput,
                  onChangeText: a.onChangeText,
                  onSubmitEditing: a.onSubmitEditing,
                  placeholder: locales.default.FILTER,
                }),
              );
          }
        }),
        (a.onClear = function () {
          (0, events.toPlayer)({
            type: 'clearPlayingList',
          });
          a.forceClose();
        }),
        (a._renderIndexPath = function (e) {
          var t = e.row,
            n = a.state.filterList;
          if (0 !== a.props.data.length) {
            var r = a.props.data,
              l = true;
            n.length > 0 && ((r = n), (l = false));
            return a.renderItem({
              item: r[t],
              index: t,
              showPlaying: l,
            });
          }
        }),
        (a.onCover = function () {
          var e = a.props.songItem,
            t = (0, b.extractFullInfo)(e, 'big');
          events.emitter.emit(names.default.SavePicModal, {
            img: t.img,
            song: e.name,
          });
        }),
        (a.scrollTo = function () {
          var e,
            t,
            n = a.props.index;
          null === (e = a._list) ||
            void 0 === e ||
            null === (t = e.scrollToIndexPath) ||
            void 0 === t ||
            t.call(e, {
              section: 0,
              row: n,
            });
        }),
        (a.renderItem = function (e) {
          var t = e.item,
            n = e.index,
            r = e.showPlaying,
            o = (0, b.extractFullInfo)(t),
            i = a.getSongRowExtra(t, n),
            u = a.props.api;
          return React.default.createElement(
            components.SongRow,
            _extends(
              {
                song: o.song,
                singer: o.singer,
                album: o.album,
                index: n,
                playing: r && a.props.index === n,
                onPress: function () {
                  return a.playFiltedMusic(t, n, u, t.api);
                },
                addToQueue: function () {
                  return a.addToQueue(t, null, false);
                },
                alias: o.alias,
              },
              i,
            ),
          );
        }),
        (a.getSongRowExtra = function (e, t) {
          var n = a.props.api;
          return a.state.mode === x.deleting
            ? {
                deleteBtn: function () {
                  return a.deleteFromQueue(e, t);
                },
              }
            : {
                detail: function () {
                  return (0, events.toDetailModal)({
                    item: e,
                    index: t,
                    api: n,
                  });
                },
              };
        }),
        (a.playFiltedMusic = function (e, t, n, r) {
          var l = a.props.data,
            o = l.findIndex(function (t) {
              return (0, b.extractFullInfo)(e).song === (0, b.extractFullInfo)(t).song;
            }),
            i = n;
          r && r !== n && (i = n);
          (0, events.toPlayer)({
            item: e,
            data: l,
            index: o,
            api: i,
          });
        }),
        (a.deleteFromQueue = function (e, t) {
          var n = a.props,
            r = n.api;
          n.index !== t &&
            (a.refreshList(e, 'delete'),
            events.emitter.emit(names.default.DeleteFromQueue, {
              item: e,
              api: r,
            }));
        }),
        (a.addToQueue = function (e, t) {
          var n = a.props,
            r = n.api;
          n.index !== t &&
            (a.refreshList(e, 'add'),
            (0, events.toInsertToList)({
              data: e,
              api: r,
            }));
        }),
        (a.refreshList = function (e, t) {
          var n = null;
          switch (t) {
            case 'add':
              (n = a.props.data.filter(function (t) {
                return (0, b.extractFullInfo)(t).song !== (0, b.extractFullInfo)(e).song;
              })).splice(a.props.index + 1, 0, e);
              break;
            case 'delete':
              n = a.props.data.filter(function (t) {
                return (0, b.extractFullInfo)(t).song !== (0, b.extractFullInfo)(e).song;
              });
          }
          a.setState({
            data: n,
          });
        }),
        (a.playMusic = function (e, t, n) {
          var r = a.props.data;
          (0, events.toPlayer)({
            item: e,
            data: r,
            index: t,
            api: n,
          });
        }),
        n
      );
    }
    componentDidMount() {
      var e = this;
      this.sub = events.emitter.addListener(names.default.NowPlayingModal, function (t) {
        true === t.forceClose && e.forceClose();
      });
    }
    componentWillUnmount() {
      var e, t;
      null === (e = (t = this.sub).remove) || void 0 === e || e.call(t);
    }
    render() {
      var e = this,
        t = this.props,
        n = t.show,
        a = t.songItem,
        r = t.data,
        c = t.isRound,
        f = this.state,
        m = f.filterList,
        p = f.filterText;
      if (!a) return null;
      var g = (0, b.extractFullInfo)(a, 'big'),
        h = p.length > 0;
      return React.default.createElement(
        ReactNative.Modal,
        {
          animationType: 'fade',
          transparent: true,
          onRequestClose: this.onClose,
          visible: n,
        },
        React.default.createElement(
          ReactNative.View,
          {
            style: [
              E.container,
              {
                backgroundColor: '#000',
              },
            ],
          },
          g &&
            React.default.createElement(components.Background, {
              imageStyle: {
                opacity: 0.5,
              },
              coverUrl: g.img,
              blur: true,
            }),
          React.default.createElement(
            ReactNative.TouchableWithoutFeedback,
            {
              onPress: this.forceClose,
            },
            React.default.createElement(ReactNative.View, {
              style: {
                width: '100%',
                height: '35%',
                position: 'absolute',
              },
            }),
          ),
          g &&
            React.default.createElement(
              ReactNative.View,
              {
                style: E.title,
              },
              React.default.createElement(
                ReactNative.TouchableOpacity,
                {
                  onPress: this.onCover,
                },
                React.default.createElement(ReactNative.Image, {
                  source: {
                    uri: g.img,
                  },
                  style: {
                    height: 150,
                    width: 150,
                    borderRadius: c ? 75 : 5,
                  },
                }),
              ),
              React.default.createElement(
                ReactNative.TouchableOpacity,
                {
                  onPress: function () {
                    return e.scrollTo();
                  },
                  style: {
                    alignItems: 'center',
                  },
                },
                React.default.createElement(
                  components.Selectable,
                  {
                    numberOfLines: 3,
                    style: [
                      E.text,
                      {
                        fontSize: 18,
                        fontWeight: 'bold',
                        marginTop: 5,
                        textAlign: 'center',
                      },
                    ],
                  },
                  g.song,
                ),
                React.default.createElement(
                  components.Selectable,
                  {
                    style: [
                      E.text,
                      {
                        fontSize: 13,
                        textAlign: 'center',
                      },
                    ],
                  },
                  g.album,
                ),
              ),
            ),
          React.default.createElement(
            ReactNative.View,
            {
              style: E.btnsBar,
            },
            this.renderTools(),
          ),
          React.default.createElement(
            FadingEdge.default,
            {
              top: 30,
            },
            React.default.createElement(reactNativeLargelist.LargeList, {
              ref: function (t) {
                return (e._list = t);
              },
              data: [
                {
                  items: h ? m : r,
                },
              ],
              heightForIndexPath: function () {
                return constants.ITEM_HEIGHT;
              },
              renderIndexPath: this._renderIndexPath,
              renderEmpty: function () {
                return React.default.createElement(components.Spinkit, null);
              },
            }),
          ),
        ),
      );
    }
  },
  E = ReactNative.StyleSheet.create({
    container: {
      flex: 1,
    },
    text: {
      fontSize: 15,
    },
    title: {
      marginTop: '15%',
      alignItems: 'center',
    },
    btnsBar: {
      height: 40,
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
      paddingHorizontal: 15,
      marginTop: 15,
      marginBottom: 10,
    },
    textInput: {
      height: '100%',
      width: '100%',
      fontSize: 16,
    },
  }),
  I = y;
exports.default = I;
