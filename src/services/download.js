const _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var ReactNative = require("react-native"),
  rnFetchBlob = _interopRequireDefault(require("react-native-blob-util")),
  providers = _interopRequireDefault(require("./providers")),
  locales = _interopRequireDefault(require("../locales/index")),
  services = require("./index"),
  utils = require("../utils/index"),
  audioTagger = _interopRequireDefault(require("../native/audioTagger")),
  mediaStore = _interopRequireDefault(require('../native/mediaStore')),
  d = {
    netEase: 'netease',
    qqMusic: 'qqmusic'
  },
  m = function (e, t) {
    var r;
    switch (t) {
      case providers.default.netEase:
        r = e.replace(/param=100y100/gi, 'param=1500y1500');
        break;
      case providers.default.qqMusic:
        r = e.replace(/T001R150x150M000/gi, 'T001R500x500M000');
    }
    return r;
  },
  b = async function ({
    url,
    api,
    name,
    obj,
    type = 'mp3'
  }) {
    const directory = require('../storage/paths').cache_dir + 'downloads';
    if (!(await rnFetchBlob.default.fs.isDir(directory))) await rnFetchBlob.default.fs.mkdir(directory);
    const filename = name.replace(/[\\/:*?"<>|]/g, '_') + '.' + type;
    const path = directory + '/' + filename;
    const response = await rnFetchBlob.default.config({
      path
    }).fetch('GET', url);
    const status = response.info().status;
    if (status < 200 || status >= 300) throw new Error('音乐下载失败：HTTP ' + status);
    await audioTagger.default.commit(path, {
      title: obj.song,
      artist: utils.parseArtist(obj.singer),
      album: obj.album,
      image: obj.img ? m(obj.img, api) : null
    });
    const mime = type === 'flac' ? 'audio/flac' : type === 'm4a' ? 'audio/mp4' : 'audio/mpeg';
    await mediaStore.default.publish(path, filename, mime, d[api]);
    await rnFetchBlob.default.fs.unlink(path);
    toast(locales.default.CLONE_DONE + '：Music/rewind/' + d[api] + '/' + filename);
  },
  g = function (e, t) {
    var r = null;
    switch (t) {
      case providers.default.netEase:
        r = e.data[0].url;
        break;
      case providers.default.qqMusic:
        r = e;
    }
    return r;
  },
  x = async function (name, id, api, obj, external) {
    const response = await services.Netease.musicUrl({
      id
    });
    if (!utils.usable(response)) throw new Error('未取得下载地址');
    const url = g(response, api);
    if (!url) throw new Error('歌曲当前不可下载');
    return external === true ? w(url) : b({
      url,
      api,
      name,
      obj,
      type: response.data[0].type
    });
  },
  R = async function (name, id, api, obj, external) {
    const response = await services.Netease.freeMusicUrl({
      id
    });
    if (!response) throw new Error('未取得下载地址');
    if (!utils.usable(response)) return x(name, id, api, obj, external);
    let url = g(response, api),
      type;
    if (url) type = response.data[0].type;else {
      url = await services.provider.getUrlFromOther(obj);
      type = 'mp3';
    }
    if (!url) throw new Error('歌曲当前不可下载');
    return external === true ? w(url) : b({
      url,
      api,
      name,
      obj,
      type
    });
  },
  v = async function (name, id, api, obj, external) {
    let url;
    let primaryError;
    try {
      url = g(await services.QQMusic.getMusicUrl(id), api);
    } catch (error) { primaryError = error; }
    if (!url) {
      try {
        url = await services.provider.getUrlFromOther(obj, providers.default.qqMusic);
        if (!url) throw new Error('歌曲当前不可下载');
      } catch (error) {
        throw new Error(primaryError ? primaryError.message + '；备用音源：' + error.message : error.message);
      }
    }
    return external === true ? w(url) : b({
      url,
      api,
      name,
      obj
    });
  },
  w = function (e) {
    ReactNative.Linking.openURL(e);
  },
  h = {
    download: async function (name, id, api, obj, external) {
      toast(locales.default.CLONING);
      try {
        if (api === providers.default.netEase) return await R(name, id, api, obj, external);
        if (api === providers.default.qqMusic) return await v(name, id, api, obj, external);
      } catch (error) {
        toast('下载失败：' + error.message);
      }
    }
  };
exports.default = h;
