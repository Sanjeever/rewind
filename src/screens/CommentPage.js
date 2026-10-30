Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  reactNativeSpringScrollview = require("react-native-spring-scrollview"),
  components = require("../components/index"),
  module821 = babelHelpers.interopRequireDefault(require("../modules/module-821")),
  providers = babelHelpers.interopRequireDefault(require("../services/providers")),
  icons = babelHelpers.interopRequireDefault(require("../theme/icons")),
  locales = babelHelpers.interopRequireDefault(require("../locales/index")),
  services = require("../services/index"),
  utils = require("../utils/index"),
  trackInfo = require("../services/trackInfo"),
  module823 = babelHelpers.interopRequireDefault(require("../modules/module-823")),
  module824 = babelHelpers.interopRequireDefault(require("../modules/module-824")),
  module825 = require("../modules/module-825"),
  module826 = babelHelpers.interopRequireDefault(require("../modules/module-826")),
  w = function (e) {
    return e;
  },
  x = function (e) {
    function t(e) {
      var n;
      babelHelpers.classCallCheck(this, t);
      (n = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(t).call(this, e))).init = function () {
        var e = n.props.navigation.state.params;
        if (e) {
          var t = e.api,
            a = e.song;
          t && (n.setState({
            api: t,
            song: (0, trackInfo.extractFullInfo)(a)
          }), n.getComment(a, t));
        }
      };
      n.getComment = function (e, t) {
        switch (t) {
          case providers.default.netEase:
            var a = e.rid || e.id,
              o = !!e.rid;
            n.NeteaseComment({
              id: a,
              isRadio: o
            });
            break;
          case providers.default.qqMusic:
            var r = e.id || e.songid;
            n.QQMusicCommnet(r);
        }
      };
      n.QQMusicCommnet = function (e) {
        services.QQMusic.song_comments({
          songid: e
        }).then(function (t) {
          var a = t.comment,
            o = t.hot_comment,
            r = a.commentlist,
            s = a.commenttotal,
            i = [];
          o.commenttotal > 0 && (i = o.commentlist);
          s > 0 && n.setState({
            data: r,
            loaded: true,
            total: s,
            hotComments: i,
            title: w(s),
            id: e
          });
        });
      };
      n.NeteaseComment = function (e) {
        var t, a, o, r, s, i, l, u, d, c, m;
        return regeneratorRuntime.async(function (p) {
          for (;;) switch (p.prev = p.next) {
            case 0:
              if (t = e.id, a = e.offset, o = void 0 === a ? 0 : a, r = e.isRadio, !(s = void 0 !== r && r)) {
                p.next = 7;
                break;
              }
              p.next = 4;
              return regeneratorRuntime.awrap(services.Netease.comment_radio({
                id: t,
                offset: o
              }));
            case 4:
              i = p.sent;
              p.next = 10;
              break;
            case 7:
              p.next = 9;
              return regeneratorRuntime.awrap(services.Netease.comment({
                id: t,
                offset: o
              }));
            case 9:
              i = p.sent;
            case 10:
              if (!i) {
                p.next = 16;
                break;
              }
              if (u = (l = i).comments, d = l.hotComments, c = l.total, u && !(u.length < 1)) {
                p.next = 14;
                break;
              }
              return p.abrupt("return");
            case 14:
              m = !d || d.length < 1 ? u.slice(0, 15) : d;
              u && n.setState({
                data: u,
                loaded: true,
                total: c,
                hotComments: s ? [] : m,
                title: w(c),
                id: t,
                isRadio: s
              });
            case 16:
            case "end":
              return p.stop();
          }
        }, null, this);
      };
      n.getCommentKeywords = function (e) {
        if (e.length < 1) n.setState({
          loadWordsCloudDone: true
        });else {
          var t = '';
          e.forEach(function (e) {
            var n = e.content || e.rootcommentcontent;
            if (n) {
              var a = n.replace(/\s/gi, '');
              t += '' + a;
            }
          });
          n.getKeyWords((0, utils.emojiStrip)(t));
        }
      };
      n.getKeyWords = function (e) {
        var t, a, o, r;
        return regeneratorRuntime.async(function (s) {
          for (;;) switch (s.prev = s.next) {
            case 0:
              if (e) {
                s.next = 2;
                break;
              }
              return s.abrupt("return");
            case 2:
              a = e.slice(500);
              o = e.slice(0, 500);
              s.next = 6;
              return regeneratorRuntime.awrap(module823.default.nlp(o));
            case 6:
              r = s.sent;
              (null === (t = r) || void 0 === t ? void 0 : t.length) > 0 && (r = Array.from(new Set(r)), n.setState({
                wordscloud: babelHelpers.toConsumableArray(n.state.wordscloud).concat(babelHelpers.toConsumableArray(r))
              }));
              a.length > 0 ? n.getKeyWords(a) : n.setState({
                loadWordsCloudDone: true
              });
            case 9:
            case "end":
              return s.stop();
          }
        }, null, this);
      };
      n.renderTextInput = function () {
        var e = n.state.text;
        return React.default.createElement(ReactNative.View, {
          style: {
            flex: 1,
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: 10
          }
        }, React.default.createElement(components.Input, {
          maxLength: 140,
          style: {
            width: '80%',
            fontSize: 15,
            paddingHorizontal: 10
          },
          placeholder: locales.default.COMMENT,
          onChangeText: n.textInputChange,
          onSubmitEditing: n.addComment,
          defaultValue: e
        }), n.state.api === providers.default.netEase && React.default.createElement(components.Icon, {
          name: icons.default.WEB,
          onPress: n.toWebView,
          size: 20,
          style: {
            marginRight: 12
          }
        }), React.default.createElement(components.Icon, {
          name: icons.default.COMMENT_PLUS_OUTLINE,
          onPress: n.addComment,
          size: 20
        }));
      };
      n.toWebView = function () {
        var e = n.state.song;
        if (e) {
          var t = "https://music.163.com/#/song?id=" + e.uid;
          n.props.navigation.navigate('WebViewPage', {
            url: t
          });
        }
      };
      n.renderHeader = function () {
        var e = n.state,
          t = e.hotComments,
          a = e.total,
          o = e.song,
          i = e.api;
        return 0 === a ? null : React.default.createElement(ReactNative.View, {
          style: {
            flex: 1
          }
        }, o && React.default.createElement(components.SongRow, {
          song: o.song,
          album: '\u7a7a' === o.album ? '' : o.album,
          singer: o.singer,
          img: o.img,
          containerStyle: {
            height: 70
          }
        }), n.renderTextInput(), t.length > 0 && React.default.createElement(components.Title, {
          style: E.section
        }, "\u70ed\u95e8\u8bc4\u8bba ", t.length), t.map(function (e, t) {
          var a = (0, module825.getFormattedItem)(e, i);
          return React.default.createElement(module824.default, {
            key: t,
            content: a.content,
            userAvatar: a.userAvatar,
            userName: a.userName,
            time: a.time,
            onUserInfo: function () {
              return n.onUserInfo(e);
            }
          });
        }), React.default.createElement(components.Title, {
          style: [E.section, {
            marginTop: 20
          }]
        }, "\u6240\u6709\u8bc4\u8bba ", a));
      };
      n.textInputChange = function (e) {
        n.setState({
          text: e
        });
      };
      n.addComment = function () {
        var e = n.state,
          t = e.text,
          a = e.api,
          o = e.id;
        if (t && o) {
          switch (ReactNative.Keyboard.dismiss(), a) {
            case providers.default.netEase:
              n.addNetease(t, o);
          }
          n.setState({
            text: ''
          });
        }
      };
      n.addNetease = function (e, t) {
        var a, o, r;
        return regeneratorRuntime.async(function (s) {
          for (;;) switch (s.prev = s.next) {
            case 0:
              s.next = 2;
              return regeneratorRuntime.awrap(services.Netease.comment_add({
                id: t,
                text: e
              }));
            case 2:
              a = s.sent;
              (0, utils.usable)(a) && (200 === a.code ? (n.setState({
                hotComments: []
              }), n.refs.list.scrollToOffset({
                offset: 0
              }), o = n.state.data, (r = a.comment).beReplied = [], r.liked = false, r.likedCount = 0, o.splice(0, 0, r), n.setState({
                data: o
              }), toast(locales.default.COMMENT_SUCCESS)) : toast(locales.default.NETEASE_NOT_LOGIN));
            case 4:
            case "end":
              return s.stop();
          }
        }, null, this);
      };
      n.onWordsCloud = function () {
        var e = n.state,
          t = e.hotComments;
        e.loadWordsCloudDone || n.getCommentKeywords(t);
        n.setState({
          showWordscloud: true
        });
      };
      n.onTop = function () {
        var e, t;
        null === (e = (t = n._scrollView).scrollToBegin) || void 0 === e || e.call(t);
      };
      n.NeteaseMore = function (e) {
        var t,
          a,
          o,
          r,
          s,
          i = arguments;
        return regeneratorRuntime.async(function (l) {
          for (;;) switch (l.prev = l.next) {
            case 0:
              if (t = i.length > 1 && void 0 !== i[1] ? i[1] : 0, !n.state.isRadio) {
                l.next = 8;
                break;
              }
              l.next = 5;
              return regeneratorRuntime.awrap(services.Netease.comment_radio({
                id: e,
                offset: t
              }));
            case 5:
              a = l.sent;
              l.next = 11;
              break;
            case 8:
              l.next = 10;
              return regeneratorRuntime.awrap(services.Netease.comment({
                id: e,
                offset: t
              }));
            case 10:
              a = l.sent;
            case 11:
              a && (o = a.comments) && (n.setState({
                data: babelHelpers.toConsumableArray(n.state.data).concat(babelHelpers.toConsumableArray(o))
              }), null === (r = (s = n._scrollView).endLoading) || void 0 === r || r.call(s));
            case 12:
            case "end":
              return l.stop();
          }
        }, null, this);
      };
      n.QQMusicMore = function (e, t) {
        services.QQMusic.song_comments({
          songid: e,
          pagenum: t
        }).then(function (e) {
          var t,
            a,
            o = e.comment,
            r = o.commentlist;
          o.commenttotal > 0 && (n.setState({
            data: babelHelpers.toConsumableArray(n.state.data).concat(babelHelpers.toConsumableArray(r))
          }), null === (t = (a = n._scrollView).endLoading) || void 0 === t || t.call(a));
        });
      };
      n.getMoreComment = function () {
        var e = n.state,
          t = e.api,
          a = e.id,
          o = e.offset;
        if (a) switch (t) {
          case providers.default.netEase:
            n.NeteaseMore(a, 30 * o);
            break;
          case providers.default.qqMusic:
            n.QQMusicMore(a, o);
        }
      };
      n.getMore = function () {
        n.setState({
          offset: n.state.offset + 1
        }, function () {
          n.getMoreComment();
        });
      };
      n._renderItem = function (e) {
        var t = e.item,
          a = e.index,
          o = (0, module825.getFormattedItem)(t, n.state.api);
        return React.default.createElement(module824.default, {
          key: a,
          content: o.content,
          userName: o.userName,
          time: o.time,
          userAvatar: o.userAvatar,
          beReplieds: o.beReplieds,
          likedCount: o.likedCount,
          item: t,
          onUserInfo: n.onUserInfo
        });
      };
      n.onUserInfo = function (e) {
        if (n.state.api === providers.default.netEase) {
          var t = e.user.userId;
          n.props.navigation.navigate('UserInfo', {
            userId: t
          });
        }
      };
      n.state = {
        title: '',
        data: [],
        loaded: false,
        api: providers.default.netEase,
        hotComments: [],
        total: 0,
        offset: 0,
        text: '',
        showWordscloud: false,
        wordscloud: [],
        loadWordsCloudDone: false,
        noHotComments: false,
        isRadio: false
      };
      return n;
    }
    babelHelpers.createClass(t, [{
      key: "componentDidMount",
      value: function () {
        this.init();
      }
    }, {
      key: "render",
      value: function () {
        var e = this,
          t = this.state,
          n = t.loaded,
          a = t.data,
          o = t.showWordscloud,
          d = t.wordscloud,
          m = t.hotComments,
          f = t.song,
          p = t.title,
          g = t.loadWordsCloudDone;
        return React.default.createElement(components.PageContainer, {
          title: p,
          goBack: this.props.navigation.goBack,
          onTop: this.onTop,
          backIcon: {
            name: icons.default.WINDOW_CLOSE
          },
          rightIcon: {
            name: icons.default.FIRE,
            onPress: this.onWordsCloud
          }
        }, false === n ? React.default.createElement(components.Spinkit, null) : React.default.createElement(reactNativeSpringScrollview.SpringScrollView, {
          ref: function (t) {
            return e._scrollView = t;
          },
          onLoading: this.getMore,
          loadingFooter: module821.default
        }, this.renderHeader(), a.map(function (t, n) {
          return e._renderItem({
            item: t,
            index: n
          });
        })), React.default.createElement(ReactNative.Modal, {
          visible: o,
          onRequestClose: function () {
            return e.setState({
              showWordscloud: false
            });
          },
          animationType: "fade"
        }, React.default.createElement(ReactNative.View, {
          style: {
            flex: 1,
            backgroundColor: '#100f14'
          }
        }, React.default.createElement(module826.default, {
          hotComments: m,
          wordscloud: d,
          song: f,
          onClose: function () {
            return e.setState({
              showWordscloud: false
            });
          },
          loadWordsCloudDone: g
        }))));
      }
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(React.PureComponent),
  E = ReactNative.StyleSheet.create({
    section: {
      paddingLeft: 20
    }
  }),
  y = x;
exports.default = y;
