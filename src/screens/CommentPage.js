const _interopRequireWildcard = require('@babel/runtime/helpers/interopRequireWildcard');
const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');
const _toConsumableArray = require('@babel/runtime/helpers/toConsumableArray');
Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;
var React = _interopRequireWildcard(require('react')),
  ReactNative = require('react-native'),
  reactNativeSpringScrollview = require('./../components/Scrolling.js'),
  components = require('../components/index'),
  ParallaxList = _interopRequireDefault(require('../components/ParallaxList')),
  providers = _interopRequireDefault(require('../services/providers')),
  icons = _interopRequireDefault(require('../theme/icons')),
  locales = _interopRequireDefault(require('../locales/index')),
  services = require('../services/index'),
  utils = require('../utils/index'),
  trackInfo = require('../services/trackInfo'),
  commentSegmentation = _interopRequireDefault(require('./../modules/commentSegmentation.js')),
  CommentCard = _interopRequireDefault(require('./../modules/CommentCard.js')),
  formatItem = require('./comments/formatItem'),
  CommentAnalysis = _interopRequireDefault(require('./../modules/CommentAnalysis.js')),
  w = function (e) {
    return e;
  },
  x = class t extends React.PureComponent {
    constructor(e) {
      var n;
      (n = super(e)).init = function () {
        var e = n.props.route.params;
        if (e) {
          var t = e.api,
            a = e.song;
          t &&
            (n.setState({
              api: t,
              song: (0, trackInfo.extractFullInfo)(a),
            }),
            n.getComment(a, t));
        }
      };
      n.getComment = function (e, t) {
        switch (t) {
          case providers.default.netEase:
            var a = e.rid || e.id,
              o = !!e.rid;
            n.NeteaseComment({
              id: a,
              isRadio: o,
            });
            break;
          case providers.default.qqMusic:
            var r = e.id || e.songid;
            n.QQMusicCommnet(r);
        }
      };
      n.QQMusicCommnet = function (e) {
        services.QQMusic.song_comments({
          songid: e,
        }).then(function (t) {
          var a = t.comment,
            o = t.hot_comment,
            r = a.commentlist,
            s = a.commenttotal,
            i = [];
          o.commenttotal > 0 && (i = o.commentlist);
          s > 0 &&
            n.setState({
              data: r,
              loaded: true,
              total: s,
              hotComments: i,
              title: w(s),
              id: e,
            });
        });
      };
      n.NeteaseComment = async function ({id, offset = 0, isRadio = false}) {
        try {
          const response = await (isRadio
            ? services.Netease.comment_radio({
                id,
                offset,
              })
            : services.Netease.comment({
                id,
                offset,
              }));
          if (!Array.isArray(response?.comments))
            throw new Error(response?.message || locales.default.ERROR);
          const {comments, hotComments, total} = response;
          n.setState({
            data: comments,
            loaded: true,
            total,
            hotComments: isRadio ? [] : hotComments?.length ? hotComments : comments.slice(0, 15),
            title: w(total),
            id,
            isRadio,
          });
        } catch (error) {
          n.setState({
            loaded: true,
          });
          toast(error.message);
        }
      };
      n.getCommentKeywords = function (e) {
        if (e.length < 1)
          n.setState({
            loadWordsCloudDone: true,
          });
        else {
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
      n.getKeyWords = async function (text) {
        if (!text) return;
        try {
          for (let offset = 0; offset < text.length; offset += 500) {
            const words = await commentSegmentation.default.nlp(text.slice(offset, offset + 500));
            if (words?.length)
              n.setState((previous) => ({
                wordscloud: [...previous.wordscloud, ...new Set(words)],
              }));
          }
        } catch (error) {
          toast(error.message);
        } finally {
          n.setState({
            loadWordsCloudDone: true,
          });
        }
      };
      n.renderTextInput = function () {
        var e = n.state.text;
        return React.default.createElement(
          ReactNative.View,
          {
            style: {
              flex: 1,
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              paddingLeft: 10,
            },
          },
          React.default.createElement(components.Input, {
            maxLength: 140,
            style: {
              width: '80%',
              fontSize: 15,
              paddingHorizontal: 10,
            },
            placeholder: locales.default.COMMENT,
            onChangeText: n.textInputChange,
            onSubmitEditing: n.addComment,
            defaultValue: e,
          }),
          n.state.api === providers.default.netEase &&
            React.default.createElement(components.Icon, {
              name: icons.default.WEB,
              onPress: n.toWebView,
              size: 20,
              style: {
                marginRight: 12,
              },
            }),
          React.default.createElement(components.Icon, {
            name: icons.default.COMMENT_PLUS_OUTLINE,
            onPress: n.addComment,
            size: 20,
          }),
        );
      };
      n.toWebView = function () {
        var e = n.state.song;
        if (e) {
          var t = 'https://music.163.com/#/song?id=' + e.uid;
          n.props.navigation.navigate('WebViewPage', {
            url: t,
          });
        }
      };
      n.renderHeader = function () {
        var e = n.state,
          t = e.hotComments,
          a = e.total,
          o = e.song,
          i = e.api;
        return 0 === a
          ? null
          : React.default.createElement(
              ReactNative.View,
              {
                style: {
                  flex: 1,
                },
              },
              o &&
                React.default.createElement(components.SongRow, {
                  song: o.song,
                  album: '\u7a7a' === o.album ? '' : o.album,
                  singer: o.singer,
                  img: o.img,
                  containerStyle: {
                    height: 70,
                  },
                }),
              n.renderTextInput(),
              t.length > 0 &&
                React.default.createElement(
                  components.Title,
                  {
                    style: E.section,
                  },
                  '\u70ed\u95e8\u8bc4\u8bba ',
                  t.length,
                ),
              t.map(function (e, t) {
                var a = (0, formatItem.getFormattedItem)(e, i);
                return React.default.createElement(CommentCard.default, {
                  key: t,
                  content: a.content,
                  userAvatar: a.userAvatar,
                  userName: a.userName,
                  time: a.time,
                  onUserInfo: function () {
                    return n.onUserInfo(e);
                  },
                });
              }),
              React.default.createElement(
                components.Title,
                {
                  style: [
                    E.section,
                    {
                      marginTop: 20,
                    },
                  ],
                },
                '\u6240\u6709\u8bc4\u8bba ',
                a,
              ),
            );
      };
      n.textInputChange = function (e) {
        n.setState({
          text: e,
        });
      };
      n.addComment = function () {
        var e = n.state,
          t = e.text,
          a = e.api,
          o = e.id;
        if (t && o) {
          switch ((ReactNative.Keyboard.dismiss(), a)) {
            case providers.default.netEase:
              n.addNetease(t, o);
          }
          n.setState({
            text: '',
          });
        }
      };
      n.addNetease = async function (text, id) {
        const response = await services.Netease.comment_add({
          id,
          text,
        });
        if (response?.code === 200) {
          const comment = {
            ...response.comment,
            beReplied: [],
            liked: false,
            likedCount: 0,
          };
          n.setState((previous) => ({
            hotComments: [],
            data: [comment, ...previous.data],
          }));
          n.list?.scrollToOffset({
            offset: 0,
          });
        } else toast(response?.message || locales.default.NETEASE_NOT_LOGIN);
      };
      n.onWordsCloud = function () {
        var e = n.state,
          t = e.hotComments;
        e.loadWordsCloudDone || n.getCommentKeywords(t);
        n.setState({
          showWordscloud: true,
        });
      };
      n.onTop = function () {
        var e, t;
        null === (e = (t = n._scrollView).scrollToBegin) || void 0 === e || e.call(t);
      };
      n.NeteaseMore = async function (id, offset = 0) {
        try {
          const response = await (n.state.isRadio
            ? services.Netease.comment_radio({
                id,
                offset,
              })
            : services.Netease.comment({
                id,
                offset,
              }));
          if (response?.comments) {
            n.setState((previous) => ({
              data: [...previous.data, ...response.comments],
            }));
            n._scrollView?.endLoading?.(!response.comments.length);
          }
        } catch (error) {
          n._scrollView?.endLoading?.();
          toast(error.message);
        }
      };
      n.QQMusicMore = function (e, t) {
        services.QQMusic.song_comments({
          songid: e,
          pagenum: t,
        }).then(function (e) {
          var t,
            a,
            o = e.comment,
            r = o.commentlist;
          o.commenttotal > 0 &&
            (n.setState({
              data: _toConsumableArray(n.state.data).concat(_toConsumableArray(r)),
            }),
            null === (t = (a = n._scrollView).endLoading) || void 0 === t || t.call(a));
        });
      };
      n.getMoreComment = function () {
        var e = n.state,
          t = e.api,
          a = e.id,
          o = e.offset;
        if (a)
          switch (t) {
            case providers.default.netEase:
              n.NeteaseMore(a, 30 * o);
              break;
            case providers.default.qqMusic:
              n.QQMusicMore(a, o);
          }
      };
      n.getMore = function () {
        n.setState(
          {
            offset: n.state.offset + 1,
          },
          function () {
            n.getMoreComment();
          },
        );
      };
      n._renderItem = function (e) {
        var t = e.item,
          a = e.index,
          o = (0, formatItem.getFormattedItem)(t, n.state.api);
        return React.default.createElement(CommentCard.default, {
          key: a,
          content: o.content,
          userName: o.userName,
          time: o.time,
          userAvatar: o.userAvatar,
          beReplieds: o.beReplieds,
          likedCount: o.likedCount,
          item: t,
          onUserInfo: n.onUserInfo,
        });
      };
      n.onUserInfo = function (e) {
        if (n.state.api === providers.default.netEase) {
          var t = e.user.userId;
          n.props.navigation.navigate('UserInfo', {
            userId: t,
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
        isRadio: false,
      };
      return n;
    }
    componentDidMount() {
      this.init();
    }
    render() {
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
      return React.default.createElement(
        components.PageContainer,
        {
          title: p,
          goBack: this.props.navigation.goBack,
          onTop: this.onTop,
          backIcon: {
            name: icons.default.WINDOW_CLOSE,
          },
          rightIcon: {
            name: icons.default.FIRE,
            onPress: this.onWordsCloud,
          },
        },
        false === n
          ? React.default.createElement(components.Spinkit, null)
          : React.default.createElement(
              reactNativeSpringScrollview.SpringScrollView,
              {
                ref: function (t) {
                  return (e._scrollView = t);
                },
                onLoading: this.getMore,
                loadingFooter: ParallaxList.default,
              },
              this.renderHeader(),
              a.map(function (t, n) {
                return e._renderItem({
                  item: t,
                  index: n,
                });
              }),
            ),
        React.default.createElement(
          ReactNative.Modal,
          {
            visible: o,
            onRequestClose: function () {
              return e.setState({
                showWordscloud: false,
              });
            },
            animationType: 'fade',
          },
          React.default.createElement(
            ReactNative.View,
            {
              style: {
                flex: 1,
                backgroundColor: '#100f14',
              },
            },
            React.default.createElement(CommentAnalysis.default, {
              hotComments: m,
              wordscloud: d,
              song: f,
              onClose: function () {
                return e.setState({
                  showWordscloud: false,
                });
              },
              loadWordsCloudDone: g,
            }),
          ),
        ),
      );
    }
  },
  E = ReactNative.StyleSheet.create({
    section: {
      paddingLeft: 20,
    },
  }),
  y = x;
exports.default = y;
