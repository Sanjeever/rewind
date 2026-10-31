import {pausePlayback} from './commands';
import * as utils from '../utils/index';
import type {TrackId} from '../services/track';
import type {Provider} from '../services/providers';
const o = {
  playMV: function (mvid: TrackId, api: Provider) {
    pausePlayback();
    utils.universalNavigator.navigate('Video', {
      mvid,
      api,
    });
  },
};
export default o;
