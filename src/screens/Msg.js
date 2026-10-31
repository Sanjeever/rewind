import {toast} from '../native/toast';
import * as React from 'react';
import * as reactNativeSpringScrollview from './../components/Scrolling.js';
import * as components from '../components/index';
import locales from '../locales/index';
import * as services from '../services/index';
import '../utils/index';
class Msg extends React.PureComponent {
  state = {
    data: [],
    loaded: false,
    msgModalShow: false,
    pickedItem: null,
  };
  getMsg = async () => {
    try {
      const response = await services.Netease.msg();
      if (response?.code === 301) {
        toast(locales.NETEASE_NOT_LOGIN);
        this.props.navigation.navigate('NeteaseLogin');
        return;
      }
      if (response?.msgs) {
        this.setState({
          data: response.msgs,
        });
      }
    } catch (error) {
      toast(error.message);
    } finally {
      this.setState({
        loaded: true,
      });
    }
  };
  onTop = () => {
    this._scrollView.scrollToBegin?.();
  };
  formatRow = function (e) {
    const msg = JSON.parse(e.lastMsg).msg;
    return {
      img: `${e.fromUser.avatarUrl}?param=200y200`,
      title: e.fromUser.nickname,
      subtitle: msg,
    };
  };
  onUserInfo = (e) => {
    const userId = e.fromUser.userId;
    if (typeof userId === 'number') {
      this.props.navigation.navigate('UserInfo', {
        userId,
      });
    }
  };
  renderItem = ({item, index}) => {
    const a = this.formatRow(item);
    return (
      <components.ListItem
        key={index}
        img={a.img}
        title={a.title}
        subtitle={a.subtitle !== '' ? a.subtitle : null}
        onPress={() => {
          return this.onMsg(item);
        }}
        onPressImg={() => {
          return this.onUserInfo(item);
        }}
      />
    );
  };
  onMsg = (e) => {
    this.props.navigation.navigate('MsgHistory', {
      item: e,
    });
  };
  componentDidMount() {
    this.getMsg();
  }
  render() {
    const e = this;
    const data = this.state.data;
    return (
      <components.PageContainer
        title={locales.INBOX}
        goBack={function () {
          return e.props.navigation.goBack();
        }}
        onTop={this.onTop}
      >
        {this.state.loaded === false ? (
          <components.Spinkit />
        ) : (
          <reactNativeSpringScrollview.SpringScrollView
            ref={function (t) {
              return (e._scrollView = t);
            }}
            showsVerticalScrollIndicator={false}
          >
            {data.map((t, index) =>
              e.renderItem({
                item: t,
                index,
              }),
            )}
          </reactNativeSpringScrollview.SpringScrollView>
        )}
      </components.PageContainer>
    );
  }
}
export default Msg;
