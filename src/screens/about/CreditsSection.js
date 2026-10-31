import Text from './../../components/Text';
import 'react';
import * as ReactNative from 'react-native';
import styles from './styles';
const NComponent = function ({onPress, renderAvatar, title, subtitle}) {
  return (
    <ReactNative.TouchableNativeFeedback onPress={onPress}>
      <ReactNative.View style={styles.itemStyle}>
        {renderAvatar()}
        <ReactNative.View
          style={{
            paddingHorizontal: 10,
            flex: 1,
          }}
        >
          <Text
            style={[
              styles.text,
              {
                opacity: 0.8,
                fontWeight: 'bold',
              },
            ]}
          >
            {title}
          </Text>
          <Text
            style={[
              styles.text,
              {
                opacity: 0.6,
              },
            ]}
          >
            / {subtitle} /
          </Text>
        </ReactNative.View>
      </ReactNative.View>
    </ReactNative.TouchableNativeFeedback>
  );
};
export default NComponent;
