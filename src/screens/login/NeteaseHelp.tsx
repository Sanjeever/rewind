import Text from './../../components/Text';
import * as React from 'react';
import * as ReactNative from 'react-native';
import * as components from '../../components/index';
import * as constants from '../../theme/constants';
import icons from '../../theme/icons';
class NeteaseHelp extends React.PureComponent<{isOpen: boolean; onRequestClose(): void}> {
  render() {
    const props = this.props;
    const {isOpen, onRequestClose} = props;
    return (
      <ReactNative.Modal visible={isOpen} onRequestClose={onRequestClose} animationType={'fade'}>
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
                "1.当使用QQ登入或微博登入时，可能会看到 { code:401, msg:'授权出现异常' } 相关提示，请返回登入界面点击登出后重试。\n                  \n2.无法登入的原因一般有：\n                  \n\ti.设置了登入保护（网易云音乐 - 设置 - 登入保护 - 关闭）\n                  \n\tii.登入超时（当用邮箱或手机号登入时需要跑网易云登入算法，过量请求有时候会被拒绝）\n                  \n\tiii.重复登入（即使用不同端登入时冲突，会被拒绝访问）\n              "
              }
            </Text>
          </ReactNative.View>
        </ReactNative.View>
      </ReactNative.Modal>
    );
  }
}
export default NeteaseHelp;
