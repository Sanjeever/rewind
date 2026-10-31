import names from './names';
import * as events from './index';
import * as utils from '../utils/index';
const o = {
  playMV: function (mvid, api) {
    events.emitter.emit(names.AUDIO_NOISY);
    utils.universalNavigator.navigate('Video', {
      mvid,
      api,
    });
  },
};
export default o;
