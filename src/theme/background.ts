import * as _appStorage from './../storage/index';
import keys from '../storage/keys';
import * as files from '../storage/files';
export interface BackgroundState {
  url?: string;
  opacity?: number;
  blur?: boolean;
  error?: boolean;
}
let o: BackgroundState = {};
let i = false;
export const getBackground = function () {
  if (i) {
    return o;
  }
  return initBackgroundState();
};
export const initBackgroundState = async () => {
  try {
    const background = await _appStorage.storage.load<{
      path?: string;
      opacity?: number;
      blur?: boolean;
    }>({
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
    if (!(error instanceof Error && error.name === 'NotFoundError')) {
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
const p = () =>
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
