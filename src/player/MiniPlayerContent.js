const _default = require('./../components/Pager.js').default;
const _interopRequireWildcard = require('@babel/runtime/helpers/interopRequireWildcard');
const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');
Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;
var React = _interopRequireWildcard(require('react')),
  ReactNative = require('react-native'),
  TouchableScale = _interopRequireDefault(require('../components/TouchableScale')),
  components = require('../components/index'),
  constants = require('../theme/constants'),
  icons = _interopRequireDefault(require('../theme/icons')),
  utils = require('../utils/index'),
  types = require('../utils/types'),
  trackInfo = require('../services/trackInfo'),
  playOrder = require('./playOrder'),
  TrackTitle = _interopRequireDefault(require('./TrackTitle')),
  m = 50,
  b = 60,
  y = class t extends React.PureComponent {
    constructor() {
      var e, r, n;
      for (var a = arguments.length, u = new Array(a), y = 0; y < a; y++) u[y] = arguments[y];
      return (
        (r = n = super(...u)),
        (n.scrollState = 'idle'),
        (n.triggerImage = false),
        (n.onTouchEnd = function () {
          'idle' === n.scrollState && false === n.triggerImage && n.props.playerOpen();
        }),
        (n.onImage = function () {
          n.triggerImage = true;
          n.props.togglePlay();
          (0, types.debounce)(function () {
            n.triggerImage = false;
          }, 99)();
        }),
        (n.renderCovers = function () {
          return [0, 1, 2].map(function (e) {
            return n.renderItem(e);
          });
        }),
        (n.onPageScrollStateChanged = function (e) {
          n.scrollState = e;
        }),
        (n.onPageSelected = function (e) {
          var t = e.nativeEvent.position;
          if (1 !== t) {
            var r = n.props,
              a = r.prev,
              l = r.next;
            0 === t ? a() : l();
            n.pager.setPageWithoutAnimation(1);
          }
        }),
        (n.renderItem = function (e) {
          var t = n.props,
            r = t.index,
            a = t.data,
            u = t.unknown,
            g = t.playMode,
            y = t.isRound,
            S = t.currentMiniLyric,
            I = t.randomArray,
            v = (0, playOrder.getNextPlayIndexByPagerPos)({
              pos: e,
              playMode: g,
              playingIndex: r,
              len: a.length,
              randomArray: I,
            }),
            P =
              u && 2 === e
                ? {
                    song: '？？？',
                  }
                : (0, trackInfo.extractFullInfo)(a[v]);
          return React.default.createElement(
            ReactNative.View,
            {
              key: e,
              style: {
                height: b,
                flexDirection: 'row',
                alignItems: 'center',
                paddingLeft: 10,
              },
            },
            React.default.createElement(
              ReactNative.View,
              {
                style: [
                  n.props.coverStyle,
                  {
                    height: m,
                    width: m,
                  },
                ],
              },
              u && 2 === e
                ? React.default.createElement(
                    ReactNative.View,
                    {
                      style: {
                        width: '95%',
                        height: '95%',
                        alignItems: 'center',
                        justifyContent: 'center',
                      },
                    },
                    React.default.createElement(components.Icon, {
                      name: icons.default.CROSSHAIRS_QUESTION,
                      color: '#fff',
                    }),
                  )
                : React.default.createElement(
                    TouchableScale.default,
                    {
                      activeScale: 0.95,
                      onPress: n.onImage,
                      style: {
                        height: '100%',
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                      },
                    },
                    React.default.createElement(ReactNative.Image, {
                      ref: (instance) => (this.img = instance),
                      style: [
                        {
                          width: '90%',
                          height: '90%',
                          borderRadius: 5,
                        },
                        y && {
                          width: '95%',
                          height: '95%',
                          borderRadius: 25,
                        },
                      ],
                      source: {
                        uri: P.img,
                      },
                    }),
                  ),
            ),
            React.default.createElement(TrackTitle.default, {
              viewStyle: {
                marginLeft: 7,
                flex: 1,
              },
              titleStyle: {
                fontSize: 14,
                fontWeight: 'bold',
              },
              authorStyle: {
                fontSize: 12,
              },
              dashline: false,
              title: P.song,
              subtitle: 1 === e && S ? S : (0, utils.parseArtist)(P.singer),
              numberOfLines: 1,
              alias: P.alias,
            }),
          );
        }),
        r
      );
    }
    render() {
      var e = this;
      return React.default.createElement(
        _default,
        {
          ref: function (t) {
            return (e.pager = t);
          },
          onPageSelected: this.onPageSelected,
          initialPage: 1,
          style: {
            flex: 1,
            width: constants.DEVICE_WIDTH - 50,
            height: b,
          },
          onPageScrollStateChanged: this.onPageScrollStateChanged,
          onTouchEnd: this.onTouchEnd,
        },
        this.renderCovers(),
      );
    }
  };
exports.default = y;
