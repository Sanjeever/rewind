Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  reactNativeSpringScrollview = require("react-native-spring-scrollview"),
  components = require("../components/index"),
  icons = babelHelpers.interopRequireDefault(require("../theme/icons")),
  services = require("../services/index"),
  p = function (e) {
    function t() {
      var e, r, n;
      babelHelpers.classCallCheck(this, t);
      for (var a = arguments.length, s = new Array(a), i = 0; i < a; i++) s[i] = arguments[i];
      return babelHelpers.possibleConstructorReturn(n, (r = n = babelHelpers.possibleConstructorReturn(this, (e = babelHelpers.getPrototypeOf(t)).call.apply(e, [this].concat(s))), n.state = {
        data: [],
        search: ''
      }, n.searchUser = function (e) {
        var t = {
          keywords: e,
          type: 1002
        };
        services.Netease.search(t).then(function (e) {
          var t = e.result;
          if (t) {
            var r = t.userprofiles;
            if (r) {
              var a = r;
              n.setState({
                data: a
              });
            }
          }
        });
      }, n._renderItem = function (e) {
        var t = e.item,
          r = e.index;
        return React.default.createElement(components.ListItem, {
          key: r,
          title: t.nickname,
          subtitle: t.signature,
          img: t.avatarUrl,
          onPress: function () {
            return n.onSelect(t);
          }
        });
      }, n.onSelect = function (e) {
        n.props.onSelected(e);
      }, r));
    }
    babelHelpers.createClass(t, [{
      key: "render",
      value: function () {
        var e = this,
          t = this.props,
          r = t.isOpen,
          n = t.onModalClose,
          a = this.state.search;
        return React.default.createElement(ReactNative.Modal, {
          visible: r,
          onRequestClose: n,
          animationType: "fade"
        }, React.default.createElement(components.PageContainer, {
          goBack: n,
          searchText: a,
          onChangeText: function (t) {
            return e.setState({
              search: t
            });
          },
          onSubmitEditing: function () {
            return e.searchUser(a);
          },
          backIcon: {
            name: icons.default.WINDOW_CLOSE
          },
          textInput: true,
          forceShowTextInput: true,
          disabledTextInputBtn: true
        }, React.default.createElement(reactNativeSpringScrollview.SpringScrollView, null, this.state.data.map(function (t, r) {
          return e._renderItem({
            item: t,
            index: r
          });
        }))));
      }
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(React.PureComponent);
exports.default = p;
