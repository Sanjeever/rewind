import names from './names';
import * as events from './index';
import * as utils from '../utils/index';
import type {TrackId} from '../services/track';
import type {Provider} from '../services/providers';
const o = {
  playMV: function (mvid: TrackId, api: Provider) {
    events.emitter.emit(names.AUDIO_NOISY);
    utils.universalNavigator.navigate('Video', {
      mvid,
      api,
    });
  },
};
export default o;
