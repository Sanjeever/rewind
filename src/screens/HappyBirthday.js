import Text from './../components/Text';
import * as React from 'react';
import * as ReactNative from 'react-native';
import * as utils from '../utils/index';
class HappyBirthday extends React.PureComponent {
  state = {
    avatarUrl: null,
    nickname: null,
    living: null,
  };
  onCake = () => {
    this.props.navigation.navigate('SearchPage', {
      text: '生日快乐',
    });
  };
  componentDidMount() {
    const params = this.props.route.params;
    if (params) {
      const t = params.profile;
      const {birthday, avatarUrl, nickname} = t;
      this.setState({
        avatarUrl,
        nickname,
        living: utils.timeFormatter.diffInDays(new Date(birthday), new Date()),
      });
    }
  }
  render() {
    const state = this.state;
    const {avatarUrl, nickname, living} = state;
    return (
      <ReactNative.View style={c.container}>
        <ReactNative.StatusBar hidden={true} />
        {avatarUrl && (
          <ReactNative.Image
            source={{
              uri: avatarUrl,
            }}
            style={c.avatar}
          />
        )}
        {nickname && <Text style={c.normal}>{nickname}</Text>}
        <ReactNative.TouchableOpacity onPress={this.onCake}>
          <Text
            style={[
              c.text,
              {
                marginVertical: 32,
              },
            ]}
          >
            {'生日快乐'}
            {'\n'}
            {'🎂'}
          </Text>
        </ReactNative.TouchableOpacity>
        {living && (
          <Text
            style={[
              c.normal,
              {
                opacity: 0.5,
              },
            ]}
          >
            {'你已存在 '}
            {living}
            {' 天'}
          </Text>
        )}
      </ReactNative.View>
    );
  }
}
var c = ReactNative.StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 32,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  normal: {
    fontSize: 20,
  },
  avatar: {
    height: 88,
    width: 88,
    borderRadius: 44,
  },
});
export default HappyBirthday;
