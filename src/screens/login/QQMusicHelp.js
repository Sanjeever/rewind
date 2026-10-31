import Text from './../../components/Text';
import * as React from 'react';
import * as ReactNative from 'react-native';
import * as components from '../../components/index';
import * as constants from '../../theme/constants';
import icons from '../../theme/icons';
class QQMusicHelp extends React.PureComponent {
  render() {
    const props = this.props;
    const {isOpen, onRequestClose} = props;
    return (
      <ReactNative.Modal
        visible={isOpen}
        backdropOpacity={0.8}
        onRequestClose={onRequestClose}
        position={'center'}
        animationType={'fade'}
      >
        <ReactNative.View
          style={{
            flex: 1,
            padding: 20,
            paddingTop: constants.STATUS_BAR_HEIGHT + 20,
          }}
        >
          <components.Background />
          <ReactNative.View
            style={{
              justifyContent: 'center',
              flexDirection: 'row',
              paddingHorizontal: 10,
            }}
          >
            <components.Icon name={icons.WINDOW_CLOSE} size={25} onPress={onRequestClose} />
          </ReactNative.View>
          <ReactNative.ScrollView
            overScrollMode={'never'}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingTop: 50,
            }}
            style={{
              flex: 1,
            }}
          >
            <ReactNative.View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                }}
              >
                {
                  't.QQ登入成功后无法获取歌单的话，请去QQ音乐官方应用或网页取消私密歌单/他人不可见设置，由于验证问题，开启私密歌单后本应用无法获取到歌单数据。\n                  \n1.输入QQ号获取歌单需要登入才可使用（有时候不用），该接口更新后带有登入验证。\n                  \n2.微信扫码登入需要另一台设备来扫，截图扫描无用。该方式实属鸡肋。（促进消费，人手两台机）\n                  \n3.有关登入状态经常失效：\n                  \n\tq.登入状态的失效会导致编辑歌单等操作的失效，原因是？\n                  \n\ta.QQ音乐和网易云音乐这两端登入的方式大体相同，但QQ音乐网页端似乎无法使登入状态持久化（也有可能只是我做不到而已）。\n                  \n\tq.如何解决或者避免？\n                  \n\ta.目前仍然无解，只能手动重新登入。\n                  '
                }
              </Text>
            </ReactNative.View>
          </ReactNative.ScrollView>
        </ReactNative.View>
      </ReactNative.Modal>
    );
  }
}
export default QQMusicHelp;
