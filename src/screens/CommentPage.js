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
import commentSegmentation from './../modules/commentSegmentation';
import CommentCard from './../modules/CommentCard.js';
import * as formatItem from './comments/formatItem';
import CommentAnalysis from './../modules/CommentAnalysis.js';
const w = (e) => e;
class CommentPage extends React.PureComponent {
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
  getComment = (e, t) => {
    switch (t) {
      case providers.netEase: {
        const id = e.rid || e.id;
        const isRadio = !!e.rid;
        this.NeteaseComment({
          id,
          isRadio,
        });
        break;
      }
      case providers.qqMusic: {
        const r = e.id || e.songid;
        this.QQMusicCommnet(r);
      }
    }
  };
  QQMusicCommnet = (e) => {
    services.QQMusic.song_comments({
      songid: e,
    }).then(({comment, hot_comment}) => {
      const {commentlist, commenttotal} = comment;
      let hotComments = [];
      if (hot_comment.commenttotal > 0) {
        hotComments = hot_comment.commentlist;
      }
      if (commenttotal > 0) {
        this.setState({
          data: commentlist,
          loaded: true,
          total: commenttotal,
          hotComments,
          title: w(commenttotal),
          id: e,
        });
      }
    });
  };
  NeteaseComment = async ({id, offset = 0, isRadio = false}) => {
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
      if (!Array.isArray(response?.comments)) {
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
      toast(error.message);
    }
  };
  getCommentKeywords = (e) => {
    if (e.length < 1) {
      this.setState({
        loadWordsCloudDone: true,
      });
    } else {
      let t = '';
      e.forEach((e) => {
        const n = e.content || e.rootcommentcontent;
        if (n) {
          const a = n.replace(/\s/gi, '');
          t += `${a}`;
        }
      });
      this.getKeyWords(utils.emojiStrip(t));
    }
  };
  getKeyWords = async (text) => {
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
      toast(error.message);
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
    const n_state = this.state;
    const {hotComments, total, song, api} = n_state;
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
          <components.SongRow
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
  textInputChange = (text) => {
    this.setState({
      text,
    });
  };
  addComment = () => {
    const n_state = this.state;
    const {text, api, id} = n_state;
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
  addNetease = async (text, id) => {
    const response = await services.Netease.comment_add({
      id,
      text,
    });
    if (response?.code === 200) {
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
      this.list?.scrollToOffset({
        offset: 0,
      });
    } else {
      toast(response?.message || locales.NETEASE_NOT_LOGIN);
    }
  };
  onWordsCloud = () => {
    const n_state = this.state;
    const e_hotComments = n_state.hotComments;
    if (!n_state.loadWordsCloudDone) {
      this.getCommentKeywords(e_hotComments);
    }
    this.setState({
      showWordscloud: true,
    });
  };
  onTop = () => {
    this._scrollView.scrollToBegin?.();
  };
  NeteaseMore = async (id, offset = 0) => {
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
        this.setState((previous) => ({
          data: [...previous.data, ...response.comments],
        }));
        this._scrollView?.endLoading?.(!response.comments.length);
      }
    } catch (error) {
      this._scrollView?.endLoading?.();
      toast(error.message);
    }
  };
  QQMusicMore = (songid, pagenum) => {
    services.QQMusic.song_comments({
      songid,
      pagenum,
    }).then(({comment}) => {
      const comment_commentlist = comment.commentlist;
      if (comment.commenttotal > 0) {
        this.setState({
          data: [...this.state.data, ...comment_commentlist],
        });
        this._scrollView.endLoading?.();
      }
    });
  };
  getMoreComment = () => {
    const n_state = this.state;
    const {api, id, offset} = n_state;
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
  _renderItem = ({item, index}) => {
    const o = formatItem.getFormattedItem(item, this.state.api);
    return (
      <CommentCard
        key={index}
        content={o.content}
        userName={o.userName}
        time={o.time}
        userAvatar={o.userAvatar}
        beReplieds={o.beReplieds}
        likedCount={o.likedCount}
        item={item}
        onUserInfo={this.onUserInfo}
      />
    );
  };
  onUserInfo = (e) => {
    if (this.state.api === providers.netEase) {
      const userId = e.user.userId;
      this.props.navigation.navigate('UserInfo', {
        userId,
      });
    }
  };
  state = {
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
              return (this._scrollView = t);
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
var E = ReactNative.StyleSheet.create({
  section: {
    paddingLeft: 20,
  },
});
export default CommentPage;
