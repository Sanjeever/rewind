import names from '../events/names';
import * as utils from './index';
import * as types from './types';
import * as events from '../events/index';
const l = {
  open: async function () {
    const minutes = await utils.dialogs.showTimePicker();
    if (types.isNumber(minutes)) {
      events.emitter.emit(names.CloseTimerEvent, minutes);
    }
  },
};
export default l;
