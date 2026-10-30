Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  reactNativeSpringScrollview = require("react-native-spring-scrollview"),
  components = require("../components/index"),
  constants = require("../theme/constants"),
  utils = require("../utils/index"),
  module827 = babelHelpers.interopRequireDefault(require("./module-827")),
  m = function (e) {
    function t() {
      var e, n, l;
      babelHelpers.classCallCheck(this, t);
      for (var r = arguments.length, o = new Array(r), c = 0; c < r; c++) o[c] = arguments[c];
      return babelHelpers.possibleConstructorReturn(l, (n = l = babelHelpers.possibleConstructorReturn(this, (e = babelHelpers.getPrototypeOf(t)).call.apply(e, [this].concat(o))), l.hash = {}, l.state = {
        selectedComments: [],
        showSelectedComments: false,
        selectedIndex: 0
      }, l.filterHot = function (e, t) {
        var n = e.content || e.rootcommentcontent;
        return !!n && n.replace(/\s/gi, '').includes(t);
      }, l.showHotComment = function (e, t) {
        var n = l.props.hotComments.filter(function (t) {
          return l.filterHot(t, e);
        });
        l.setState({
          selectedComments: n,
          showSelectedComments: true,
          selectedIndex: t
        });
      }, l.getIndex = function (e, t, n) {
        var l = e;
        'next' === n ? l = e + 1 >= t ? 0 : e + 1 : 'pre' === n && (l = e < 1 ? t - 1 : e - 1);
        return l;
      }, l.selectItem = function () {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 'next',
          t = l.props.wordscloud,
          n = l.state.selectedIndex,
          r = l.getIndex(n, t.length, e);
        l.showHotComment(t[r], r);
      }, l.getSelectedText = function () {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 'mid',
          t = l.props.wordscloud,
          n = l.state.selectedIndex;
        return t[l.getIndex(n, t.length, e)];
      }, l.useRandomValues = function (e) {
        if (!l.hash[e]) {
          var t = Math.random();
          l.hash[e] = {
            randomSize: utils.random.getInt(15, 30),
            textOpacity: t >= .8 ? .8 : t + .2
          };
        }
        return {
          randomSize: l.hash[e].randomSize,
          textOpacity: l.hash[e].textOpacity
        };
      }, l.renderSelectedItem = function () {
        return React.default.createElement(ReactNative.View, {
          style: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
          }
        }, React.default.createElement(ReactNative.View, {
          style: {
            height: 80,
            justifyContent: 'center'
          }
        }, React.default.createElement(ReactNative.ViewPagerAndroid, {
          style: {
            width: constants.DEVICE_WIDTH,
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
          },
          initialPage: 1,
          onPageSelected: l.onTitleSelected,
          ref: "titlePager"
        }, React.default.createElement(f, {
          text: l.getSelectedText('pre')
        }), React.default.createElement(f, {
          text: l.getSelectedText('mid')
        }), React.default.createElement(f, {
          text: l.getSelectedText('next')
        }))), l.renderCommentItems());
      }, l.renderCommentItems = function () {
        var e,
          t = l.state.selectedComments;
        if (t && !(t.length < 1)) {
          if (t.length > 1) return t.map(function (e, t) {
            return React.default.createElement(ReactNative.View, {
              key: t,
              style: {
                marginTop: 30
              }
            }, React.default.createElement(module827.default, {
              item: e,
              title: l.getSelectedText('mid')
            }), e.beReplied.length > 0 ? React.default.createElement(module827.default, {
              item: e.beReplied[0],
              replied: true
            }) : null);
          });
          var n = t[0];
          return React.default.createElement(ReactNative.View, {
            style: {
              alignItems: 'center',
              justifyContent: 'center'
            }
          }, React.default.createElement(module827.default, {
            item: n,
            title: l.getSelectedText('mid')
          }), (null === (e = n.beReplied) || void 0 === e ? void 0 : e.length) > 0 ? React.default.createElement(module827.default, {
            item: n.beReplied[0],
            replied: true
          }) : null);
        }
      }, l.closeItem = function () {
        l.setState({
          showSelectedComments: false
        });
      }, l.onTitleSelected = function (e) {
        var t;
        switch (e.nativeEvent.position) {
          case 0:
            l.selectItem('pre');
            break;
          case 2:
            l.selectItem('next');
        }
        null === (t = l.refs.titlePager) || void 0 === t || t.setPageWithoutAnimation(1);
      }, n));
    }
    babelHelpers.createClass(t, [{
      key: "render",
      value: function () {
        var e = this,
          t = this.props,
          n = t.wordscloud,
          l = t.loadWordsCloudDone,
          r = t.song;
        return l ? React.default.createElement(ReactNative.View, {
          style: {
            flex: 1
          }
        }, React.default.createElement(reactNativeSpringScrollview.SpringScrollView, {
          contentStyle: {
            paddingTop: '15%'
          }
        }, React.default.createElement(ReactNative.View, {
          style: {
            alignItems: 'center',
            marginBottom: 20
          }
        }, React.default.createElement(ReactNative.Text, {
          style: [p.text, {
            fontSize: 25,
            textAlign: 'center',
            alignSelf: 'center',
            fontWeight: 'bold'
          }]
        }, r.song), React.default.createElement(ReactNative.Text, {
          style: [p.text, {
            fontSize: 15,
            alignSelf: 'center'
          }]
        }, (0, utils.parseArtist)(r.singer))), React.default.createElement(ReactNative.View, {
          style: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            padding: 20
          }
        }, null === n || void 0 === n ? void 0 : n.map(function (t, n) {
          var l = e.useRandomValues(n),
            r = l.textOpacity,
            o = l.randomSize;
          return React.default.createElement(ReactNative.View, {
            key: n,
            style: [{
              justifyContent: 'center',
              alignItems: 'center'
            }]
          }, React.default.createElement(ReactNative.TouchableOpacity, {
            onPress: function () {
              return e.showHotComment(t, n);
            }
          }, React.default.createElement(ReactNative.Text, {
            style: [p.text, {
              margin: 1,
              opacity: r,
              textAlignVertical: 'center',
              fontSize: o
            }]
          }, t)));
        }))), React.default.createElement(ReactNative.Modal, {
          visible: this.state.showSelectedComments,
          onRequestClose: this.closeItem,
          animationType: "fade",
          transparent: true
        }, React.default.createElement(ReactNative.View, {
          style: {
            flex: 1,
            backgroundColor: "#100f14"
          }
        }, React.default.createElement(reactNativeSpringScrollview.SpringScrollView, {
          contentStyle: {
            alignItems: 'center',
            justifyContent: 'center',
            flexGrow: 1,
            paddingTop: constants.STATUS_BAR_HEIGHT + 100,
            padding: 20
          }
        }, this.renderSelectedItem())))) : React.default.createElement(components.Spinkit, null);
      }
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(React.Component),
  f = function (e) {
    var t = e.text;
    return React.default.createElement(ReactNative.View, {
      style: p.titleCon
    }, React.default.createElement(ReactNative.Text, {
      style: [p.text, p.title]
    }, "\u201c ", t, " \u201d"));
  },
  p = ReactNative.StyleSheet.create({
    text: {
      color: '#c99f63',
      fontSize: 16
    },
    titleCon: {
      flex: 1,
      height: '100%',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0)'
    },
    title: {
      fontSize: 30
    }
  }),
  g = m;
exports.default = g;
