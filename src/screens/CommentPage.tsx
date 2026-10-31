import SongRow from '../features/tracks/SongRow';
import type {ScreenProps} from '../navigation/types';
import type {Provider} from '../services/providers';
import type {TrackFields, TrackId} from '../services/track';
import type {CommentItem, CommentReply} from '../features/comments/formatItem';
import {isNeteaseComment} from '../features/comments/formatItem';
import {errorMessage} from '../utils/types';
import {toast} from '../native/toast';
import * as React from 'react';
import * as ReactNative from 'react-native';
import * as reactNativeSpringScrollview from './../components/Scrolling';
import * as components from '../components/index';
import ParallaxList from '../components/ParallaxList';
import providers from '../services/providers';
import icons from '../theme/icons';
import locales from '../locales/index';
import * as services from '../services/index';
import * as utils from '../utils/index';
import * as trackInfo from '../services/trackInfo';
import commentSegmentation from '../features/comments/commentSegmentation';
import CommentCard from '../features/comments/CommentCard';
import * as formatItem from '../features/comments/formatItem';
import CommentAnalysis from '../features/comments/CommentAnalysis';
const w = (e: number) => e;
type SongInfo = ReturnType<typeof trackInfo.extractFullInfo>;
interface State {
  title: string | number;
  data: CommentItem[];
  loaded: boolean;
  api: Provider;
  hotComments: CommentItem[];
  total: number;
  offset: number;
  text: string;
  showWordscloud: boolean;
  wordscloud: string[];
  loadWordsCloudDone: boolean;
  noHotComments: boolean;
  isRadio: boolean;
  song?: SongInfo;
  id?: TrackId;
}
class CommentPage extends React.PureComponent<
  Pick<ScreenProps<'CommentPage'>, 'route'> & {
    navigation: Pick<ScreenProps<'CommentPage'>['navigation'], 'navigate' | 'goBack'>;
  },
  State
> {
  _scrollView: reactNativeSpringScrollview.SpringScrollView | null = null;
  init = () => {
    const params = this.props.route.params;
    if (params) {
      const {api, song} = params;
      if (api) {
        this.setState({
          api,
          song: trackInfo.extractFullInfo(song),
        });
        this.getComment(song, api);
      }
    }
  };
  getComment = (e: TrackFields, t: Provider) => {
    switch (t) {
      case providers.netEase: {
        const id = e.rid || e.id;
        const isRadio = !!e.rid;
        this.NeteaseComment({
          id: id!,
          isRadio,
        });
        break;
      }
      case providers.qqMusic: {
        const r = e.id || e.songid;
        this.QQMusicCommnet(r!);
      }
    }
  };
  QQMusicCommnet = async (e: TrackId) => {
    try {
      const response = await services.QQMusic.song_comments({
        songid: e,
      });
      if (!response?.comment) throw new Error('QQ 音乐评论响应缺少列表');
      const {comment, hot_comment} = response;
      const {commentlist, commenttotal} = comment;
      let hotComments: CommentItem[] = [];
      if (hot_comment && hot_comment.commenttotal > 0) {
        hotComments = hot_comment.commentlist;
      }
      this.setState({
        data: commentlist,
        loaded: true,
        total: commenttotal,
        hotComments,
        title: w(commenttotal),
        id: e,
      });
    } catch (error) {
      this.setState({loaded: true});
      toast(errorMessage(error));
    }
  };
  NeteaseComment = async ({
    id,
    offset = 0,
    isRadio = false,
  }: {
    id: TrackId;
    offset?: number;
    isRadio?: boolean;
  }) => {
    try {
      const response = await (isRadio
        ? services.Netease.comment_radio({
            id,
            offset,
          })
        : services.Netease.comment({
            id,
            offset,
          }));
      if (!Array.isArray(response?.comments) || response.total == null) {
        throw new Error(response?.message || locales.ERROR);
      }
      const {comments, hotComments, total} = response;
      this.setState({
        data: comments,
        loaded: true,
        total,
        hotComments: isRadio ? [] : hotComments?.length ? hotComments : comments.slice(0, 15),
        title: w(total),
        id,
        isRadio,
      });
    } catch (error) {
      this.setState({
        loaded: true,
      });
      toast(errorMessage(error));
    }
  };
  getCommentKeywords = (e: CommentItem[]) => {
    if (e.length < 1) {
      this.setState({
        loadWordsCloudDone: true,
      });
    } else {
      let t = '';
      e.forEach((e) => {
        const n = isNeteaseComment(e) ? e.content : e.rootcommentcontent;
        if (n) {
          const a = n.replace(/\s/gi, '');
          t += `${a}`;
        }
      });
      this.getKeyWords(utils.emojiStrip(t));
    }
  };
  getKeyWords = async (text: string) => {
    if (!text) {
      return;
    }
    try {
      for (let offset = 0; offset < text.length; offset += 500) {
        const words = await commentSegmentation.nlp(text.slice(offset, offset + 500));
        if (words?.length) {
          this.setState((previous) => ({
            wordscloud: [...previous.wordscloud, ...new Set(words)],
          }));
        }
      }
    } catch (error) {
      toast(errorMessage(error));
    } finally {
      this.setState({
        loadWordsCloudDone: true,
      });
    }
  };
  renderTextInput = () => {
    const text = this.state.text;
    return (
      <ReactNative.View
        style={{
          flex: 1,
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          paddingLeft: 10,
        }}
      >
        <components.Input
          maxLength={140}
          style={{
            width: '80%',
            fontSize: 15,
            paddingHorizontal: 10,
          }}
          placeholder={locales.COMMENT}
          onChangeText={this.textInputChange}
          onSubmitEditing={this.addComment}
          defaultValue={text}
        />
        {this.state.api === providers.netEase && (
          <components.Icon
            name={icons.WEB}
            onPress={this.toWebView}
            size={20}
            style={{
              marginRight: 12,
            }}
          />
        )}
        <components.Icon name={icons.COMMENT_PLUS_OUTLINE} onPress={this.addComment} size={20} />
      </ReactNative.View>
    );
  };
  toWebView = () => {
    const song = this.state.song;
    if (song) {
      const url = `https://music.163.com/#/song?id=${song.uid}`;
      this.props.navigation.navigate('WebViewPage', {
        url,
      });
    }
  };
  renderHeader = () => {
    const state = this.state;
    const {hotComments, total, song, api} = state;
    if (total === 0) {
      return null;
    }
    return (
      <ReactNative.View
        style={{
          flex: 1,
        }}
      >
        {song && (
          <SongRow
            song={song.song}
            album={song.album === '空' ? '' : song.album}
            singer={song.singer}
            img={song.img}
            containerStyle={{
              height: 70,
            }}
          />
        )}
        {this.renderTextInput()}
        {hotComments.length > 0 && (
          <components.Title style={E.section}>
            {'热门评论 '}
            {hotComments.length}
          </components.Title>
        )}
        {hotComments.map((e, key) => {
          const a = formatItem.getFormattedItem(e, api);
          return (
            <CommentCard
              key={key}
              content={a.content}
              userAvatar={a.userAvatar}
              userName={a.userName}
              time={a.time}
              onUserInfo={() => {
                return this.onUserInfo(e);
              }}
            />
          );
        })}
        <components.Title
          style={[
            E.section,
            {
              marginTop: 20,
            },
          ]}
        >
          {'所有评论 '}
          {total}
        </components.Title>
      </ReactNative.View>
    );
  };
  textInputChange = (text: string) => {
    this.setState({
      text,
    });
  };
  addComment = () => {
    const state = this.state;
    const {text, api, id} = state;
    if (text && id) {
      ReactNative.Keyboard.dismiss();
      switch (api) {
        case providers.netEase:
          this.addNetease(text, id);
      }
      this.setState({
        text: '',
      });
    }
  };
  addNetease = async (text: string, id: TrackId) => {
    const response = await services.Netease.comment_add({
      id,
      text,
    });
    if (response?.code === 200 && response.comment) {
      const comment = {
        ...response.comment,
        beReplied: [],
        liked: false,
        likedCount: 0,
      };
      this.setState((previous) => ({
        hotComments: [],
        data: [comment, ...previous.data],
      }));
      this._scrollView?.scrollTo({
        y: 0,
      });
    } else {
      toast(response?.message || locales.NETEASE_NOT_LOGIN);
    }
  };
  onWordsCloud = () => {
    const state = this.state;
    const e_hotComments = state.hotComments;
    if (!state.loadWordsCloudDone) {
      this.getCommentKeywords(e_hotComments);
    }
    this.setState({
      showWordscloud: true,
    });
  };
  onTop = () => {
    this._scrollView?.scrollToBegin();
  };
  NeteaseMore = async (id: TrackId, offset = 0) => {
    try {
      const response = await (this.state.isRadio
        ? services.Netease.comment_radio({
            id,
            offset,
          })
        : services.Netease.comment({
            id,
            offset,
          }));
      if (response?.comments) {
        const comments = response.comments;
        this.setState((previous) => ({
          data: [...previous.data, ...comments],
        }));
        this._scrollView?.endLoading?.(!response.comments.length);
      }
    } catch (error) {
      this._scrollView?.endLoading?.();
      toast(errorMessage(error));
    }
  };
  QQMusicMore = async (songid: TrackId, pagenum: number) => {
    try {
      const response = await services.QQMusic.song_comments({
        songid,
        pagenum,
      });
      if (!response?.comment) throw new Error('QQ 音乐评论响应缺少列表');
      const {comment} = response;
      const comment_commentlist = comment.commentlist;
      if (comment.commenttotal > 0) {
        this.setState({
          data: [...this.state.data, ...comment_commentlist],
        });
        this._scrollView?.endLoading();
      }
    } catch (error) {
      this._scrollView?.endLoading();
      toast(errorMessage(error));
    }
  };
  getMoreComment = () => {
    const state = this.state;
    const {api, id, offset} = state;
    if (id) {
      switch (api) {
        case providers.netEase:
          this.NeteaseMore(id, 30 * offset);
          break;
        case providers.qqMusic:
          this.QQMusicMore(id, offset);
      }
    }
  };
  getMore = () => {
    this.setState(
      {
        offset: this.state.offset + 1,
      },
      () => {
        this.getMoreComment();
      },
    );
  };
  _renderItem = ({item, index}: {item: CommentItem; index: number}) => {
    const o = formatItem.getFormattedItem(item, this.state.api);
    return (
      <CommentCard
        key={index}
        content={o.content}
        userName={o.userName}
        time={o.time}
        userAvatar={o.userAvatar}
        beReplieds={o.beReplieds}
        item={item}
        onUserInfo={this.onUserInfo}
      />
    );
  };
  onUserInfo = (e?: CommentItem | CommentReply) => {
    if (this.state.api === providers.netEase && e && isNeteaseComment(e)) {
      const userId = e.user.userId;
      this.props.navigation.navigate('UserInfo', {
        userId,
      });
    }
  };
  state: State = {
    title: '',
    data: [],
    loaded: false,
    api: providers.netEase,
    hotComments: [],
    total: 0,
    offset: 0,
    text: '',
    showWordscloud: false,
    wordscloud: [],
    loadWordsCloudDone: false,
    noHotComments: false,
    isRadio: false,
  };
  componentDidMount() {
    this.init();
  }
  render() {
    const state = this.state;
    const {loaded, data, showWordscloud, wordscloud, hotComments, song, title, loadWordsCloudDone} =
      state;
    return (
      <components.PageContainer
        title={title}
        goBack={this.props.navigation.goBack}
        onTop={this.onTop}
        backIcon={{
          name: icons.WINDOW_CLOSE,
        }}
        rightIcon={{
          name: icons.FIRE,
          onPress: this.onWordsCloud,
        }}
      >
        {loaded === false ? (
          <components.Spinkit />
        ) : (
          <reactNativeSpringScrollview.SpringScrollView
            ref={(t) => {
              this._scrollView = t;
            }}
            onLoading={this.getMore}
            loadingFooter={ParallaxList}
          >
            {this.renderHeader()}
            {data.map((item, index) =>
              this._renderItem({
                item,
                index,
              }),
            )}
          </reactNativeSpringScrollview.SpringScrollView>
        )}
        <ReactNative.Modal
          visible={showWordscloud}
          onRequestClose={() => {
            return this.setState({
              showWordscloud: false,
            });
          }}
          animationType={'fade'}
        >
          <ReactNative.View
            style={{
              flex: 1,
              backgroundColor: '#100f14',
            }}
          >
            <CommentAnalysis
              hotComments={hotComments}
              wordscloud={wordscloud}
              song={song}
              onClose={() => {
                return this.setState({
                  showWordscloud: false,
                });
              }}
              loadWordsCloudDone={loadWordsCloudDone}
            />
          </ReactNative.View>
        </ReactNative.Modal>
      </components.PageContainer>
    );
  }
}
const E = ReactNative.StyleSheet.create({
  section: {
    paddingLeft: 20,
  },
});
export default CommentPage;
