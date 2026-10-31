import Text from './../components/Text';
import * as React from 'react';
import * as ReactNative from 'react-native';
import * as components from '../components/index';
class CommentCard extends React.PureComponent {
  render() {
    const props = this.props;
    const {content, time, userName, userAvatar, beReplieds, onUserInfo, item} = props;
    return (
      <ReactNative.View style={c.comment}>
        <ReactNative.View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <ReactNative.TouchableOpacity
            onPress={function () {
              return onUserInfo(item);
            }}
          >
            <ReactNative.View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ReactNative.Image
                source={{
                  uri: userAvatar,
                }}
                style={c.userAvatar}
              />
            </ReactNative.View>
          </ReactNative.TouchableOpacity>
          <ReactNative.View style={c.nickItem}>
            <components.Selectable
              onCopy={() => {
                return this.copy(userName);
              }}
              style={c.nickname}
            >
              {userName}
            </components.Selectable>
            <Text style={c.timestamp}>{time}</Text>
          </ReactNative.View>
        </ReactNative.View>
        <ReactNative.View style={c.content}>
          <components.Selectable style={c.subtitle}>{content}</components.Selectable>
          {beReplieds
            ? beReplieds.map((e, key) => (
                <ReactNative.View style={c.replied} key={key}>
                  <ReactNative.View style={c.repliedUser}>
                    <ReactNative.TouchableOpacity
                      onPress={function () {
                        return onUserInfo(e);
                      }}
                    >
                      <ReactNative.Image
                        source={{
                          uri: `${e.user.avatarUrl}?param=100y100`,
                        }}
                        style={c.repliedAvatar}
                      />
                    </ReactNative.TouchableOpacity>
                    <components.Selectable>{e.user.nickname}</components.Selectable>
                  </ReactNative.View>
                  <components.Selectable style={c.subtitle}>{e.content}</components.Selectable>
                </ReactNative.View>
              ))
            : null}
        </ReactNative.View>
      </ReactNative.View>
    );
  }
}
export default CommentCard;
var c = ReactNative.StyleSheet.create({
  comment: {
    paddingHorizontal: 20,
    marginTop: 15,
  },
  content: {
    flex: 1,
    paddingLeft: 45,
  },
  nickItem: {
    marginLeft: 10,
  },
  replied: {
    borderColor: '#eee',
    borderWidth: ReactNative.StyleSheet.hairlineWidth,
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
  },
  subtitle: {
    opacity: 0.9,
    fontSize: 14,
    lineHeight: 20,
  },
  userAvatar: {
    height: 35,
    width: 35,
    borderRadius: 17.5,
  },
  repliedUser: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  repliedAvatar: {
    height: 30,
    width: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  timestamp: {
    marginBottom: 5,
    fontSize: 12,
    opacity: 0.8,
  },
  nickname: {
    fontWeight: 'bold',
    fontSize: 15,
  },
});
