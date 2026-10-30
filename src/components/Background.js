Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  constants = require("../theme/constants"),
  names = babelHelpers.interopRequireDefault(require("../events/names")),
  keys = babelHelpers.interopRequireDefault(require("../storage/keys")),
  events = require("../events/index"),
  background = require("../theme/background"),
  d = function (e) {
    function t() {
      var e, r, a;
      babelHelpers.classCallCheck(this, t);
      for (var l = arguments.length, n = new Array(l), o = 0; o < l; o++) n[o] = arguments[o];
      return babelHelpers.possibleConstructorReturn(a, (r = a = babelHelpers.possibleConstructorReturn(this, (e = babelHelpers.getPrototypeOf(t)).call.apply(e, [this].concat(n))), a.state = {
        url: null,
        error: false,
        blur: false
      }, a.changeBackgroundEmitter = function (e) {
        (null === e || void 0 === e ? void 0 : e.path) && (storage.save({
          key: keys.default.background,
          data: e
        }).catch(function (e) {
          return e;
        }), a.setState({
          url: e.path,
          opacity: e.opacity,
          blur: e.blur,
          error: false
        }), (0, background.initBackgroundState)());
      }, a.loadBackground = function () {
        var e;
        return regeneratorRuntime.async(function (t) {
          for (;;) switch (t.prev = t.next) {
            case 0:
              t.next = 2;
              return regeneratorRuntime.awrap((0, background.getBackground)());
            case 2:
              e = t.sent;
              a.setState(babelHelpers.objectSpread({}, e));
            case 4:
            case "end":
              return t.stop();
          }
        }, null, this);
      }, r));
    }
    babelHelpers.createClass(t, [{
      key: "componentDidMount",
      value: function () {
        this.loadBackground();
        this.sub = events.emitter.addListener(names.default.ChangeBackground, this.changeBackgroundEmitter);
      }
    }, {
      key: "componentWillUnmount",
      value: function () {
        var e, t;
        null === (e = (t = this.sub).remove) || void 0 === e || e.call(t);
      }
    }, {
      key: "render",
      value: function () {
        var e = this.props,
          t = e.coverUrl,
          r = e.bgStyle,
          a = e.hideMask,
          l = e.imageStyle,
          u = this.state,
          i = u.url,
          s = u.opacity,
          c = u.error,
          b = u.blur,
          d = t || i,
          h = void 0 == this.props.blur ? b : this.props.blur;
        return React.default.createElement(ReactNative.View, {
          style: [p.background, r]
        }, d && (!c || t) && React.default.createElement(ReactNative.Image, {
          style: [{
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0
          }, l],
          source: {
            uri: d
          },
          blurRadius: h ? 10 : 0
        }), d && !a ? React.default.createElement(ReactNative.View, {
          style: [p.msk, {
            opacity: t ? .3 : 1 - s
          }]
        }) : null);
      }
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(React.PureComponent),
  p = ReactNative.StyleSheet.create({
    background: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      width: '100%',
      height: constants.DEVICE_HEIGHT,
      backgroundColor: '#000'
    },
    msk: {
      position: 'absolute',
      width: '100%',
      height: constants.DEVICE_HEIGHT,
      backgroundColor: 'rgba(0,0,0,1)'
    }
  }),
  h = d;
exports.default = h;
