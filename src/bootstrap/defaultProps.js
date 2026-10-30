var ReactNative = require("react-native"),
  reactNativeSpringScrollview = require("react-native-spring-scrollview"),
  reactNativeTextTicker = babelHelpers.interopRequireDefault(require("react-native-text-ticker")),
  components = require("../components/index"),
  TabbedViewPager = babelHelpers.interopRequireDefault(require("../native/TabbedViewPager")),
  constants = require("../theme/constants"),
  setDefaultProps = babelHelpers.interopRequireDefault(require("../utils/setDefaultProps")),
  utils = require("../utils/index");
(0, setDefaultProps.default)(components.Icon, {
  color: constants.COLORS.primary
});
(0, setDefaultProps.default)(ReactNative.Text, {
  style: {
    color: constants.COLORS.primary
  }
});
(0, setDefaultProps.default)(ReactNative.TouchableNativeFeedback, {
  background: (0, utils.getRipple)(constants.COLORS.primaryAlpha20, false)
});
(0, setDefaultProps.default)(TabbedViewPager.default, {
  tabMode: 'fixed',
  tabGravity: 'fill',
  tabBackground: 0,
  tabIndicatorColor: constants.COLORS.primary,
  tabIndicatorHeight: 2,
  tabTextColor: constants.COLORS.primaryAlpha70,
  tabSelectedTextColor: constants.COLORS.primary,
  tabElevation: 3,
  style: {
    flex: 1,
    width: '100%',
    height: '100%'
  },
  initialPage: 0
});
(0, setDefaultProps.default)(reactNativeSpringScrollview.SpringScrollView, {
  showsVerticalScrollIndicator: false,
  showsHorizontalScrollIndicator: false
});
(0, setDefaultProps.default)(reactNativeTextTicker.default, {
  duration: 1e4,
  repeatSpacer: 50,
  marqueeDelay: 2e3
});
