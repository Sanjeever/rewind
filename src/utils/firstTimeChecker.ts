import * as appStorage from './../storage/index';
import keys from '../storage/keys';
export const check = async () => {
  try {
    return await appStorage.storage.load<boolean>({
      key: keys.firstTime,
    });
  } catch (error) {
    if (!(error instanceof Error && error.name === 'NotFoundError')) {
      throw error;
    }
    await s();
    return true;
  }
};
const s = () =>
  appStorage.storage.save({
    key: keys.firstTime,
    data: false,
  });
const i = {
  check,
};
export default i;
