import {Animated, LayoutAnimation, PanResponder} from 'react-native';
import type {
  GestureResponderEvent,
  PanResponderGestureState,
  PanResponderInstance,
} from 'react-native';
import {DEVICE_WIDTH, DEVICE_HEIGHT} from '../theme/constants';
import {emitter} from '../events';
import names from '../events/names';
import keys from '../storage/keys';
import {extractFullInfo} from '../services/trackInfo';
import type {TrackFields} from '../services/track';
import timer from '../native/timer';
import AudioPlayer from '../native/audioPlayer';
import wakeLock from '../native/wakeLock';
import gestures from './gestures';
import lyricPreferences from './lyricPreferences';
import type {PlayerState, PlayState} from './types';

type PresentationState = Pick<
  PlayerState,
  | 'expanded'
  | 'url'
  | 'playerStyle'
  | 'imgStyle'
  | 'showLyric'
  | 'showSlider'
  | 'showCoverElevation'
  | 'showTool'
  | 'currentTime'
  | 'duration'
  | 'playState'
  | 'lyricFontSize'
  | 'showTrans'
>;
interface Host {
  getState(): PresentationState;
  getSong(): TrackFields;
  update(
    update: Partial<PresentationState> | ((state: PresentationState) => Partial<PresentationState>),
    onCommitted?: () => void,
  ): void;
  togglePlay(): void;
  seek(seconds: number): void;
  refreshTime(): void;
}

export default class PlayerPresentation {
  constructor(private readonly host: Host) {}
  initialize() {
    this.sliderPanResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => false,
      onPanResponderGrant: (_, gesture) => {
        this.y0 = gesture.moveY;
        this.fallBackPlayType = this.host.getState().playState;
      },
      onPanResponderMove: this.sliderMove,
      onPanResponderRelease: this.sliderRelease,
      onPanResponderTerminationRequest: () => false,
    });
    this.volumePanResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => false,
      onPanResponderRelease: (_, gesture) => {
        if (Math.abs(gesture.dy) > 20) AudioPlayer.showSystemStreamVolumeUI();
      },
      onPanResponderTerminationRequest: () => false,
    });
  }
  dispose() {
    if (this.showSliderTimer) timer.clearTimeout(this.showSliderTimer);
    if (this.slidingTimer) timer.clearTimeout(this.slidingTimer);
    this.showSliderTimer = null;
    this.slidingTimer = null;
    wakeLock.deactivate();
  }
  sliderPanResponder?: PanResponderInstance;
  volumePanResponder?: PanResponderInstance;
  y0: number | null = null;
  fallBackPlayType: PlayState | null = null;
  showSliderTimer: number | null = null;
  slidingTimer: number | null = null;
  sliding = false;
  sliderValue0 = 0;
  ANIMATION_CONFIG = LayoutAnimation.create(
    400,
    LayoutAnimation.Types.easeOut,
    LayoutAnimation.Properties.opacity,
  );
  animatedOpacity = new Animated.Value(1);
  onBackPress = () => {
    if (this.host.getState().showLyric) {
      this.toggleLyric();
      return true;
    }
    if (this.host.getState().expanded) {
      this.close();
      return true;
    }
    return false;
  };
  open = () => {
    emitter.emit(names.PlayerShow, true);
    this.showSliderTimer = timer.setTimeout(
      () =>
        this.host.update({
          showSlider: true,
        }),
      300,
    );
    LayoutAnimation.configureNext(this.ANIMATION_CONFIG);
    this.host.update({
      url: extractFullInfo(this.host.getSong(), 'big').img,
      playerStyle: {
        width: DEVICE_WIDTH,
        height: DEVICE_HEIGHT,
        top: 0,
        left: 0,
        position: 'absolute',
        marginBottom: 0,
      },
      expanded: true,
    });
    wakeLock.activate();
  };
  close = (skipAnimation?: boolean) => {
    emitter.emit(names.PlayerShow, false);
    if (this.showSliderTimer) timer.clearTimeout(this.showSliderTimer);
    if (!skipAnimation) LayoutAnimation.configureNext(this.ANIMATION_CONFIG);
    this.host.update({
      url: extractFullInfo(this.host.getSong()).img,
      playerStyle: null,
      imgStyle: null,
      expanded: false,
      showLyric: false,
      showSlider: false,
    });
    wakeLock.deactivate();
  };
  toggleLyric = () => {
    const showLyric = !this.host.getState().showLyric;
    this.host.update({
      showSlider: false,
      showCoverElevation: false,
    });
    Animated.timing(this.animatedOpacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      this.host.update({
        showLyric,
        showSlider: true,
      });
      Animated.timing(this.animatedOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start(() =>
        this.host.update({
          showCoverElevation: true,
        }),
      );
    });
  };
  toggleTools = () => {
    LayoutAnimation.configureNext(this.ANIMATION_CONFIG);
    this.host.update(
      (state) => ({
        showTool: !state.showTool,
      }),
      () => lyricPreferences.save(keys.showToolBtnStatus, this.host.getState().showTool),
    );
  };
  changeFontSize = (lyricFontSize: number) => {
    this.host.update({
      lyricFontSize,
    });
    lyricPreferences.save(keys.lyricFontSize, lyricFontSize);
  };
  toggleTranslation = () => {
    this.host.update(
      (state) => ({
        showTrans: !state.showTrans,
      }),
      () => lyricPreferences.save(keys.showTrans, this.host.getState().showTrans),
    );
  };
  slidingStart = (seconds: number) => {
    if (!this.host.getState().showTool) this.sliderValue0 = seconds;
  };
  slide = (currentTime: number) => {
    this.sliding = true;
    this.host.update({
      currentTime,
    });
  };
  slidingEnd = (seconds: number) => {
    if (!this.host.getState().showTool && Math.abs(seconds - this.sliderValue0) < 5)
      this.host.togglePlay();
    else this.host.seek(seconds);
    this.slidingTimer = timer.setTimeout(() => {
      this.sliding = false;
    }, 500);
  };
  sliderMove = (_: GestureResponderEvent, gesture: PanResponderGestureState) => {
    if (gesture.x0 < 15 || gesture.x0 > DEVICE_WIDTH - 15) return;
    const delta = Math.floor(
      (gestures.stepMap(gesture.moveY - this.y0!) / 200) * this.host.getState().duration,
    );
    this.y0 = gesture.moveY;
    this.slide(
      Math.max(
        0,
        Math.min(this.host.getState().duration, this.host.getState().currentTime + delta),
      ),
    );
  };
  sliderRelease = (_: GestureResponderEvent, gesture: PanResponderGestureState) => {
    if (
      !gestures.isOverEdge({
        gestureState: gesture,
        DEVICE_WIDTH,
      })
    )
      this.slidingEnd(this.host.getState().currentTime);
    else this.host.refreshTime();
    this.y0 = null;
    this.sliding = false;
    this.fallBackPlayType = null;
  };
}
