const _interopRequireWildcard = require('@babel/runtime/helpers/interopRequireWildcard');
const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');
Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;
var React = _interopRequireWildcard(require('react')),
  ReactNative = require('react-native'),
  reactNativeAnimatable = _interopRequireWildcard(require('react-native-animatable')),
  rnFetchBlob = _interopRequireDefault(require('react-native-blob-util')),
  constants = require('../theme/constants'),
  paths = require('../storage/paths'),
  names = _interopRequireDefault(require('../events/names')),
  locales = _interopRequireDefault(require('../locales/index')),
  events = require('../events/index'),
  m =
    'alipays://platformapi/startapp?saId=10000007&qrcode=https://qr.alipay.com/fkx05853auiq7gkm8jbmccb',
  b = 'https://s2.ax1x.com/2020/02/27/301NcV.jpg',
  h = class t extends React.PureComponent {
    constructor() {
      var e, a, n;
      for (var o = arguments.length, l = new Array(o), r = 0; r < o; r++) l[r] = arguments[r];
      return (
        (a = n = super(...l)),
        (n.state = {
          img: '',
          song: '',
          mainModalShow: false,
          type: '',
        }),
        (n.sponsorSave = function () {
          return n.downloadSource(b, 'thanks.jpg', '赞赏码');
        }),
        (n.saveTo = async function () {
          var e = n.state,
            t = e.img,
            a = e.song;
          try {
            if ('sponsor' !== e.type) {
              if (!t) throw new Error('封面地址为空');
              var o = a + '_' + String(Date.now()),
                l = t.replace(/\?param=.+y.+/gi, '');
              await n.downloadSource(l, o.replace(/[\\/:*?"<>|]/g, '_') + '.jpg', '封面');
            } else {
              await n.sponsorSave();
            }
            n.onClosed();
          } catch (error) {
            toast(locales.default.SAVE_FAILED + '：' + error.message);
          }
        }),
        (n.downloadSource = async function (source, name, folder) {
          const temporary = paths.cache_dir + 'cover-' + Date.now() + '.jpg';
          try {
            let path = source;
            if (source.startsWith('data:image/')) {
              await rnFetchBlob.default.fs.writeFile(
                temporary,
                source.slice(source.indexOf(',') + 1),
                'base64',
              );
              path = temporary;
            } else if (/^https?:/.test(source)) {
              const response = await rnFetchBlob.default
                .config({path: temporary})
                .fetch('GET', source);
              const status = response.info().status;
              if (status < 200 || status >= 300) throw new Error('HTTP ' + status);
              path = temporary;
            }
            await require('../native/mediaStore').default.publish(path, name, 'image/jpeg', folder);
          } finally {
            if (await rnFetchBlob.default.fs.exists(temporary))
              await rnFetchBlob.default.fs.unlink(temporary);
          }
        }),
        (n.onClosed = function () {
          n.setState({
            img: '',
            mainModalShow: false,
            type: '',
          });
        }),
        (n.onAliPay = function () {
          ReactNative.Linking.openURL(m);
        }),
        a
      );
    }
    componentDidMount() {
      var e = this;
      this.sub = events.emitter.addListener(names.default.SavePicModal, function (t) {
        e.setState({
          img: t.img,
          song: t.song,
          type: t.type || '',
          mainModalShow: true,
        });
      });
    }
    componentWillUnmount() {
      var e, t;
      null === (e = (t = this.sub).remove) || void 0 === e || e.call(t);
    }
    render() {
      var e = this.state,
        t = e.type,
        a = e.img;
      return React.default.createElement(
        ReactNative.Modal,
        {
          animationType: 'fade',
          transparent: true,
          visible: this.state.mainModalShow,
          onRequestClose: this.onClosed,
        },
        React.default.createElement(
          ReactNative.View,
          {
            style: g.container,
          },
          React.default.createElement(
            ReactNative.TouchableWithoutFeedback,
            {
              onPress: this.onClosed,
            },
            React.default.createElement(ReactNative.View, {
              style: [ReactNative.StyleSheet.absoluteFill],
            }),
          ),
          '' !== a
            ? React.default.createElement(reactNativeAnimatable.Image, {
                animation: 'zoomIn',
                source: {
                  uri: a,
                },
                style: g.img,
              })
            : null,
          'sponsor' === t
            ? React.default.createElement(reactNativeAnimatable.Image, {
                animation: 'zoomIn',
                source: {
                  uri: b,
                },
                style: g.img,
              })
            : null,
          React.default.createElement(
            ReactNative.TouchableOpacity,
            {
              style: g.btn,
              onPress: this.saveTo,
            },
            React.default.createElement(
              reactNativeAnimatable.Text,
              {
                animation: 'fadeInUp',
              },
              locales.default.SAVE,
            ),
          ),
          'sponsor' === t
            ? React.default.createElement(
                ReactNative.TouchableOpacity,
                {
                  onPress: this.onAliPay,
                },
                React.default.createElement(
                  reactNativeAnimatable.Text,
                  {
                    animation: 'fadeIn',
                    style: [
                      {
                        marginTop: 20,
                      },
                    ],
                  },
                  locales.default.ALI_PAY,
                ),
              )
            : null,
        ),
      );
    }
  },
  g = ReactNative.StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.9)',
    },
    btn: {
      marginTop: 25,
      alignItems: 'center',
      width: 100,
      padding: 10,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#fff',
    },
    img: {
      width: 0.8 * constants.DEVICE_WIDTH,
      height: 0.8 * constants.DEVICE_WIDTH,
      borderRadius: 5,
    },
  }),
  y = h;
exports.default = y;
