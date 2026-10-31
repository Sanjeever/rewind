import {toast} from '../native/toast';
import * as React from 'react';
import * as reactNativeSpringScrollview from './../components/Scrolling';
import * as components from '../components/index';
import locales from '../locales/index';
import * as services from '../services/index';
import '../utils/index';
import type {ScreenProps} from '../navigation/types';
import type {responses} from '../services/netease/responses';
import type * as z from 'zod/mini';
import {messagePayload} from './messages/payload';
import {errorMessage} from '../utils/types';
type Message = NonNullable<z.output<typeof responses.msg>['msgs']>[number];
interface State {
  data: Message[];
  loaded: boolean;
  msgModalShow: boolean;
  pickedItem: Message | null;
}
class Msg extends React.PureComponent<ScreenProps<'Msg'>, State> {
  _scrollView: reactNativeSpringScrollview.SpringScrollView | null = null;
  state: State = {
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
      toast(errorMessage(error));
    } finally {
      this.setState({
        loaded: true,
      });
    }
  };
  onTop = () => {
    this._scrollView?.scrollToBegin();
  };
  formatRow = function (e: Message) {
    const msg = messagePayload.parse(JSON.parse(e.lastMsg)).msg;
    return {
      img: `${e.fromUser.avatarUrl}?param=200y200`,
      title: e.fromUser.nickname,
      subtitle: msg,
    };
  };
  onUserInfo = (e: Message) => {
    const userId = e.fromUser.userId;
    if (typeof userId === 'number') {
      this.props.navigation.navigate('UserInfo', {
        userId,
      });
    }
  };
  renderItem = ({item, index}: {item: Message; index: number}) => {
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
  onMsg = (e: Message) => {
    this.props.navigation.navigate('MsgHistory', {
      item: e,
    });
  };
  componentDidMount() {
    this.getMsg();
  }
  render() {
    const data = this.state.data;
    return (
      <components.PageContainer
        title={locales.INBOX}
        goBack={() => {
          return this.props.navigation.goBack();
        }}
        onTop={this.onTop}
      >
        {this.state.loaded === false ? (
          <components.Spinkit />
        ) : (
          <reactNativeSpringScrollview.SpringScrollView
            ref={(t) => {
              this._scrollView = t;
            }}
            showsVerticalScrollIndicator={false}
          >
            {data.map((t, index) =>
              this.renderItem({
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
