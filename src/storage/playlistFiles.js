Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var rnFetchBlob = babelHelpers.interopRequireDefault(require("rn-fetch-blob")),
  paths = require("./paths"),
  r = function (t) {
    var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : paths.playlist_dir;
    return rnFetchBlob.default.fs.isDir(e).then(function (n) {
      n ? rnFetchBlob.default.fs.createFile(t, JSON.stringify({
        playlists: []
      }), 'utf8').then(function () {}) : rnFetchBlob.default.fs.mkdir(e).then(function () {
        rnFetchBlob.default.fs.createFile(t, JSON.stringify({
          playlists: []
        }), 'utf8').then(function () {});
      }).catch(function () {});
    });
  },
  a = {
    getPlaylist: function () {
      var t = paths.playlist_dir + '/playlist.json';
      return rnFetchBlob.default.fs.exists(t).then(function (e) {
        if (e) return rnFetchBlob.default.fs.readFile(t, 'utf8').then(function (t) {
          return JSON.parse(t);
        }).catch(function (t) {
          return t;
        });
        r(t).then(function () {
          return {
            playlists: []
          };
        });
      }).catch(function (t) {
        return t;
      });
    },
    toPlaylist: function (t) {
      if ('object' == typeof t) {
        var e = JSON.stringify(t),
          n = paths.playlist_dir + '/playlist.json';
        rnFetchBlob.default.fs.writeFile(n, e, 'utf8');
      }
    }
  };
exports.default = a;
