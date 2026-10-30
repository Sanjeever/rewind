import {storage} from '../storage';
import keys from '../storage/keys';

export default {
  async loadAll() {
    const preferences = {};
    const fields = {showTrans: keys.showTrans, showTool: keys.showToolBtnStatus, lyricFontSize: keys.lyricFontSize, playMode: keys.lastPlayMode};
    await Promise.all(Object.entries(fields).map(async ([field, key]) => {
      try {
        preferences[field] = await storage.load({key});
      } catch (error) {
        if (error.name !== 'NotFoundError') throw error;
      }
    }));
    return preferences;
  },
};
