import {storage} from '../storage';
import {toast} from '../native/toast';
import keys from '../storage/keys';
import type {PlayMode} from './types';
interface Preferences {
  showTrans?: boolean;
  showTool?: boolean;
  lyricFontSize?: number;
  playMode?: PlayMode;
}

export default {
  save(key: string, data: boolean | number | PlayMode) {
    return storage.save({key, data}).catch((error) => toast('保存播放设置失败：' + error.message));
  },
  async loadAll() {
    const preferences: Preferences = {};
    const fields = {
      showTrans: keys.showTrans,
      showTool: keys.showToolBtnStatus,
      lyricFontSize: keys.lyricFontSize,
      playMode: keys.lastPlayMode,
    };
    await Promise.all(
      (Object.keys(fields) as (keyof Preferences)[]).map(async (field) => {
        try {
          const key = fields[field];
          if (field === 'playMode') preferences.playMode = await storage.load<PlayMode>({key});
          else if (field === 'lyricFontSize')
            preferences.lyricFontSize = await storage.load<number>({key});
          else preferences[field] = await storage.load<boolean>({key});
        } catch (error) {
          if (!(error instanceof Error && error.name === 'NotFoundError')) throw error;
        }
      }),
    );
    return preferences;
  },
};
