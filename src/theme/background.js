import * as _appStorage from './../storage/index';
import keys from '../storage/keys';
import * as files from '../storage/files';
let o = {};
let i = false;
export const getBackground = function () {
  if (i) {
    return o;
  }
  return initBackgroundState();
};
export var initBackgroundState = async () => {
  try {
    const background = await _appStorage.storage.load({
      key: keys.background,
    });
    o =
      typeof background.path === 'string'
        ? {
            url: background.path,
            opacity: background.opacity,
            blur: background.blur,
            error: false,
          }
        : await p();
    return o;
  } catch (error) {
    if (error.name !== 'NotFoundError') {
      throw error;
    }
    o = {
      error: true,
    };
    return o;
  } finally {
    i = true;
  }
};
var p = () =>
  files.getBackgroundCache().then((url) => {
    if (url) {
      return {
        url,
        opacity: 0.7,
      };
    }
    return {
      error: true,
    };
  });
