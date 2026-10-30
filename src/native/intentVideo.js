Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var a = require("react-native").NativeModules.RNIntentVideo,
  l = {
    playVideo: function (e) {
      a.playVideo(e);
    }
  };
exports.default = l;
