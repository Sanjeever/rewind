Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  module756 = babelHelpers.interopRequireWildcard(require("./module-756")),
  constants = require("../theme/constants"),
  locales = babelHelpers.interopRequireDefault(require("../locales/index")),
  u = 'Nothing is true',
  p = '\u4e07\u7269\u7686\u865a',
  d = function (e) {
    function t() {
      var e, n, r;
      babelHelpers.classCallCheck(this, t);
      for (var l = arguments.length, o = new Array(l), s = 0; s < l; s++) o[s] = arguments[s];
      return babelHelpers.possibleConstructorReturn(r, (n = r = babelHelpers.possibleConstructorReturn(this, (e = babelHelpers.getPrototypeOf(t)).call.apply(e, [this].concat(o))), r.dragged = false, r.state = {
        index: null
      }, r.scroll = function (e, t) {
        var n = r.props.getIndex(e, t);
        if (n !== r.state.index) {
          if (r._list && n && false === r.dragged) {
            var l = r.getVelocity(n);
            r._list.scrollToIndex({
              animated: true,
              index: n,
              velocity: l
            });
          }
          r.setState({
            index: n
          });
        }
      }, r.scrollToCurrentLine = function () {
        var e = r.props,
          t = e.currentTime,
          n = e.lyric,
          l = e.getIndex;
        if (n && !(n.length < 2)) {
          var i = l(n, t);
          r._list && i && r._list.scrollToIndex({
            animated: false,
            index: i
          });
        }
      }, r.getTrans = function (e) {
        return false === r.props.showTrans ? null : e.trans;
      }, r.scrollDragBegin = function () {
        r.timer && clearTimeout(r.timer);
        r.dragged = true;
      }, r.scrollEndDrag = function () {
        r.timer = setTimeout(function () {
          r.dragged = false;
        }, 2e3);
      }, r.onVisibleItemsChange = function (e) {
        r.visibleIndex = (e.firstIndex + e.lastIndex + 1) / 2 | 0;
      }, r.getVelocity = function (e) {
        if (!r.visibleIndex) return 1e3;
        var t = r.visibleIndex < e - 4,
          n = r.visibleIndex > e + 4;
        return t || n ? 100 : 1e3;
      }, r.btns = function () {
        return React.default.createElement(ReactNative.View, {
          style: {
            height: 200,
            paddingTop: 100,
            alignItems: 'center',
            justifyContent: 'center'
          }
        }, r.props.hasTrans && React.default.createElement(ReactNative.TouchableOpacity, {
          onPress: r.props.changeShowTrans
        }, React.default.createElement(ReactNative.Text, {
          style: h.text
        }, r.props.showTrans ? locales.default.HIDE_TRANS : locales.default.SHOW_TRANS)), React.default.createElement(ReactNative.View, {
          style: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center'
          }
        }, React.default.createElement(ReactNative.TouchableOpacity, {
          onPress: function () {
            return r.props.changeFontSize(r.props.fontSize > 1 ? r.props.fontSize - 1 : 0);
          }
        }, React.default.createElement(ReactNative.Text, {
          style: [h.text, {
            padding: 5
          }]
        }, "-")), React.default.createElement(ReactNative.View, {
          style: {
            padding: 20
          }
        }, React.default.createElement(ReactNative.Text, {
          style: h.text
        }, r.props.fontSize - 15)), React.default.createElement(ReactNative.TouchableOpacity, {
          onPress: function () {
            return r.props.changeFontSize(r.props.fontSize < 25 ? r.props.fontSize + 1 : 25);
          }
        }, React.default.createElement(ReactNative.Text, {
          style: [h.text, {
            padding: 5
          }]
        }, "+"))));
      }, r.emptyComp = function () {
        return React.default.createElement(ReactNative.View, {
          style: h.space
        });
      }, r._renderItem = function (e) {
        var t = e.item,
          n = e.index,
          l = r.getTrans(t),
          a = !r.props.showTrans && t.txt.match('\u7ffb\u8bd1\u8d21\u732e\u8005');
        return React.default.createElement(f, {
          highlight: r.state.index === n,
          lyric: !a && r.renderTxt(t.txt),
          trans: l && r.renderTxt(l.txt),
          onPress: function () {
            return r.seekTo(t);
          },
          fontSize: r.props.fontSize
        });
      }, r.seekTo = function (e) {
        var t = e.total - .5;
        r.props.seekTo(t);
        r.dragged = false;
      }, r.renderTxt = function (e) {
        return e.replace(/&apos;/gm, "'").replace(/\/\//g, '').replace(/&quot;/g, '"').replace(/\[.+\]/gi, '');
      }, n));
    }
    babelHelpers.createClass(t, [{
      key: "componentDidMount",
      value: function () {
        this.scrollToCurrentLine();
      }
    }, {
      key: "componentDidUpdate",
      value: function (e) {
        var t = this.props,
          n = t.currentTime,
          r = t.lyric;
        n !== e.currentTime && (!r || r.length < 2 || n !== e.currentTime && r.length > 0 && this.scroll(r, n));
      }
    }, {
      key: "render",
      value: function () {
        var e = this,
          t = this.props.lyric,
          n = new module756.DataSource(t, function (e, t) {
            return String(t);
          });
        return React.default.createElement(ReactNative.View, {
          style: [h.container, this.props.viewStyle]
        }, React.default.createElement(ReactNative.View, {
          style: [ReactNative.StyleSheet.absoluteFill, h.overlay],
          onTouchStart: this.props.onTap
        }), t && t.length > 0 && n ? React.default.createElement(module756.default, {
          style: {
            flex: 1,
            width: '80%',
            height: '100%'
          },
          dataSource: n,
          renderItem: this._renderItem,
          ref: function (t) {
            return e._list = t;
          },
          showVerticalScrollBar: false,
          isScrollOverMode: false,
          ListHeaderComponent: this.btns,
          ListFooterComponent: this.emptyComp,
          onTouchStart: this.scrollDragBegin,
          onScrollEndDrag: this.scrollEndDrag,
          onVisibleItemsChange: this.onVisibleItemsChange
        }) : React.default.createElement(ReactNative.View, {
          style: h.empty,
          onTouchStart: function () {
            return e.props.onTap();
          }
        }, React.default.createElement(f, {
          fontSize: 16,
          lyric: u,
          trans: p,
          highlight: true
        })));
      }
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(React.PureComponent),
  f = function (e) {
    function t() {
      babelHelpers.classCallCheck(this, t);
      return babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(t).apply(this, arguments));
    }
    babelHelpers.createClass(t, [{
      key: "render",
      value: function () {
        var e = this.props,
          t = e.lyric,
          n = void 0 === t ? '' : t,
          r = e.trans,
          l = void 0 === r ? '' : r,
          o = e.highlight,
          s = e.onPress,
          c = e.style,
          u = e.fontSize;
        return React.default.createElement(ReactNative.TouchableOpacity, {
          onLongPress: s,
          activeOpacity: .6
        }, React.default.createElement(ReactNative.View, {
          style: [h.textCon, c]
        }, React.default.createElement(ReactNative.Text, {
          style: [h.text, {
            opacity: o ? 1 : .6,
            fontSize: u
          }, l && {
            fontSize: u - 2
          }]
        }, l && React.default.createElement(ReactNative.Text, {
          style: [h.text, {
            opacity: o ? 1 : .6,
            fontSize: u
          }]
        }, l + "\n"), n)));
      }
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(React.PureComponent),
  h = ReactNative.StyleSheet.create({
    container: {
      height: '100%',
      width: constants.DEVICE_WIDTH,
      alignItems: 'center'
    },
    textCon: {
      width: '100%',
      justifyContent: 'center',
      alignContent: 'center',
      padding: 10,
      paddingVertical: 20
    },
    text: {
      fontSize: 15,
      opacity: .6,
      textAlign: 'center'
    },
    empty: {
      flex: 1,
      justifyContent: 'center',
      width: constants.DEVICE_WIDTH
    },
    space: {
      height: 180
    },
    overlay: {
      top: ReactNative.StatusBar.currentHeight + 50,
      backgroundColor: 0
    }
  }),
  g = d;
exports.default = g;
