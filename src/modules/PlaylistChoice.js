import Text from './../components/Text';
import 'react';
import 'react-native';
import TouchableScale from '../components/TouchableScale';
const FComponent = function ({onPress, content}) {
  return (
    <TouchableScale onPress={onPress}>
      <Text
        style={{
          fontSize: 18,
          marginTop: '15%',
          marginBottom: 10,
          fontWeight: 'bold',
        }}
      >
        {content}
      </Text>
    </TouchableScale>
  );
};
export default FComponent;
