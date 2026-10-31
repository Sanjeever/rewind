import * as ReactNative from 'react-native';
import * as constants from '../theme/constants';
import dimensions from '../native/dimensions';
export const SOFT_MENU_HEIGHT = dimensions.get('SOFT_MENU_BAR_HEIGHT');
export const BOTTOM_BAR_HEIGHT = 60;
const d = ReactNative.StyleSheet.create({
  container: {
    height: 60,
    width: '100%',
    alignSelf: 'center',
    backgroundColor: '#000000',
    elevation: 10,
  },
  text: {
    color: '#fff',
  },
  footer: {
    position: 'absolute',
    bottom: 10,
    height: 150,
    justifyContent: 'center',
    paddingBottom: 10 + SOFT_MENU_HEIGHT,
  },
  softKeyFooterHeight: {
    bottom: 20,
  },
  progressBar: {
    height: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    width: constants.DEVICE_WIDTH,
    position: 'absolute',
    top: constants.DEVICE_WIDTH,
  },
  toolBar: {
    alignSelf: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    width: constants.DEVICE_WIDTH,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  lyric: {
    position: 'absolute',
    height: constants.DEVICE_HEIGHT - 130,
    top: 0,
    alignItems: 'center',
    width: constants.DEVICE_WIDTH,
  },
  songTitleCon: {
    position: 'absolute',
    width: constants.DEVICE_WIDTH,
    top: constants.STATUS_BAR_HEIGHT - 5,
    justifyContent: 'center',
    paddingLeft: 45,
    paddingRight: 50,
  },
  songTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  songAuthor: {
    opacity: 0.8,
  },
  topBtn: {
    position: 'absolute',
    top: constants.STATUS_BAR_HEIGHT,
    height: 30,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  totalTool: {
    position: 'absolute',
    top: constants.DEVICE_WIDTH - 50,
    height: 50,
    width: '100%',
  },
  sliderHide: {
    top: null,
    bottom: 0,
  },
  toolHide: {
    height: '100%',
    paddingBottom: 30,
  },
  blankLyric: {
    position: 'absolute',
    bottom: SOFT_MENU_HEIGHT + 30,
    alignSelf: 'center',
    opacity: 1,
    alignItems: 'center',
  },
  roundStyle: {
    opacity: 0.8,
    top: null,
  },
  soft: {
    bottom: SOFT_MENU_HEIGHT,
  },
  softPadding: {
    paddingBottom: SOFT_MENU_HEIGHT,
  },
  timeSoftPadding: {
    bottom: SOFT_MENU_HEIGHT > 30 ? (SOFT_MENU_HEIGHT - 30) / 2 : 0,
  },
  vertical: {
    position: 'absolute',
    height: constants.DEVICE_HEIGHT - constants.DEVICE_WIDTH,
    bottom: 0,
    left: 0,
    width: 0.15 * constants.DEVICE_WIDTH,
    backgroundColor: 'rgba(255,255,255,0)',
  },
});
export default d;
