Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  reactNativeSpringScrollview = require("react-native-spring-scrollview"),
  components = require("../components/index"),
  ParallaxList = babelHelpers.interopRequireDefault(require("../components/ParallaxList")),
  providers = babelHelpers.interopRequireDefault(require("../services/providers")),
  constants = require("../theme/constants"),
  names = babelHelpers.interopRequireDefault(require("../events/names")),
  icons = babelHelpers.interopRequireDefault(require("../theme/icons")),
  services = require("../services/index"),
  events = require("../events/index"),
  h = function (e) {
    function t() {
      var e, a, n;
      babelHelpers.classCallCheck(this, t);
      for (var r = arguments.length, l = new Array(r), i = 0; i < r; i++) l[i] = arguments[i];
      return babelHelpers.possibleConstructorReturn(n, (a = n = babelHelpers.possibleConstructorReturn(this, (e = babelHelpers.getPrototypeOf(t)).call.apply(e, [this].concat(l))), n.state = {
        title: '',
        loaded: false,
        data: [],
        page: 0,
        asc: false
      }, n.onTop = function () {
        var e, t;
        null === (e = (t = n._scrollView).scrollToBegin) || void 0 === e || e.call(t);
      }, n.getData = function (e) {
        var t = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
        services.Netease.radio_detail({
          id: e,
          asc: t
        }).then(function (e) {
          var t = e.programs;
          200 === e.code && t.length > 0 && n.setState({
            data: t,
            loaded: true
          });
        });
      }, n.getMore = function () {
        n.setState({
          page: n.state.page + 1
        }, function () {
          var e = n.state,
            t = e.page,
            a = e.data,
            r = e.id,
            o = e.asc;
          services.Netease.radio_detail({
            id: r,
            offset: 30 * t,
            asc: o
          }).then(function (e) {
            var t,
              r,
              o = e.programs;
            200 === e.code && o.length > 0 && n.setState({
              data: a.concat(o),
              loaded: true
            });
            null === (t = (r = n._scrollView).endLoading) || void 0 === t || t.call(r);
          });
        });
      }, n.onChangeOrder = function () {
        var e = n.state,
          t = e.asc,
          a = e.id;
        n.getData(a, !t);
        n.setState({
          asc: !t,
          loaded: false
        });
        n.onTop();
      }, n._renderItem = function (e) {
        var t = e.item,
          a = e.index;
        return React.default.createElement(components.SongRow, {
          key: a,
          img: t.coverUrl + '?param=200y200',
          song: t.name,
          singer: t.description,
          onPress: function () {
            return n.playRadio(t, a);
          }
        });
      }, n.playRadio = function (e, t) {
        var a = n.state.data;
        events.emitter.emit(names.default.Player, {
          song: e,
          data: a,
          index: t,
          api: providers.default.netEase
        });
      }, a));
    }
    babelHelpers.createClass(t, [{
      key: "componentDidMount",
      value: function () {
        var e = this.props.navigation.state.params;
        if (e) {
          var t = e.item;
          t && (this.setState({
            title: t.name,
            id: t.id
          }), this.getData(t.id));
        }
      }
    }, {
      key: "render",
      value: function () {
        var e = this,
          t = this.state,
          a = t.loaded,
          n = t.data,
          r = t.title,
          u = t.asc;
        return React.default.createElement(ReactNative.View, {
          style: m.container
        }, React.default.createElement(components.Background, null), false === a ? React.default.createElement(components.Spinkit, {
          style: m.loading
        }) : null, React.default.createElement(reactNativeSpringScrollview.SpringScrollView, {
          ref: function (t) {
            return e._scrollView = t;
          },
          onLoading: this.getMore,
          loadingFooter: ParallaxList.default
        }, n.map(function (t, a) {
          return e._renderItem({
            item: t,
            index: a
          });
        })), React.default.createElement(components.HeaderBar, {
          headerStyle: m.header,
          title: r,
          goBack: function () {
            return e.props.navigation.goBack();
          },
          onTop: this.onTop,
          rightIcon: {
            name: false === u ? icons.default.ARROW_DOWN : icons.default.ARROW_UP,
            onPress: this.onChangeOrder
          }
        }));
      }
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(React.PureComponent),
  m = ReactNative.StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 40 + constants.STATUS_BAR_HEIGHT
    },
    header: {
      position: 'absolute',
      top: 0,
      zIndex: 10
    },
    loading: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
    }
  }),
  v = h;
exports.default = v;
