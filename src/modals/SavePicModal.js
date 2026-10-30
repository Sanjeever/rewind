Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  reactNativeAnimatable = babelHelpers.interopRequireWildcard(require("react-native-animatable")),
  rnFetchBlob = babelHelpers.interopRequireDefault(require("rn-fetch-blob")),
  constants = require("../theme/constants"),
  paths = require("../storage/paths"),
  names = babelHelpers.interopRequireDefault(require("../events/names")),
  locales = babelHelpers.interopRequireDefault(require("../locales/index")),
  events = require("../events/index"),
  m = 'alipays://platformapi/startapp?saId=10000007&qrcode=https://qr.alipay.com/fkx05853auiq7gkm8jbmccb',
  b = 'https://s2.ax1x.com/2020/02/27/301NcV.jpg',
  h = function (e) {
    function t() {
      var e, a, n;
      babelHelpers.classCallCheck(this, t);
      for (var o = arguments.length, l = new Array(o), r = 0; r < o; r++) l[r] = arguments[r];
      return babelHelpers.possibleConstructorReturn(n, (a = n = babelHelpers.possibleConstructorReturn(this, (e = babelHelpers.getPrototypeOf(t)).call.apply(e, [this].concat(l))), n.state = {
        img: '',
        song: '',
        mainModalShow: false,
        type: ''
      }, n.sponsorSave = function () {
        var e = paths.picture_dir + '/rewind/\u8d5e\u8d4f\u7801/thanks.jpg';
        n.downloadSource(b, e);
        toast(n.downloadTip(e));
      }, n.saveTo = function () {
        var e = n.state,
          t = e.img,
          a = e.song;
        if ('sponsor' !== e.type) {
          if ('' !== t) {
            var o = a + '_' + String(Date.now()),
              l = t.replace(/\?param=.+y.+/gi, ''),
              i = paths.picture_dir + '/rewind/\u5c01\u9762/' + o + '.jpg';
            n.downloadSource(l, i);
            toast(n.downloadTip(i));
          }
        } else n.sponsorSave();
      }, n.downloadSource = function (e, t) {
        rnFetchBlob.default.config({
          path: t
        }).fetch('GET', e).then(function (e) {
          return rnFetchBlob.default.fs.scanFile([{
            path: e.path(),
            mime: 'image/*'
          }]);
        }).catch(function () {
          toast(locales.default.SAVE_FAILED);
        });
      }, n.downloadTip = function (e) {
        return locales.default.SAVE_COVER_TO + "\uff1a" + e;
      }, n.onClosed = function () {
        n.setState({
          img: '',
          mainModalShow: false,
          type: ''
        });
      }, n.onAliPay = function () {
        ReactNative.Linking.openURL(m);
      }, a));
    }
    babelHelpers.createClass(t, [{
      key: "componentDidMount",
      value: function () {
        var e = this;
        this.sub = events.emitter.addListener(names.default.SavePicModal, function (t) {
          e.setState({
            img: t.img,
            song: t.song,
            type: t.type || '',
            mainModalShow: true
          });
        });
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
        var e = this.state,
          t = e.type,
          a = e.img;
        return React.default.createElement(ReactNative.Modal, {
          animationType: "fade",
          transparent: true,
          visible: this.state.mainModalShow,
          onRequestClose: this.onClosed
        }, React.default.createElement(ReactNative.View, {
          style: g.container
        }, React.default.createElement(ReactNative.TouchableWithoutFeedback, {
          onPress: this.onClosed
        }, React.default.createElement(ReactNative.View, {
          style: [ReactNative.StyleSheet.absoluteFill]
        })), '' !== a ? React.default.createElement(reactNativeAnimatable.Image, {
          animation: "zoomIn",
          source: {
            uri: a
          },
          style: g.img
        }) : null, 'sponsor' === t ? React.default.createElement(reactNativeAnimatable.Image, {
          animation: "zoomIn",
          source: {
            uri: b
          },
          style: g.img
        }) : null, React.default.createElement(ReactNative.TouchableOpacity, {
          style: g.btn,
          onPress: this.saveTo
        }, React.default.createElement(reactNativeAnimatable.Text, {
          animation: "fadeInUp"
        }, locales.default.SAVE)), 'sponsor' === t ? React.default.createElement(ReactNative.TouchableOpacity, {
          onPress: this.onAliPay
        }, React.default.createElement(reactNativeAnimatable.Text, {
          animation: "fadeIn",
          style: [{
            marginTop: 20
          }]
        }, locales.default.ALI_PAY)) : null));
      }
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(React.PureComponent),
  g = ReactNative.StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.9)'
    },
    btn: {
      marginTop: 25,
      alignItems: 'center',
      width: 100,
      padding: 10,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#fff'
    },
    img: {
      width: .8 * constants.DEVICE_WIDTH,
      height: .8 * constants.DEVICE_WIDTH,
      borderRadius: 5
    }
  }),
  y = h;
exports.default = y;
