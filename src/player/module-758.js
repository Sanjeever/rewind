var React = babelHelpers.interopRequireWildcard(require("react")),
  ReactNative = babelHelpers.interopRequireWildcard(require("react-native")),
  _ = babelHelpers.interopRequireDefault(require("@runtime/40")),
  module757 = babelHelpers.interopRequireDefault(require("./module-757")),
  d = function (e) {
    function t() {
      babelHelpers.classCallCheck(this, t);
      return babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(t).apply(this, arguments));
    }
    babelHelpers.createClass(t, [{
      key: "render",
      value: function () {
        var e = this.props,
          t = e.children,
          a = babelHelpers.objectWithoutProperties(e, ["children"]);
        return React.default.createElement(u, a, t);
      }
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(React.Component);
d.propTypes = {
  sss: _.default.string
};
var u = (0, ReactNative.requireNativeComponent)('RecyclerViewItemView'),
  c = function (e) {
    function t(e) {
      var a;
      babelHelpers.classCallCheck(this, t);
      (a = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(t).call(this, e)))._dataSourceListener = {
        onUnshift: function () {
          a._notifyItemRangeInserted(0, 1);
        },
        onPush: function () {
          var e = a.props.dataSource;
          a._notifyItemRangeInserted(e.size(), 1);
        },
        onSplice: function (e, t) {
          t > 0 && a._notifyItemRangeRemoved(e, t);
          (arguments.length <= 2 ? 0 : arguments.length - 2) > 0 && a._notifyItemRangeInserted(e, arguments.length <= 2 ? 0 : arguments.length - 2);
        },
        onSet: function () {
          a.forceUpdate();
        },
        onSetDirty: function () {
          a.forceUpdate();
        }
      };
      a.scrollToIndex = function (e) {
        var t = e.animated,
          i = void 0 === t || t,
          n = e.index,
          r = e.velocity,
          o = void 0 === r ? 0 : r,
          s = e.center,
          d = void 0 === s || s;
        n = Math.max(0, Math.min(n, a.props.dataSource.size() - 1));
        ReactNative.UIManager.dispatchViewManagerCommand(ReactNative.default.findNodeHandle(babelHelpers.assertThisInitialized(babelHelpers.assertThisInitialized(a))), ReactNative.UIManager.AndroidRecyclerViewBackedScrollView.Commands.scrollToIndex, [i, n, o, d]);
      };
      a._handleVisibleItemsChange = function (e) {
        var t = e.nativeEvent,
          i = t.firstIndex,
          n = t.lastIndex;
        a.setState({
          firstVisibleIndex: i,
          lastVisibleIndex: n
        });
        var r = a.props.onVisibleItemsChange;
        r && r(t);
      };
      var i = a.props,
        n = i.dataSource,
        r = i.initialListSize,
        o = i.initialScrollIndex;
      n._addListener(a._dataSourceListener);
      var s = o >= 0 ? [o, o + r] : [0, r];
      a.state = {
        firstVisibleIndex: s[0],
        lastVisibleIndex: s[1],
        itemCount: n.size()
      };
      return a;
    }
    babelHelpers.createClass(t, [{
      key: "componentWillUnmount",
      value: function () {
        var e = this.props.dataSource;
        e && e._removeListener(this._dataSourceListener);
      }
    }, {
      key: "componentDidMount",
      value: function () {
        var e = this.props.initialScrollIndex;
        e && this.scrollToIndex({
          animated: false,
          index: e
        });
      }
    }, {
      key: "componentWillReceiveProps",
      value: function (e) {
        var t = this.props.dataSource;
        e.dataSource !== t && (t._removeListener(this._dataSourceListener), e.dataSource._addListener(this._dataSourceListener), this._notifyDataSetChanged(e.dataSource.size()));
      }
    }, {
      key: "render",
      value: function () {
        var e = this.props,
          t = e.dataSource,
          a = e.renderItem,
          i = e.ListHeaderComponent,
          n = e.ListFooterComponent,
          l = e.ListEmptyComponent,
          o = e.ItemSeparatorComponent,
          s = babelHelpers.objectWithoutProperties(e, ["dataSource", "renderItem", "ListHeaderComponent", "ListFooterComponent", "ListEmptyComponent", "ItemSeparatorComponent"]),
          u = t.size(),
          c = u - 1,
          f = this.state.itemCount,
          h = [],
          b = this._calcItemRangeToRender(this.state.firstVisibleIndex, this.state.lastVisibleIndex);
        if (i) var I = React.default.isValidElement(i) ? i : React.default.createElement(i, null);
        if (n) var v = React.default.isValidElement(n) ? n : React.default.createElement(n, null);
        if (o) var S = React.default.isValidElement(o) ? o : React.default.createElement(o, null);
        if (u > 0) for (var y = b[0]; y < b[1]; y++) {
          var C = t.get(y);
          h.push(React.default.createElement(d, {
            style: m.absolute,
            key: t.getKey(C, y),
            itemIndex: y
          }, 0 == y && I, a({
            item: C,
            index: y
          }), y != c && S, y == c && v));
        } else if (l) {
          var g = React.default.isValidElement(l) ? l : React.default.createElement(l, null);
          h.push(React.default.createElement(d, {
            style: m.absolute,
            key: "$empty",
            itemIndex: 0
          }, I, g, v));
          f = 1;
        }
        return React.default.createElement(p, babelHelpers.extends({}, s, {
          itemCount: f,
          onVisibleItemsChange: this._handleVisibleItemsChange
        }), h);
      }
    }, {
      key: "scrollToEnd",
      value: function () {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
          t = e.animated,
          a = void 0 === t || t,
          i = e.velocity;
        this.scrollToIndex({
          index: this.props.dataSource.size() - 1,
          animated: a,
          velocity: i
        });
      }
    }, {
      key: "_calcItemRangeToRender",
      value: function (e, t) {
        var a = this.props,
          i = a.dataSource,
          n = a.windowSize,
          r = i.size();
        return [Math.min(r, Math.max(0, e - n)), Math.min(r, t + n)];
      }
    }, {
      key: "_notifyItemRangeInserted",
      value: function (e, t) {
        ReactNative.UIManager.dispatchViewManagerCommand(ReactNative.default.findNodeHandle(this), ReactNative.UIManager.AndroidRecyclerViewBackedScrollView.Commands.notifyItemRangeInserted, [e, t]);
        var a = this.state,
          i = a.firstVisibleIndex;
        a.lastVisibleIndex;
        0 == a.itemCount ? this.setState({
          itemCount: this.props.dataSource.size(),
          firstVisibleIndex: 0,
          lastVisibleIndex: this.props.initialListSize
        }) : e <= i ? this.setState({
          firstVisibleIndex: this.state.firstVisibleIndex + t,
          lastVisibleIndex: this.state.lastVisibleIndex + t
        }) : this.forceUpdate();
      }
    }, {
      key: "_notifyItemRangeRemoved",
      value: function (e, t) {
        ReactNative.UIManager.dispatchViewManagerCommand(ReactNative.default.findNodeHandle(this), ReactNative.UIManager.AndroidRecyclerViewBackedScrollView.Commands.notifyItemRangeRemoved, [e, t]);
        this.forceUpdate();
      }
    }, {
      key: "_notifyDataSetChanged",
      value: function (e) {
        ReactNative.UIManager.dispatchViewManagerCommand(ReactNative.default.findNodeHandle(this), ReactNative.UIManager.AndroidRecyclerViewBackedScrollView.Commands.notifyDataSetChanged, [e]);
        this.setState({
          itemCount: e
        });
      }
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(React.default.PureComponent);
c.propTypes = babelHelpers.objectSpread({}, ReactNative.View.propTypes, {
  renderItem: _.default.func,
  dataSource: _.default.instanceOf(module757.default),
  windowSize: _.default.number,
  initialListSize: _.default.number,
  initialScrollIndex: _.default.number,
  itemAnimatorEnabled: _.default.bool,
  ListHeaderComponent: _.default.element,
  ListFooterComponent: _.default.element,
  ListEmptyComponent: _.default.element,
  ItemSeparatorComponent: _.default.element,
  onVisibleItemsChange: _.default.func,
  isScrollOverMode: _.default.bool,
  showVerticalScrollBar: _.default.bool
});
c.defaultProps = {
  dataSource: new module757.default(),
  initialListSize: 10,
  windowSize: 30,
  itemAnimatorEnabled: true
};
var m = ReactNative.StyleSheet.create({
    absolute: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0
    }
  }),
  p = (0, ReactNative.requireNativeComponent)('AndroidRecyclerViewBackedScrollView', c, {
    nativeOnly: {
      onVisibleItemsChange: true,
      itemCount: true
    }
  });
module.exports = c;
