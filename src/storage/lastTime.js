import {storage} from './index';
import keys from './keys';

export default {
  async get() {
    try {
      return await storage.load({key: keys.lastPlayedTime});
    } catch (error) {
      if (error.name === 'NotFoundError') return 0;
      throw error;
    }
  },
  save(seconds = 0) {
    return storage.save({key: keys.lastPlayedTime, data: seconds});
  },
};
