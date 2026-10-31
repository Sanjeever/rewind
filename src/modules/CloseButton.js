import 'react';
import * as ReactNative from 'react-native';
import * as components from '../components/index';
import * as constants from '../theme/constants';
import icons from '../theme/icons';
const SComponent = function ({onPress, isRound}) {
  return (
    <ReactNative.View
      style={{
        height: 150,
        width: 150,
        position: 'absolute',
        top: 0,
      }}
    >
      <ReactNative.TouchableOpacity
        onPress={onPress}
        style={[
          {
            position: 'absolute',
            right: 10,
            bottom: 10,
            height: 15,
            width: 20,
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'center',
            borderRadius: 5,
            borderWidth: 1,
            borderColor: constants.COLORS.secondary,
            backgroundColor: '#111',
          },
          isRound && {
            backgroundColor: 'transparent',
            right: 15,
          },
        ]}
      >
        <components.Icon name={icons.PLAY} size={12} />
      </ReactNative.TouchableOpacity>
    </ReactNative.View>
  );
};
export default SComponent;
