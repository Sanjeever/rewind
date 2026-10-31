import {toast} from '../native/toast';
import * as ReactNative from 'react-native';
import rnFetchBlob from 'react-native-blob-util';
import providers from './providers';
import locales from '../locales/index';
import * as services from './index';
import * as utils from '../utils/index';
import audioTagger from '../native/audioTagger';
import mediaStore from '../native/mediaStore';
import {cache_dir as _paths} from '../storage/paths';
const d = {
  netEase: 'netease',
  qqMusic: 'qqmusic',
};
const m = function (img, api) {
  let r;
  switch (api) {
    case providers.netEase:
      r = img.replace(/param=100y100/gi, 'param=1500y1500');
      break;
    case providers.qqMusic:
      r = img.replace(/T001R150x150M000/gi, 'T001R500x500M000');
  }
  return r;
};
const b = async ({url, api, name, obj, type = 'mp3'}) => {
  const directory = `${_paths}downloads`;
  if (!(await rnFetchBlob.fs.isDir(directory))) {
    await rnFetchBlob.fs.mkdir(directory);
  }
  const filename = `${name.replace(/[\\/:*?"<>|]/g, '_')}.${type}`;
  const path = `${directory}/${filename}`;
  const response = await rnFetchBlob
    .config({
      path,
    })
    .fetch('GET', url);
  const status = response.info().status;
  if (status < 200 || status >= 300) {
    throw new Error(`音乐下载失败：HTTP ${status}`);
  }
  await audioTagger.commit(path, {
    title: obj.song,
    artist: utils.parseArtist(obj.singer),
    album: obj.album,
    image: obj.img ? m(obj.img, api) : null,
  });
  const mime = type === 'flac' ? 'audio/flac' : type === 'm4a' ? 'audio/mp4' : 'audio/mpeg';
  await mediaStore.publish(path, filename, mime, d[api]);
  await rnFetchBlob.fs.unlink(path);
  toast(`${locales.CLONE_DONE}：Music/rewind/${d[api]}/${filename}`);
};
const g = function (e, api) {
  let r = null;
  switch (api) {
    case providers.netEase:
      r = e.data[0].url;
      break;
    case providers.qqMusic:
      r = e;
  }
  return r;
};
const x = async (name, id, api, obj, external) => {
  const response = await services.Netease.musicUrl({
    id,
  });
  if (!utils.usable(response)) {
    throw new Error('未取得下载地址');
  }
  const url = g(response, api);
  if (!url) {
    throw new Error('歌曲当前不可下载');
  }
  if (external === true) {
    return w(url);
  }
  return b({
    url,
    api,
    name,
    obj,
    type: response.data[0].type,
  });
};
const R = async (name, id, api, obj, external) => {
  const response = await services.Netease.freeMusicUrl({
    id,
  });
  if (!response) {
    throw new Error('未取得下载地址');
  }
  if (!utils.usable(response)) {
    return x(name, id, api, obj, external);
  }
  let url = g(response, api);
  let type;
  if (url) {
    type = response.data[0].type;
  } else {
    url = await services.provider.getUrlFromOther(obj);
    type = 'mp3';
  }
  if (!url) {
    throw new Error('歌曲当前不可下载');
  }
  if (external === true) {
    return w(url);
  }
  return b({
    url,
    api,
    name,
    obj,
    type,
  });
};
const v = async (name, id, api, obj, external) => {
  let url;
  let primaryError;
  try {
    url = g(await services.QQMusic.getMusicUrl(id), api);
  } catch (error) {
    primaryError = error;
  }
  if (!url) {
    try {
      url = await services.provider.getUrlFromOther(obj, providers.qqMusic);
      if (!url) {
        throw new Error('歌曲当前不可下载');
      }
    } catch (error) {
      throw new Error(
        primaryError ? `${primaryError.message}；备用音源：${error.message}` : error.message,
      );
    }
  }
  if (external === true) {
    return w(url);
  }
  return b({
    url,
    api,
    name,
    obj,
  });
};
var w = function (url) {
  ReactNative.Linking.openURL(url);
};
const h = {
  download: async function (name, id, api, obj, external) {
    toast(locales.CLONING);
    try {
      if (api === providers.netEase) {
        return await R(name, id, api, obj, external);
      }
      if (api === providers.qqMusic) {
        return await v(name, id, api, obj, external);
      }
    } catch (error) {
      toast(`下载失败：${error.message}`);
    }
  },
};
export default h;
