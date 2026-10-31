import React from 'react';
import {Image, Modal, View} from 'react-native';
import qrcode from 'qrcode-generator';
import Text from '../../components/Text';
import TextButton from '../../components/TextButton';
import {Netease} from '../../services';
import type {UserProfile} from '../../navigation/types';
import {errorMessage} from '../../utils/types';

interface Props {
  onClose(): void;
  onLoggedIn(profile: UserProfile): Promise<void>;
}

export default class NeteaseQrLogin extends React.PureComponent<
  Props,
  {image?: string; status: string; retry: boolean}
> {
  state = {image: undefined as string | undefined, status: '正在获取二维码', retry: false};
  request = 0;
  timer?: ReturnType<typeof setTimeout>;

  componentDidMount() {
    this.create();
  }
  componentWillUnmount() {
    this.request++;
    clearTimeout(this.timer);
  }

  create = async () => {
    const request = ++this.request;
    clearTimeout(this.timer);
    this.setState({image: undefined, status: '正在获取二维码', retry: false});
    try {
      const result = await Netease.login_qr_key();
      if (request !== this.request) return;
      if (result.code !== 200 || !result.unikey)
        throw new Error(result.message || '获取二维码失败（' + result.code + '）');
      const code = qrcode(0, 'M');
      code.addData('https://music.163.com/login?codekey=' + encodeURIComponent(result.unikey));
      code.make();
      this.setState({image: code.createDataURL(6, 24), status: '使用网易云音乐扫码', retry: false});
      this.timer = setTimeout(() => this.poll(result.unikey!, request), 2000);
    } catch (error) {
      if (request === this.request) this.setState({status: errorMessage(error), retry: true});
    }
  };

  poll = async (key: string, request: number) => {
    try {
      const result = await Netease.login_qr_check(key);
      if (request !== this.request) return;
      if (result.code === 803) {
        const account = await Netease.login_status();
        if (request !== this.request) return;
        if (account.code !== 200 || !account.profile) throw new Error('登录确认后未取得账号资料');
        await this.props.onLoggedIn(account.profile);
        return;
      }
      if (result.code === 800) {
        this.setState({status: '二维码已过期', retry: true});
        return;
      }
      if (result.code !== 801 && result.code !== 802)
        throw new Error(result.message || '扫码登录失败（' + result.code + '）');
      this.setState({status: result.code === 802 ? '请在手机上确认登录' : '使用网易云音乐扫码'});
      this.timer = setTimeout(() => this.poll(key, request), 2000);
    } catch (error) {
      if (request === this.request) this.setState({status: errorMessage(error), retry: true});
    }
  };

  render() {
    return (
      <Modal visible transparent animationType="fade" onRequestClose={this.props.onClose}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.9)',
          }}
        >
          {this.state.image && (
            <Image
              accessibilityLabel="网易云登录二维码"
              source={{uri: this.state.image}}
              style={{width: 264, height: 264}}
            />
          )}
          <Text style={{margin: 20}}>{this.state.status}</Text>
          {this.state.retry && (
            <TextButton text="刷新二维码" onPress={this.create} style={{padding: 12}} />
          )}
          <TextButton text="关闭" onPress={this.props.onClose} style={{padding: 12}} />
        </View>
      </Modal>
    );
  }
}
