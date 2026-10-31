import * as _appStorage from './../storage/index.js';
import keys from '../storage/keys';
export const check = async () => {
  try {
    return await _appStorage.storage.load({
      key: keys.firstTime,
    });
  } catch (error) {
    if (error.name !== 'NotFoundError') {
      throw error;
    }
    await s();
    return true;
  }
};
var s = () =>
  _appStorage.storage.save({
    key: keys.firstTime,
    data: false,
  });
const i = {
  check,
};
export default i;
