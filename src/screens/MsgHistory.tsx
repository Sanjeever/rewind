import {playTracks} from '../player/commands';
import * as React from 'react';
import * as ReactNative from 'react-native';
import * as reactNativeSpringScrollview from './../components/Scrolling';
import * as components from '../components/index';
import providers from '../services/providers';
import icons from '../theme/icons';
import * as services from '../services/index';
import * as utils from '../utils/index';
import queue from '../player/videoActions';
import styles from './messages/styles';
import type {ScreenProps} from '../navigation/types';
import type {TrackFields, TrackId} from '../services/track';
import type {SearchEntity} from '../services/searchEntities';
import type {responses} from '../services/netease/responses';
import type * as z from 'zod/mini';
import {messagePayload} from './messages/payload';
type Message = NonNullable<z.output<typeof responses.msg_history>['msgs']>[number];
class MsgHistory extends React.Component<
  ScreenProps<'MsgHistory'>,
  {title?: string; data: Message[]; loaded: boolean}
> {
  _scrollView: reactNativeSpringScrollview.SpringScrollView | null = null;
  state: {title?: string; data: Message[]; loaded: boolean} = {
    title: '……',
    data: [],
    loaded: false,
  };
  getMsgUser = async (userId: TrackId) => {
    const response = await services.Netease.msg_history({
      userId,
    });
    if (response?.msgs) {
      this.setState({
        data: response.msgs,
        loaded: true,
      });
    }
  };
  onTop = () => {
    this._scrollView?.scrollToBegin();
  };
  onClosed = () => {
    this.props.navigation.goBack();
  };
  formatRow = function (e: Message) {
    const t = messagePayload.parse(JSON.parse(e.msg));
    return {
      img: `${e.fromUser.avatarUrl}?param=200y200`,
      title: e.fromUser.nickname,
      subtitle: t.msg,
      data: t,
      time: utils.timeFormatter.localeString(e.time),
    };
  };
  Album = (e: SearchEntity) => {
    this.props.navigation.navigate('AlbumPage', {
      item: e,
      api: providers.netEase,
    });
  };
  _renderItem = ({item, index}: {item: Message; index: number}) => {
    const n = this.formatRow(item);
    return React.createElement(styles, {
      key: index,
      user: this.state.title,
      fromUser: item.fromUser.nickname,
      img: n.img,
      msg: n.subtitle !== '' ? n.subtitle : null,
      data: n.data,
      time: n.time,
      onAlbum: () => {
        return this.Album(n.data.album!);
      },
      onMV: () => {
        return this.MV(n.data.mv!);
      },
      onSong: () => {
        return this.Song(n.data.song!);
      },
    });
  };
  MV = function ({id}: {id?: TrackId}) {
    queue.playMV(id!, providers.netEase);
  };
  Song = function (e: TrackFields) {
    playTracks({song: e, tracks: [e], index: 0, api: providers.netEase, type: 'insert'});
  };
  componentDidMount() {
    const params = this.props.route.params;
    if (params) {
      const t = params.item;
      if (t) {
        if (t.fromUser) {
          this.setState({
            title: t.fromUser.nickname,
          });
        }
        this.getMsgUser(t.fromUser.userId);
      }
    }
  }
  render() {
    const data = this.state.data;
    return (
      <components.PageContainer
        goBack={this.onClosed}
        title={this.state.title}
        onTop={this.onTop}
        backIcon={{
          name: icons.WINDOW_CLOSE,
        }}
      >
        {this.state.loaded === false ? (
          <components.Spinkit
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
            }}
          />
        ) : null}
        <reactNativeSpringScrollview.SpringScrollView
          ref={(t) => {
            this._scrollView = t;
          }}
          showsVerticalScrollIndicator={false}
        >
          <ReactNative.View
            style={{
              height: 12,
            }}
          />
          {data.map((t, index) =>
            this._renderItem({
              item: t,
              index,
            }),
          )}
        </reactNativeSpringScrollview.SpringScrollView>
      </components.PageContainer>
    );
  }
}
export default MsgHistory;
