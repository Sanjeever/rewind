Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _ = babelHelpers.interopRequireDefault(require("@runtime/40")),
  React = babelHelpers.interopRequireDefault(require("react")),
  ReactNative = require("react-native"),
  s = _.default,
  p = 'viewPager',
  d = function (e) {
    function t() {
      var e, o, a;
      babelHelpers.classCallCheck(this, t);
      for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
      return babelHelpers.possibleConstructorReturn(a, (o = a = babelHelpers.possibleConstructorReturn(this, (e = babelHelpers.getPrototypeOf(t)).call.apply(e, [this].concat(l))), a.getInnerViewNode = function () {
        return a.refs[p].getInnerViewNode();
      }, a._childrenWithOverridenStyle = function () {
        return React.default.Children.map(a.props.children, function (e) {
          if (!e) return null;
          var t = babelHelpers.objectSpread({}, e.props, {
            style: [e.props.style, {
              position: 'absolute',
              left: 0,
              top: 0,
              right: 0,
              bottom: 0,
              width: void 0,
              height: void 0
            }],
            collapsable: false
          });
          e.type && e.type.displayName && 'RCTView' !== e.type.displayName && e.type.displayName;
          return React.default.createElement(e.type, t);
        });
      }, a._onPageScroll = function (e) {
        a.props.onPageScroll && a.props.onPageScroll(e);
        'on-drag' === a.props.keyboardDismissMode && (0, ReactNative.dismissKeyboard)();
      }, a._onPageScrollStateChanged = function (e) {
        a.props.onPageScrollStateChanged && a.props.onPageScrollStateChanged(e.nativeEvent.pageScrollState);
      }, a._onPageSelected = function (e) {
        a.props.onPageSelected && a.props.onPageSelected(e);
      }, a.setPage = function (e) {
        ReactNative.UIManager.dispatchViewManagerCommand((0, ReactNative.findNodeHandle)(babelHelpers.assertThisInitialized(babelHelpers.assertThisInitialized(a))), ReactNative.UIManager.TabbedViewPager.Commands.setPage, [e]);
      }, a.setPageWithoutAnimation = function (e) {
        ReactNative.UIManager.dispatchViewManagerCommand((0, ReactNative.findNodeHandle)(babelHelpers.assertThisInitialized(babelHelpers.assertThisInitialized(a))), ReactNative.UIManager.TabbedViewPager.Commands.setPageWithoutAnimation, [e]);
      }, o));
    }
    babelHelpers.createClass(t, [{
      key: "componentDidMount",
      value: function () {
        null != this.props.initialPage && this.setPageWithoutAnimation(this.props.initialPage);
      }
    }, {
      key: "render",
      value: function () {
        return React.default.createElement(c, babelHelpers.extends({}, this.props, {
          ref: p,
          style: this.props.style,
          onPageScroll: this._onPageScroll,
          onPageScrollStateChanged: this._onPageScrollStateChanged,
          onPageSelected: this._onPageSelected,
          tabTextColor: (0, ReactNative.processColor)(this.props.tabTextColor),
          tabBackground: (0, ReactNative.processColor)(this.props.tabBackground),
          tabSelectedTextColor: (0, ReactNative.processColor)(this.props.tabSelectedTextColor),
          tabIndicatorColor: (0, ReactNative.processColor)(this.props.tabIndicatorColor),
          children: this._childrenWithOverridenStyle()
        }));
      }
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(React.default.Component);
d.propTypes = babelHelpers.objectSpread({}, ReactNative.View.propTypes, {
  initialPage: s.number,
  onPageScroll: s.func,
  onPageScrollStateChanged: s.func,
  onPageSelected: s.func,
  pageMargin: s.number,
  keyboardDismissMode: s.oneOf(['none', 'on-drag']),
  scrollEnabled: s.bool,
  tabGravity: s.oneOf(['fill', 'center']),
  tabMode: s.oneOf(['fixed', 'scrollable']),
  tabBackground: ReactNative.ColorPropType,
  tabIndicatorColor: ReactNative.ColorPropType,
  tabTextColor: ReactNative.ColorPropType,
  tabSelectedTextColor: ReactNative.ColorPropType,
  tabIndicatorHeight: s.number,
  tabElevation: s.number,
  tabNames: s.array.isRequired
});
var c = (0, ReactNative.requireNativeComponent)('TabbedViewPager', d),
  b = d;
exports.default = b;
