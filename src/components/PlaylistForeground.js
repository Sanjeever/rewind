const _default = require('./Text.js').default;
const _interopRequireWildcard = require('@babel/runtime/helpers/interopRequireWildcard');
const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');
Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;
var React = _interopRequireWildcard(require('react')),
  ReactNative = require('react-native'),
  reactNativeAnimatable = _interopRequireWildcard(require('react-native-animatable')),
  TouchableScale = _interopRequireDefault(require('./TouchableScale')),
  components = require('./index'),
  constants = require('../theme/constants'),
  icons = _interopRequireDefault(require('../theme/icons')),
  trackInfo = require('../services/trackInfo'),
  reactNativePopupMenu = require('react-native-popup-menu'),
  g = 0.9 * constants.DEVICE_WIDTH,
  E = 0.5 * constants.DEVICE_WIDTH,
  b = 0.2 * constants.DEVICE_WIDTH,
  I = function (e) {
    var t = e.onWebview,
      n = e.onOpenUrl,
      a = e.onCopy,
      r = e.onShare;
    return React.default.createElement(
      reactNativePopupMenu.Menu,
      null,
      React.default.createElement(
        reactNativePopupMenu.MenuTrigger,
        {
          customStyles: {
            triggerWrapper: {
              alignItems: 'center',
              justifyContent: 'center',
            },
            TriggerTouchableComponent: ReactNative.TouchableOpacity,
          },
        },
        React.default.createElement(components.IconButton, {
          name: icons.default.MENU_OPEN,
          size: 25,
          disabled: true,
        }),
      ),
      React.default.createElement(
        reactNativePopupMenu.MenuOptions,
        {
          style: {
            color: '#000',
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            borderWidth: 1,
            borderColor: '#fff',
            borderRadius: 16,
            padding: 8,
            flex: 0,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
          },
          optionsContainerStyle: {
            elevation: 0,
            borderRadius: 16,
            flex: 0,
            width: 'auto',
          },
          customStyles: {
            OptionTouchableComponent: ReactNative.TouchableOpacity,
          },
        },
        React.default.createElement(
          reactNativePopupMenu.MenuOption,
          {
            onSelect: a,
          },
          React.default.createElement(components.Icon, {
            name: icons.default.CONTENT_COPY,
            style: {
              margin: 2,
            },
            size: 23,
          }),
        ),
        React.default.createElement(
          reactNativePopupMenu.MenuOption,
          {
            onSelect: n,
          },
          React.default.createElement(components.Icon, {
            name: icons.default.LINK_VARIANT,
            style: {
              margin: 2,
            },
            size: 25,
          }),
        ),
        React.default.createElement(
          reactNativePopupMenu.MenuOption,
          {
            onSelect: t,
          },
          React.default.createElement(components.Icon, {
            name: icons.default.WEB,
            style: {
              margin: 2,
            },
            size: 25,
          }),
        ),
        React.default.createElement(
          reactNativePopupMenu.MenuOption,
          {
            onSelect: r,
          },
          React.default.createElement(components.Icon, {
            name: icons.default.SHARE_VARIANT_OUTLINE,
            style: {
              margin: 2,
            },
            size: 25,
          }),
        ),
      ),
    );
  },
  p = class t extends React.PureComponent {
    constructor() {
      return super(...arguments);
    }
    render() {
      var e = this.props,
        t = e.coverImgUrl,
        n = e.onRestore,
        a = e.showRestore,
        r = e.subscribed,
        u = e.onSubscribe,
        d = e.savePic,
        f = e.orderText,
        m = e.onSortText,
        g = (e.heartMode, e.onHeartMode),
        E = e.onSort,
        b = e.onMult,
        p = e.isCreatedByMe,
        v = e.lastPlayedSong,
        P = e.onPlay,
        T = e.onInsert,
        S = e.onWebview,
        R = e.creator,
        w = e.onUser,
        O = e.disabledLastPlayedSong,
        _ = e.onCopy,
        H = e.onOpenUrl,
        x = e.onShare;
      return React.default.createElement(
        React.default.Fragment,
        null,
        React.default.createElement(
          ReactNative.View,
          {
            style: [C.foreground],
          },
          React.default.createElement(
            ReactNative.View,
            {
              style: C.coverCon,
            },
            h({
              coverImgUrl: t,
              savePic: d,
              creator: R,
              onUser: w,
            }),
          ),
          React.default.createElement(
            ReactNative.View,
            {
              style: C.extraBtnCon,
            },
            f
              ? React.default.createElement(
                  ReactNative.TouchableOpacity,
                  {
                    activeOpacity: 0.7,
                    onPress: m,
                    style: {
                      position: 'absolute',
                      left: 50,
                      bottom: 0,
                    },
                  },
                  React.default.createElement(
                    reactNativeAnimatable.Text,
                    {
                      style: C.sortText,
                      animation: 'fadeIn',
                    },
                    f,
                  ),
                )
              : null,
            E &&
              React.default.createElement(components.IconButton, {
                name: icons.default.SORT_VARIANT,
                size: 25,
                onPress: E,
              }),
            a &&
              React.default.createElement(components.IconButton, {
                name: icons.default.BACKUP_RESTORE,
                onPress: n,
                size: 25,
              }),
            g &&
              p &&
              React.default.createElement(components.IconButton, {
                name: icons.default.HEART_PULSE,
                size: 25,
                onPress: g,
              }),
            !p &&
              u &&
              React.default.createElement(components.IconButton, {
                name: r ? icons.default.PLAYLIST_REMOVE : icons.default.PLAYLIST_PLUS,
                size: 25,
                onPress: u,
              }),
            b &&
              React.default.createElement(components.IconButton, {
                name: icons.default.CHECKBOX_MULTIPLE_MARKED_CIRCLE_OUTLINE,
                size: 25,
                onPress: b,
              }),
            S &&
              React.default.createElement(I, {
                onWebview: S,
                onCopy: _,
                onOpenUrl: H,
                onShare: x,
              }),
          ),
        ),
        !O &&
          y({
            lastPlayedSong: v,
            onPlay: P,
            onInsert: T,
          }),
      );
    }
  };
exports.default = p;
var h = function (e) {
    var t = e.coverImgUrl,
      n = e.savePic,
      a = e.onUser,
      r = e.creator;
    return t
      ? React.default.createElement(
          React.default.Fragment,
          null,
          React.default.createElement(
            TouchableScale.default,
            {
              onPress: n,
              style: C.coverImg,
            },
            React.default.createElement(ReactNative.Image, {
              style: C.coverImg,
              source: {
                uri: t,
              },
            }),
          ),
          (null === r || void 0 === r ? void 0 : r.avatarUrl) &&
            React.default.createElement(
              TouchableScale.default,
              {
                style: C.avatarCon,
                onPress: a,
              },
              React.default.createElement(ReactNative.Image, {
                style: C.avatar,
                source: {
                  uri: r.avatarUrl,
                },
              }),
            ),
        )
      : React.default.createElement(
          ReactNative.View,
          {
            style: [C.coverCon],
          },
          React.default.createElement(
            ReactNative.View,
            {
              style: [
                C.coverImg,
                {
                  backgroundColor: '#fff',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: E / 2,
                },
              ],
            },
            React.default.createElement(components.Icon, {
              name: icons.default.DISC,
              size: 100,
              color: '#111',
            }),
          ),
        );
  },
  y = function (e) {
    var t = e.lastPlayedSong,
      n = e.onPlay,
      a = e.onInsert;
    if (null === t)
      return React.default.createElement(
        ReactNative.TouchableNativeFeedback,
        {
          onPress: n,
        },
        React.default.createElement(
          ReactNative.View,
          {
            style: {
              width: constants.DEVICE_WIDTH,
              height: 60,
              flexDirection: 'row',
              alignItems: 'center',
              paddingLeft: 13,
            },
          },
          React.default.createElement(components.Icon, {
            name: icons.default.PLAY,
          }),
          React.default.createElement(
            _default,
            {
              style: {
                marginLeft: 7,
              },
            },
            '\u64ad\u653e\u5168\u90e8',
          ),
        ),
      );
    var r = (0, trackInfo.extractFullInfo)(t);
    return React.default.createElement(
      ReactNative.TouchableNativeFeedback,
      {
        onPress: n,
      },
      React.default.createElement(
        ReactNative.View,
        {
          style: {
            height: 60,
            width: constants.DEVICE_WIDTH,
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: 11,
            paddingRight: 18,
          },
        },
        React.default.createElement(
          TouchableScale.default,
          {
            onPress: a,
          },
          React.default.createElement(ReactNative.Image, {
            source: {
              uri: r.img,
            },
            style: {
              height: 26,
              width: 26,
              borderRadius: 13,
              marginRight: 3,
            },
          }),
        ),
        React.default.createElement(components.SongRow, {
          containerStyle: {
            flex: 1,
          },
          song: r.song,
          singer: r.singer,
          alias: r.alias,
          index: null,
          disabled: true,
        }),
        React.default.createElement(components.Icon, {
          name: icons.default.PLAY,
        }),
      ),
    );
  },
  C = ReactNative.StyleSheet.create({
    foreground: {
      width: '100%',
      height: g,
      paddingHorizontal: 15,
      alignItems: 'center',
      justifyContent: 'center',
    },
    coverCon: {
      height: E,
      width: '100%',
      alignItems: 'center',
    },
    coverImg: {
      width: E,
      height: E,
      borderRadius: 5,
    },
    extraBtnCon: {
      position: 'absolute',
      justifyContent: 'space-around',
      alignItems: 'center',
      flexDirection: 'row',
      bottom: 0,
      height: b,
      paddingHorizontal: 20,
    },
    avatarCon: {
      position: 'absolute',
      right: 70,
      bottom: -10,
    },
    avatar: {
      height: 30,
      width: 30,
      borderRadius: 15,
      borderWidth: 1,
      borderColor: '#fff',
    },
    sortText: {
      alignSelf: 'flex-start',
      backgroundColor: '#fff',
      color: '#000',
      padding: 3,
      fontWeight: 'bold',
      borderRadius: 1,
    },
  });
