const _interopRequireWildcard = require('@babel/runtime/helpers/interopRequireWildcard');
Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;
var React = _interopRequireWildcard(require('react')),
  reactNativeSpringScrollview = require('./../components/Scrolling.js'),
  components = require('../components/index'),
  u = class r extends React.Component {
    constructor() {
      var e, t, n;
      for (var l = arguments.length, i = new Array(l), u = 0; u < l; u++) i[u] = arguments[u];
      return (
        (t = n = super(...i)),
        (n.onTop = function () {
          var e, r;
          null === (e = (r = n._scrollView).scrollToBegin) || void 0 === e || e.call(r);
        }),
        (n.formatAudioName = function (e) {
          return e.replace(/\.mp3/, '');
        }),
        (n._renderItem = function (e) {
          var r = e.item,
            t = e.index;
          return React.default.createElement(components.SongRow, {
            key: t,
            song: n.formatAudioName(r.filename || r.title || r.album || r.artist),
            singer: true !== n.props.nosinger && (r.singer || r.artist),
            onPress: function () {
              return n.props.playMusic(r, t);
            },
            index: t,
            addToQueue: function () {
              return n.props.addToQueue(r);
            },
            detail: function () {
              return n.props.onDetail(r, t);
            },
          });
        }),
        t
      );
    }
    render() {
      var e = this,
        r = this.props.data;
      return r
        ? React.default.createElement(
            reactNativeSpringScrollview.SpringScrollView,
            {
              ref: function (r) {
                return (e._scrollView = r);
              },
            },
            r.map(function (r, t) {
              return e._renderItem({
                item: r,
                index: t,
              });
            }),
          )
        : React.default.createElement(components.Spinkit, null);
    }
  };
exports.default = u;
