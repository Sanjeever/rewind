Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  reactNativeSpringScrollview = require("react-native-spring-scrollview"),
  components = require("../components/index"),
  icons = babelHelpers.interopRequireDefault(require("../theme/icons")),
  locales = babelHelpers.interopRequireDefault(require("../locales/index")),
  services = require("../services/index"),
  p = function (e) {
    function t() {
      var e, a, o;
      babelHelpers.classCallCheck(this, t);
      for (var n = arguments.length, r = new Array(n), l = 0; l < n; l++) r[l] = arguments[l];
      return babelHelpers.possibleConstructorReturn(o, (a = o = babelHelpers.possibleConstructorReturn(this, (e = babelHelpers.getPrototypeOf(t)).call.apply(e, [this].concat(r))), o.state = {
        loaded: false,
        radios: [],
        type: 0,
        page: 0
      }, o.unLogin = function () {
        toast(locales.default.NETEASE_NOT_LOGIN);
        o.props.navigation.navigate('NeteaseLogin');
      }, o.getHotRadio = function () {
        var e = o.state.type;
        1 === e ? o.getUserRadio() : services.Netease.radio_hot().then(function (e) {
          var t = e.djRadios;
          200 === e.code && t.length > 0 && o.setState({
            radios: t,
            loaded: true
          });
        });
        o.setState({
          type: 0 === e ? 1 : 0,
          page: 0
        });
      }, o.getUserRadio = function () {
        services.Netease.radio_sublist().then(function (e) {
          var t = e.code,
            a = e.djRadios;
          200 === t && a.length > 0 ? o.setState({
            radios: a,
            loaded: true
          }) : o.unLogin();
        });
      }, o.getMore = function () {
        o.setState({
          page: o.state.page + 1
        }, function () {
          var e = o.state,
            t = e.page,
            a = e.type,
            n = e.radios;
          1 === a && services.Netease.radio_hot(30 * t).then(function (e) {
            var t = e.djRadios;
            throw 200 === e.code && t.length > 0 && o.setState({
              radios: n.concat(t),
              loaded: true
            }), new Error('END');
          }).catch(function () {
            var e, t;
            null === (e = (t = o._scrollView).endLoading) || void 0 === e || e.call(t);
          });
        });
      }, o.onTop = function () {
        var e, t;
        null === (e = (t = o._scrollView).scrollToBegin) || void 0 === e || e.call(t);
      }, o._renderItem = function (e) {
        var t = e.item,
          a = e.index;
        return React.default.createElement(components.ListItem, {
          key: a,
          img: t.picUrl + '?param=200y200',
          title: t.name,
          subtitle: t.rcmdtext + ' | ' + t.category,
          onPress: function () {
            return o.radioDetail(t);
          }
        });
      }, o.radioDetail = function (e) {
        o.props.navigation.navigate('RadioDetail', {
          item: e
        });
      }, a));
    }
    babelHelpers.createClass(t, [{
      key: "componentDidMount",
      value: function () {
        this.getUserRadio();
      }
    }, {
      key: "render",
      value: function () {
        var e = this,
          t = this.state,
          a = t.loaded,
          o = t.radios;
        return React.default.createElement(components.PageContainer, {
          title: locales.default.RADIOS,
          goBack: function () {
            return e.props.navigation.goBack();
          },
          onTop: this.onTop,
          rightIcon: {
            name: icons.default.FILTER_VARIANT,
            onPress: this.getHotRadio
          }
        }, false === a ? React.default.createElement(components.Spinkit, {
          style: g.loading
        }) : null, React.default.createElement(reactNativeSpringScrollview.SpringScrollView, {
          ref: function (t) {
            return e._scrollView = t;
          },
          onLoading: this.getMore
        }, o.map(function (t, a) {
          return e._renderItem({
            item: t,
            index: a
          });
        })));
      }
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(React.PureComponent),
  g = ReactNative.StyleSheet.create({
    loading: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
    }
  }),
  f = p;
exports.default = f;
