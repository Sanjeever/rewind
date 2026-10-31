import {collectTracks, showTrackDetails, choosePlaylist} from '../modals/commands';
import {recordPlayed} from './playbackHistory';
import stopTimer from '../utils/stopTimer';
import universalNavigator from '../utils/universalNavigator';
import providers from '../services/providers';
import locales from '../locales';
import {toast} from '../native/toast';
import {getLyricIndex} from './lyricPosition';
import React from 'react';
import {View} from 'react-native';
import {Background} from '../components';
import PlayerView, {MiniPlayerView} from './PlayerView';
import PlayerController from './PlayerController';
import styles, {BOTTOM_BAR_HEIGHT, SOFT_MENU_HEIGHT} from './styles';
import {isActiveQueue} from './types';

export default class Player extends PlayerController {
  onLike = () =>
    this.resources.toggleLike(
      this.activeQueue.songItem,
      this.activeQueue.api,
      this.state.isLike,
      this.playbackRequest,
    );
  onCollect = () =>
    collectTracks({
      api: this.activeQueue.api,
      song: this.activeQueue.songItem,
    });
  onDetail = () =>
    showTrackDetails({
      api: this.activeQueue.api,
      song: this.activeQueue.songItem,
      index: this.activeQueue.playingIndex,
    });
  onChangePlaylist = () => choosePlaylist();
  onNowPlaying = () => this.props.setDisplayNowPlaying(true);
  onTimer = () => stopTimer.open();
  onCheck = () => {
    if (this.activeQueue.api === providers.netEase)
      return recordPlayed(this.activeQueue.songItem, this.props.settings.recordPlayCount);
    toast(locales.PLAY_COUNT_ONLY_SUPPORT_NETEASE);
  };
  onComment = () => {
    if (this.activeQueue.api === providers.local) return toast(locales.COMMENT_LOCAL_CAN_NOT);
    universalNavigator.navigate('CommentPage', {
      api: this.activeQueue.api,
      song: this.activeQueue.songItem,
    });
    this.presentation.close();
  };
  actions = {
    changeSong: this.changeSong,
    open: this.presentation.open,
    close: this.presentation.close,
    detail: this.onDetail,
    play: this.playSound,
    togglePlay: this.togglePlay,
    showQueue: this.onNowPlaying,
    changePlayMode: this.queue.changeMode,
    toggleLyric: this.presentation.toggleLyric,
    seek: this.seekTo,
    toggleTranslation: this.presentation.toggleTranslation,
    changeFontSize: this.presentation.changeFontSize,
    getLyricIndex,
    toggleTools: this.presentation.toggleTools,
    like: this.onLike,
    comment: this.onComment,
    toggleFM: this.radio.toggle,
    timer: this.onTimer,
    recordPlay: this.onCheck,
    slidingStart: this.presentation.slidingStart,
    slide: this.presentation.slide,
    slidingEnd: this.presentation.slidingEnd,
  };

  render() {
    const {expanded, url, playerStyle, hidePlayer} = this.state;
    if (hidePlayer || !url || !isActiveQueue(this.props)) return null;
    const {
      settings,
      bottomPaddingValue = 0,
      tracks,
      songItemInfo,
      playingIndex,
      lyric,
      hasTrans,
    } = this.activeQueue;
    const queue = {tracks, songItemInfo, playingIndex};
    if (expanded)
      return (
        <View style={[styles.container, playerStyle]}>
          <PlayerView
            playback={this.state}
            queue={queue}
            settings={settings}
            actions={this.actions}
            animatedOpacity={this.presentation.animatedOpacity}
            lyric={lyric}
            hasTrans={hasTrans}
            gesture={{
              slider: this.presentation.sliderPanResponder,
              volume: this.presentation.volumePanResponder,
              y0: this.presentation.y0,
              sliding: this.presentation.sliding,
            }}
          />
        </View>
      );
    const bottomPadding = bottomPaddingValue + (settings.navbarPadding ? SOFT_MENU_HEIGHT : 0);
    return (
      <View
        style={[
          styles.container,
          playerStyle,
          {overflow: 'hidden', height: BOTTOM_BAR_HEIGHT + bottomPadding},
        ]}
      >
        <View style={{height: '100%', width: '100%', paddingBottom: bottomPadding}}>
          <Background blur={settings.bottomBlur} bgStyle={{top: null, bottom: 0}} />
          <MiniPlayerView
            playback={this.state}
            queue={queue}
            settings={settings}
            actions={this.actions}
          />
        </View>
      </View>
    );
  }
}
