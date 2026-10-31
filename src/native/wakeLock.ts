import {device} from './info';
export default {
  activate: () => device.keepScreenOn(true),
  deactivate: () => device.keepScreenOn(false),
};
