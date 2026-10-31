import {schedulePlaybackStop} from '../player/commands';
import * as utils from './index';
import * as types from './types';
const l = {
  open: async function () {
    const minutes = await utils.dialogs.showTimePicker();
    if (types.isNumber(minutes)) {
      schedulePlaybackStop(minutes);
    }
  },
};
export default l;
