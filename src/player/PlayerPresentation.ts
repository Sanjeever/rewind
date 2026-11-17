import {Animated, LayoutAnimation, PanResponder} from 'react-native';
import type {
  GestureResponderEvent,
  PanResponderGestureState,
  PanResponderInstance,
} from 'react-native';
import {DEVICE_WIDTH} from '../theme/constants';
import {motion} from '../theme/motion';
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
  reduceMotion(): boolean;
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
  reset() {
    this.expansion.stopAnimation();
    this.lyricProgress.stopAnimation();
    this.expansion.setValue(0);
    this.lyricProgress.setValue(0);
    wakeLock.deactivate();
  }
  dispose() {
    this.reset();
    if (this.slidingTimer) timer.clearTimeout(this.slidingTimer);
    this.slidingTimer = null;
  }
  sliderPanResponder?: PanResponderInstance;
  volumePanResponder?: PanResponderInstance;
  y0: number | null = null;
  fallBackPlayType: PlayState | null = null;
  slidingTimer: number | null = null;
  sliding = false;
  sliderValue0 = 0;
  ANIMATION_CONFIG = LayoutAnimation.create(
    motion.panel,
    LayoutAnimation.Types.easeOut,
    LayoutAnimation.Properties.opacity,
  );
  animatedOpacity = new Animated.Value(1);
  expansion = new Animated.Value(0);
  lyricProgress = new Animated.Value(0);
  animate(value: Animated.Value, toValue: number, onFinished?: () => void) {
    value.stopAnimation();
    if (this.host.reduceMotion()) {
      value.setValue(toValue);
      onFinished?.();
      return;
    }
    Animated.timing(value, {
      toValue,
      duration: value === this.expansion ? motion.panel : motion.state,
      useNativeDriver: true,
    }).start(({finished}) => {
      if (finished) onFinished?.();
    });
  }
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
    this.host.update(
      {
        url: extractFullInfo(this.host.getSong(), 'big').img,
        playerStyle: {
          width: DEVICE_WIDTH,
          height: '100%',
          top: 0,
          left: 0,
          position: 'absolute',
          marginBottom: 0,
        },
        expanded: true,
        showSlider: true,
      },
      () => this.animate(this.expansion, 1),
    );
    wakeLock.activate();
  };
  close = (skipAnimation?: boolean) => {
    emitter.emit(names.PlayerShow, false);
    const finish = () => {
      this.lyricProgress.stopAnimation();
      this.lyricProgress.setValue(0);
      this.host.update({
        url: extractFullInfo(this.host.getSong()).img,
        playerStyle: null,
        imgStyle: null,
        showLyric: false,
        showSlider: false,
      });
    };
    this.host.update({expanded: false});
    if (skipAnimation) {
      this.expansion.stopAnimation();
      this.expansion.setValue(0);
      finish();
    } else this.animate(this.expansion, 0, finish);
    wakeLock.deactivate();
  };
  toggleLyric = () => {
    const showLyric = !this.host.getState().showLyric;
    this.host.update({showLyric}, () => this.animate(this.lyricProgress, showLyric ? 1 : 0));
  };
  toggleTools = () => {
    if (!this.host.reduceMotion()) LayoutAnimation.configureNext(this.ANIMATION_CONFIG);
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
