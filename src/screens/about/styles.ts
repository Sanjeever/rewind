import * as ReactNative from 'react-native';
import * as constants from '../../theme/constants';
const d = ReactNative.StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 15,
  },
  title: {
    padding: 5,
  },
  avatar: {
    marginLeft: 5,
    height: 60,
    width: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  borderLine: {
    borderWidth: 1,
    borderColor: constants.COLORS.secondary,
  },
  itemStyle: {
    width: '100%',
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
    paddingVertical: 5,
  },
  osCon: {
    flex: 1,
    marginBottom: 10,
    padding: 5,
    height: 60,
  },
  lottieView: {
    height: 128,
    width: 128,
    marginBottom: -5,
  },
  lottieContainer: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 20,
  },
  version: {
    fontWeight: 'bold',
  },
});
export default d;
