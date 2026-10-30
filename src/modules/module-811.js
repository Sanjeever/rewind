Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireDefault(require("react")),
  ReactNative = require("react-native"),
  reactNativePopupMenu = require("react-native-popup-menu"),
  components = require("../components/index"),
  icons = babelHelpers.interopRequireDefault(require("../theme/icons")),
  d = function (e) {
    var t = e.onWebview,
      n = e.onOpenUrl,
      l = e.onCopy,
      a = e.onShare,
      d = e.followed,
      f = e.onLike;
    return React.default.createElement(reactNativePopupMenu.Menu, {
      style: {
        position: 'absolute'
      }
    }, React.default.createElement(reactNativePopupMenu.MenuTrigger, {
      customStyles: {
        triggerWrapper: {
          alignItems: 'center',
          justifyContent: 'center'
        },
        TriggerTouchableComponent: ReactNative.TouchableOpacity
      }
    }, React.default.createElement(components.IconButton, {
      name: icons.default.DOTS_VERTICAL,
      size: 25,
      disabled: true
    })), React.default.createElement(reactNativePopupMenu.MenuOptions, {
      style: {
        color: '#000',
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 16,
        padding: 8,
        flex: 0,
        justifyContent: 'center',
        alignItems: 'center'
      },
      optionsContainerStyle: {
        elevation: 0,
        borderRadius: 16,
        flex: 0,
        width: 'auto',
        marginTop: 32
      },
      customStyles: {
        OptionTouchableComponent: ReactNative.TouchableOpacity
      }
    }, React.default.createElement(reactNativePopupMenu.MenuOption, {
      onSelect: f
    }, React.default.createElement(components.Icon, {
      name: d ? icons.default.HEART : icons.default.HEART_OUTLINE,
      style: {
        margin: 2
      },
      size: 25
    })), React.default.createElement(reactNativePopupMenu.MenuOption, {
      onSelect: l
    }, React.default.createElement(components.Icon, {
      name: icons.default.CONTENT_COPY,
      style: {
        margin: 2
      },
      size: 23
    })), React.default.createElement(reactNativePopupMenu.MenuOption, {
      onSelect: n
    }, React.default.createElement(components.Icon, {
      name: icons.default.LINK_VARIANT,
      style: {
        margin: 2
      },
      size: 25
    })), React.default.createElement(reactNativePopupMenu.MenuOption, {
      onSelect: t
    }, React.default.createElement(components.Icon, {
      name: icons.default.WEB,
      style: {
        margin: 2
      },
      size: 25
    })), React.default.createElement(reactNativePopupMenu.MenuOption, {
      onSelect: a
    }, React.default.createElement(components.Icon, {
      name: icons.default.SHARE_VARIANT_OUTLINE,
      style: {
        margin: 2
      },
      size: 25
    }))));
  };
exports.default = d;
