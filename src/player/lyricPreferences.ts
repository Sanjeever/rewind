import {storage} from '../storage';
import keys from '../storage/keys';
import type {PlayMode} from './types';
interface Preferences {
  showTrans?: boolean;
  showTool?: boolean;
  lyricFontSize?: number;
  playMode?: PlayMode;
}

export default {
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
