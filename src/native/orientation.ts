import {device} from './info';
export default {
  lockToPortrait: () => device.setOrientation(false),
  lockToLandscape: () => device.setOrientation(true),
};
