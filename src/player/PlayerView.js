import React from 'react';
import {Animated, View} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {Background, Spinkit} from '../components';
import Text from '../components/Text';
import {DEVICE_WIDTH, STATUS_BAR_HEIGHT} from '../theme/constants';
import buttons from './buttons';
import styles from './styles';
import parseArtist from '../utils/parseArtist';
import timeFormatter from '../utils/timeFormatter';
import dimensions from '../native/dimensions';
import PlaybackTime from './PlaybackTime';
import Cover from './Cover';
import TrackTitle from './TrackTitle';
import ControlIcon from './ControlIcon';
import Toolbar from './Toolbar';
import LyricsView from './LyricsView';
import MiniPlayer from './MiniPlayer';
import PlaybackControls from './PlaybackControls';
import QueuePosition from './QueuePosition';
import SeekBar from './SeekBar';
import LyricTime from './LyricTime';
import ExtraPlaybackControls from './ExtraPlaybackControls';

export function MiniPlayerView({playback, queue, settings, actions}) {
  return <MiniPlayer playingIndex={queue.playingIndex} tracks={queue.tracks}
    changeSong={actions.changeSong} playerOpen={actions.open} playMode={playback.playMode}
    randomArray={playback.randomArray} onDetail={actions.detail} playState={playback.playState}
    togglePlay={actions.togglePlay} loaded={playback.loaded} onNowPlaying={actions.showQueue}
    onChangePlayStatus={actions.changePlayMode} showLyric={playback.showLyric} color={playback.color}
    hideTopBorder={settings.hideMiniPlayerTopBorder} isRound={settings.isRound} unknown={playback.isFM}
    currentMiniLyric={!settings.hideMiniLyric && playback.playState === 'playing' && playback.currentMiniLyric} />;
}

export default function PlayerView({playback, queue, settings, actions, gesture, animatedOpacity, lyric, hasTrans}) {
  const {
    url, playState, loaded, showSlider, currentTime, duration, playMode, showLyric, color,
    showTool, isFM, isLike, lrcText, showTrans, lyricFontSize, showCoverElevation, randomArray,
  } = playback;
  const {isRound, hideBottomTip, hidePlayingTime, hideFloatLyric, reverseGestureHands, hideRoundSlider} = settings;
  const softMenuHeight = settings.navbarPadding ? dimensions.get('SOFT_MENU_BAR_HEIGHT') : 0;
  const leftResponder = reverseGestureHands ? gesture.volume : gesture.slider;
  const rightResponder = reverseGestureHands ? gesture.slider : gesture.volume;
  const sliderVisible = showSlider && !((gesture.y0 == null || !gesture.sliding) && hideRoundSlider && isRound);

  return <>
    <Background blur coverUrl={url} bgStyle={{top: null, bottom: 0}}
      imageStyle={[isRound && {borderBottomLeftRadius: 0, borderBottomRightRadius: 0},
        showLyric && {opacity: 0.7, borderBottomLeftRadius: 0, borderBottomRightRadius: 0}]} />
    {showLyric && <LyricsView showTool={showTool} animatedOpacity={animatedOpacity} hidePlayingTime={hidePlayingTime}
      lyric={lyric} hasTrans={hasTrans} playState={playState} currentTime={currentTime}
      onTap={actions.toggleLyric} playSound={actions.play} seekTo={actions.seek}
      lrcText={lrcText} showTrans={showTrans} changeShowTrans={actions.toggleTranslation}
      changeFontSize={actions.changeFontSize} lyricFontSize={lyricFontSize} getLyricIndex={actions.getLyricIndex} />}
    {!showLyric && <Animated.View style={[styles.lyric, !showTool && styles.toolHide, {opacity: animatedOpacity}]}>
      <Cover reverseGestureHands={reverseGestureHands} onPlay={showTool ? null : actions.togglePlay}
        onTap={actions.toggleLyric} url={url} song={queue.songItemInfo.song} data={queue.tracks}
        index={queue.playingIndex} randomArray={randomArray} onNext={() => actions.changeSong('next')}
        onPrev={() => actions.changeSong('pre')} unknown={isFM} playMode={playMode} playState={playState}
        playerClose={actions.close} showToolBtn={actions.toggleTools} onDetail={actions.detail}
        onNowPlaying={actions.showQueue} isRound={isRound} showTool={showTool} showElevation={showCoverElevation} />
    </Animated.View>}
    {showLyric && <TrackTitle viewStyle={[styles.songTitleCon, !showTool && {alignItems: 'center', alignSelf: 'center', top: STATUS_BAR_HEIGHT}]}
      title={queue.songItemInfo.song} subtitle={parseArtist(queue.songItemInfo.singer)} numberOfLines={1}
      titleStyle={[styles.text, playState === 'paused' && {opacity: 0.7}]} authorStyle={{fontSize: 13}} onPress={actions.togglePlay} />}
    {showTool && <PlaybackControls animatedOpacity={animatedOpacity} playMode={playMode} playState={playState}
      onChangePlayStatus={actions.changePlayMode} showLyric={showLyric} changeSong={actions.changeSong}
      togglePlay={actions.togglePlay} onNowPlaying={actions.showQueue} color={color} loaded={loaded} />}
    {!hidePlayingTime && showLyric && <LyricTime color={color} duration={duration} currentTime={currentTime} showLyric={showLyric} />}
    {!showLyric && !showTool && !hideFloatLyric && lyric && <Toolbar currentTime={currentTime}
      getLyricIndex={actions.getLyricIndex} lyric={lyric} showTrans={showTrans} animatedOpacity={animatedOpacity}
      SOFT_MENU_HEIGHT={softMenuHeight} width={DEVICE_WIDTH} isRound={isRound} />}
    {!isRound && !hidePlayingTime && !showLyric && (gesture.sliding || playState === 'paused' && loaded) &&
      <PlaybackTime width={DEVICE_WIDTH} animatedOpacity={animatedOpacity} color={color} duration={duration} currentTime={currentTime} />}
    {showTool && !showLyric && <ExtraPlaybackControls animatedOpacity={animatedOpacity} onLike={actions.like}
      onComment={actions.comment} onDetail={actions.detail} onFmMode={actions.toggleFM} onTimer={actions.timer}
      showLyric={showLyric} playState={playState} color={color} isFM={isFM} isLike={isLike} onCheck={actions.recordPlay} />}
    {showTool && <View style={[styles.topBtn, {left: 10, right: null}]}>
      <ControlIcon name={buttons.CLOSE.name} type={buttons.CLOSE.type} onPress={() => actions.close()} color={showLyric ? '#fff' : color} size={23} />
    </View>}
    {showTool && <View style={[styles.topBtn, {right: 10, left: null}]}>
      <ControlIcon name={buttons.CIRCLE.name} type={buttons.CIRCLE.type} color={color} size={23} onPress={actions.toggleTools} />
    </View>}
    {!showLyric && !showTool && !loaded && <View style={styles.blankLyric}><Spinkit size={55} /></View>}
    {!hideBottomTip && !showLyric && <QueuePosition extraBottomValue={softMenuHeight} animatedOpacity={animatedOpacity}
      currentIndex={queue.playingIndex + 1} tracksLength={queue.tracks.length} />}
    {sliderVisible && <SeekBar SOFT_MENU_HEIGHT={softMenuHeight} showLyric={showLyric} isRound={isRound}
      duration={duration} currentTime={currentTime} loaded={loaded} slidingStart={actions.slidingStart}
      onSliderValueChange={actions.slide} slidingEnd={actions.slidingEnd} width={DEVICE_WIDTH} />}
    {leftResponder && <View pointerEvents={showLyric || showTool ? 'none' : 'auto'} style={styles.vertical} {...leftResponder.panHandlers} />}
    {rightResponder && <View pointerEvents={showLyric || showTool ? 'none' : 'auto'} style={[styles.vertical, {left: null, right: 0}]} {...rightResponder.panHandlers} />}
    {!!gesture.y0 && gesture.sliding && <Animatable.View pointerEvents="none" animation="fadeIn"
      style={{alignItems: 'center', justifyContent: 'center', position: 'absolute', bottom: 100, alignSelf: 'center'}}>
      <Text style={[styles.text, {fontSize: 16}]}>{timeFormatter.parseTime(currentTime)} / {timeFormatter.parseTime(duration)}</Text>
    </Animatable.View>}
  </>;
}
