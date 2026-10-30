const _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");
const _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  reactNativeSpringScrollview = require("./../components/Scrolling.js"),
  components = require("../components/index"),
  icons = _interopRequireDefault(require("../theme/icons")),
  services = require("../services/index"),
  utils = require("../utils/index"),
  filterColors = require("../components/filterColors"),
  filterStyles = _interopRequireDefault(require("../components/filterStyles")),
  b = class r extends React.PureComponent {
    constructor() {
      var e, t, n;
      for (var l = arguments.length, o = new Array(l), i = 0; i < l; i++) o[i] = arguments[i];
      return t = n = super(...o), n.renderCategoryItem = function (e) {
        var r = e.item,
          t = e.index,
          l = utils.random.getInt(20, 30);
        return React.default.createElement(filterStyles.default, {
          key: t,
          name: r.name,
          highlight: n.props.currentType === r.name,
          onPress: function () {
            return n.props.onType(r.name);
          },
          textStyle: {
            fontSize: l
          }
        });
      }, t;
    }
    "render"() {
      var e = this,
        r = this.props,
        t = r.visible,
        n = r.onClose,
        l = r.onSearch,
        c = r.currentType;
      return React.default.createElement(ReactNative.Modal, {
        transparent: true,
        animationType: "fade",
        visible: t,
        onRequestClose: n
      }, React.default.createElement(ReactNative.View, {
        style: {
          backgroundColor: 'rgba(0,0,0,0.9)',
          flex: 1
        }
      }, React.default.createElement(reactNativeSpringScrollview.SpringScrollView, {
        contentStyle: {
          paddingTop: '25%',
          flexDirection: 'row',
          flexWrap: 'wrap',
          padding: 20
        }
      }, React.default.createElement(components.Icon, {
        color: filterColors.highlightColor,
        name: icons.default.WINDOW_CLOSE,
        size: 40,
        onPress: n
      }), services.Netease.playlist_category_names.map(function (r, t) {
        return e.renderCategoryItem({
          item: r,
          index: t
        });
      }), React.default.createElement(components.Icon, {
        color: 'search' === c ? filterColors.highlightColor : filterColors.defaultColor,
        name: icons.default.MAGNIFY,
        size: 40,
        onPress: l
      }))));
    }
  };
exports.default = b;
