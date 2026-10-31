import React from 'react';
import {View} from 'react-native';
import {Background} from '../components';
import PlayerView, {MiniPlayerView} from './PlayerView';
import PlayerController from './PlayerController';
import styles, {BOTTOM_BAR_HEIGHT, SOFT_MENU_HEIGHT} from './styles';
import {isActiveQueue} from './types';

export default class Player extends PlayerController {
  actions = {
    changeSong: this.changeSong,
    open: this._playerOpen,
    close: this._playerClose,
    detail: this.onDetail,
    play: this.playSound,
    togglePlay: this.togglePlay,
    showQueue: this.onNowPlaying,
    changePlayMode: this.onChangePlayStatus,
    toggleLyric: this.onTap,
    seek: this.seekTo,
    toggleTranslation: this.onChangeShowTrans,
    changeFontSize: this.onChangeLyricFontSize,
    getLyricIndex: this.getLyricIndex,
    toggleTools: this.showToolBtn,
    like: this.onLike,
    comment: this.onComment,
    toggleFM: this.onFmMode,
    timer: this.onTimer,
    recordPlay: this.onCheck,
    slidingStart: this.slidingStart,
    slide: this.onSliderValueChange,
    slidingEnd: this.slidingEnd,
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
            animatedOpacity={this.animatedOpacity}
            lyric={lyric}
            hasTrans={hasTrans}
            gesture={{
              slider: this._sliderPanResponder,
              volume: this._volumePanResponder,
              y0: this.y0,
              sliding: this.sliding,
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
