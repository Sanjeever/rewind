import type {VideoPlayerProps, VideoPlayerState} from './VideoPlayer.types';
import type {
  VideoRef,
  OnLoadStartData,
  OnLoadData,
  OnProgressData,
  OnSeekData,
  OnVideoErrorData,
} from 'react-native-video';
import {SafeAreaView as _SafeAreaView} from 'react-native-safe-area-context';
import _default from './../components/Text';
import Slider from '../components/Slider';
import Runtime927 from 'lodash/padStart';
import * as React from 'react';
import * as ReactNative from 'react-native';
import TextTicker from 'react-native-text-ticker';
import VideoComponent from 'react-native-video';
import * as constants from '../theme/constants';
import icons from '../theme/icons';
import * as Index from '../components/index';
import topVignette from '../../assets/images/top-vignette.png';
import bottomVignette from '../../assets/images/bottom-vignette.png';
const defaults = {
  toggleResizeModeOnFullscreen: true,
  controlAnimationTiming: 500,
  doubleTapTime: 130,
  playInBackground: false,
  playWhenInactive: false,
  resizeMode: 'contain',
  isFullscreen: false,
  showOnStart: true,
  paused: false,
  repeat: false,
  muted: false,
  title: '',
  rate: 1,
  showTimeRemaining: true,
  showHours: false,
} satisfies VideoPlayerProps;
type Props = VideoPlayerProps & Required<Pick<VideoPlayerProps, keyof typeof defaults>>;
interface Internals {
  controlTimeoutDelay: number;
  controlTimeout: ReturnType<typeof setTimeout> | null;
  tapActionTimeout: ReturnType<typeof setTimeout> | null;
  iconOffset: number;
  seekerWidth: number;
  ref: VideoRef | null;
  scrubbingTimeStep: number;
  tapAnywhereToPause?: boolean;
}
class VideoPlayer extends React.Component<Props, VideoPlayerState> {
  mounted = false;
  loaderAnimation?: ReactNative.Animated.CompositeAnimation;
  scrubTimeout?: ReturnType<typeof setTimeout>;
  static defaultProps = defaults;
  lastTouch = Date.now();
  layoutHeight = 0;
  componentDidUpdate = (previous: Props) => {
    const isFullscreen = this.props.isFullscreen;
    if (previous.isFullscreen !== isFullscreen) {
      this.setState({
        isFullscreen,
      });
    }
  };
  _onPanResponderRelease = (
    _event: ReactNative.GestureResponderEvent,
    {dy}: ReactNative.PanResponderGestureState,
  ) => {
    if (dy != 0) {
      if (dy < -10) {
        this.events.onEnterFullscreen?.();
      } else if (dy > 10) {
        this.events.onExitFullscreen?.();
      } else {
        this.events.onScreenTouch();
      }
    } else {
      this.events.onScreenTouch();
    }
  };
  _panResponder = ReactNative.PanResponder.create({
    onStartShouldSetPanResponderCapture: (e) => {
      if (e.nativeEvent.pageY > 80 && e.nativeEvent.pageY < this.layoutHeight - 100) {
        return true;
      }
      return false;
    },
    onPanResponderRelease: this._onPanResponderRelease,
  });
  state: VideoPlayerState = {
    resizeMode: this.props.resizeMode,
    paused: this.props.paused,
    muted: this.props.muted,
    rate: this.props.rate,
    isFullscreen: this.props.isFullScreen || this.props.resizeMode === 'cover' || false,
    showTimeRemaining: this.props.showTimeRemaining,
    showHours: this.props.showHours,
    seekerFillWidth: 0,
    showControls: this.props.showOnStart,
    seekerPosition: 0,
    seekerOffset: 0,
    seeking: false,
    originallyPaused: false,
    scrubbing: false,
    loading: false,
    currentTime: 0,
    error: false,
    duration: 0,
  };
  opts = {
    playWhenInactive: this.props.playWhenInactive,
    playInBackground: this.props.playInBackground,
    repeat: this.props.repeat,
    title: this.props.title,
  };
  events = {
    onError: this.props.onError || this._onError.bind(this),
    onBack: this.props.onBack || this._onBack.bind(this),
    onEnd: this.props.onEnd || this._onEnd.bind(this),
    onScreenTouch: this._onScreenTouch.bind(this),
    onEnterFullscreen: this.props.onEnterFullscreen,
    onExitFullscreen: this.props.onExitFullscreen,
    onShowControls: this.props.onShowControls,
    onHideControls: this.props.onHideControls,
    onLoadStart: this._onLoadStart.bind(this),
    onProgress: this._onProgress.bind(this),
    onSeek: this._onSeek.bind(this),
    onLoad: this._onLoad.bind(this),
    onPause: this.props.onPause,
    onPlay: this.props.onPlay,
  };
  methods = {
    toggleFullscreen: this._toggleFullscreen.bind(this),
    togglePlayPause: this._togglePlayPause.bind(this),
    toggleControls: this._toggleControls.bind(this),
    toggleTimer: this._toggleTimer.bind(this),
  };
  player: Internals = {
    controlTimeoutDelay: this.props.controlTimeout || 15000,
    controlTimeout: null,
    tapActionTimeout: null,
    iconOffset: 0,
    seekerWidth: 1,
    ref: null,
    scrubbingTimeStep: this.props.scrubbing || 0,
    tapAnywhereToPause: this.props.tapAnywhereToPause,
  };
  animations = {
    bottomControl: {
      marginBottom: new ReactNative.Animated.Value(0),
      opacity: new ReactNative.Animated.Value(this.props.showOnStart ? 1 : 0),
    },
    topControl: {
      marginTop: new ReactNative.Animated.Value(0),
      opacity: new ReactNative.Animated.Value(this.props.showOnStart ? 1 : 0),
    },
    video: {
      opacity: new ReactNative.Animated.Value(1),
    },
    loader: {
      rotate: new ReactNative.Animated.Value(0),
      MAX_VALUE: 360,
    },
  };
  styles: {videoStyle: Props['videoStyle']; containerStyle: Props['style']} = {
    videoStyle: this.props.videoStyle || {},
    containerStyle: this.props.style || {},
  };
  _onLoadStart(event?: OnLoadStartData) {
    this.setState(
      {
        loading: true,
      },
      () => this.loadAnimation(),
    );
    if (event) this.props.onLoadStart?.(event);
  }
  _onLoad(event: OnLoadData) {
    this.setState({
      duration: event.duration,
      loading: false,
    });
    if (this.state.showControls) this.setControlTimeout();
    this.props.onLoad?.(event);
  }
  _onProgress(event: OnProgressData) {
    if (this.state.scrubbing) return;
    this.setState({
      currentTime: event.currentTime,
    });
    if (!this.state.seeking)
      this.setSeekerPosition(this.calculateSeekerPosition(event.currentTime));
    this.props.onProgress?.(event);
  }
  _onSeek(event: OnSeekData) {
    const state = this.state;
    if (state.scrubbing) {
      if (!state.seeking) {
        this.setControlTimeout();
      }
      this.setState({
        scrubbing: false,
        currentTime: event.currentTime,
        paused: state.seeking ? state.paused : state.originallyPaused,
      });
    }
  }
  _onEnd() {}
  _onError(event: OnVideoErrorData) {
    this.setState({
      error: true,
      loading: false,
    });
    this.props.onError?.(event);
  }
  _onScreenTouch() {
    if (this.player.tapActionTimeout) {
      clearTimeout(this.player.tapActionTimeout);
      this.methods.togglePlayPause();
      this.player.tapActionTimeout = null;
    } else {
      this.player.tapActionTimeout = setTimeout(() => {
        this.methods.toggleControls();
        this.player.tapActionTimeout = null;
      }, this.props.doubleTapTime);
    }
  }
  setControlTimeout() {
    this.clearControlTimeout();
    this.player.controlTimeout = setTimeout(() => {
      this._hideControls();
    }, this.player.controlTimeoutDelay);
  }
  clearControlTimeout() {
    clearTimeout(this.player.controlTimeout);
    this.player.controlTimeout = null;
  }
  resetControlTimeout() {
    this.clearControlTimeout();
    this.setControlTimeout();
  }
  hideControlAnimation() {
    ReactNative.Animated.parallel([
      ReactNative.Animated.timing(this.animations.topControl.opacity, {
        toValue: 0,
        duration: this.props.controlAnimationTiming,
        useNativeDriver: false,
      }),
      ReactNative.Animated.timing(this.animations.topControl.marginTop, {
        toValue: -100,
        duration: this.props.controlAnimationTiming,
        useNativeDriver: false,
      }),
      ReactNative.Animated.timing(this.animations.bottomControl.opacity, {
        toValue: 0,
        duration: this.props.controlAnimationTiming,
        useNativeDriver: false,
      }),
      ReactNative.Animated.timing(this.animations.bottomControl.marginBottom, {
        toValue: -100,
        duration: this.props.controlAnimationTiming,
        useNativeDriver: false,
      }),
    ]).start();
  }
  showControlAnimation() {
    ReactNative.Animated.parallel([
      ReactNative.Animated.timing(this.animations.topControl.opacity, {
        toValue: 1,
        useNativeDriver: false,
        duration: this.props.controlAnimationTiming,
      }),
      ReactNative.Animated.timing(this.animations.topControl.marginTop, {
        toValue: 0,
        useNativeDriver: false,
        duration: this.props.controlAnimationTiming,
      }),
      ReactNative.Animated.timing(this.animations.bottomControl.opacity, {
        toValue: 1,
        useNativeDriver: false,
        duration: this.props.controlAnimationTiming,
      }),
      ReactNative.Animated.timing(this.animations.bottomControl.marginBottom, {
        toValue: 0,
        useNativeDriver: false,
        duration: this.props.controlAnimationTiming,
      }),
    ]).start();
  }
  loadAnimation() {
    if (this.mounted && this.state.loading) {
      this.loaderAnimation = ReactNative.Animated.sequence([
        ReactNative.Animated.timing(this.animations.loader.rotate, {
          toValue: this.animations.loader.MAX_VALUE,
          duration: 1500,
          easing: ReactNative.Easing.linear,
          useNativeDriver: false,
        }),
        ReactNative.Animated.timing(this.animations.loader.rotate, {
          toValue: 0,
          duration: 0,
          easing: ReactNative.Easing.linear,
          useNativeDriver: false,
        }),
      ]);
      this.loaderAnimation.start(this.loadAnimation.bind(this));
    }
  }
  _hideControls() {
    if (this.mounted) {
      this.hideControlAnimation();
      if (typeof this.events.onHideControls === 'function') {
        this.events.onHideControls();
      }
      this.setState({
        showControls: false,
      });
    }
  }
  _toggleControls() {
    this.setState(
      (state) => ({
        showControls: !state.showControls,
      }),
      () => {
        if (this.state.showControls) {
          this.showControlAnimation();
          this.setControlTimeout();
          if (typeof this.events.onShowControls === 'function') {
            this.events.onShowControls();
          }
        } else {
          this.hideControlAnimation();
          this.clearControlTimeout();
          if (typeof this.events.onHideControls === 'function') {
            this.events.onHideControls();
          }
        }
      },
    );
  }
  _toggleFullscreen() {
    this.setState(
      (state) => ({
        isFullscreen: !state.isFullscreen,
        resizeMode: this.props.toggleResizeModeOnFullscreen
          ? !state.isFullscreen
            ? 'cover'
            : 'contain'
          : state.resizeMode,
      }),
      () => {
        if (this.state.isFullscreen) {
          if (typeof this.events.onEnterFullscreen === 'function') {
            this.events.onEnterFullscreen();
          }
        } else if (typeof this.events.onExitFullscreen === 'function') {
          this.events.onExitFullscreen();
        }
      },
    );
  }
  _togglePlayPause() {
    this.setState(
      (state) => ({
        paused: !state.paused,
      }),
      () => {
        if (this.state.paused) {
          if (typeof this.events.onPause === 'function') {
            this.events.onPause();
          }
        } else if (typeof this.events.onPlay === 'function') {
          this.events.onPlay();
        }
      },
    );
  }
  _toggleTimer() {
    this.setState((state) => ({
      showTimeRemaining: !state.showTimeRemaining,
    }));
  }
  _onBack() {
    if (this.props.navigator && this.props.navigator.pop) {
      this.props.navigator.pop();
    }
  }
  calculateTime() {
    if (this.state.showTimeRemaining) {
      const e = this.state.duration - this.state.currentTime;
      return `${this.formatTime(e)}`;
    }
    return this.formatTime(this.state.currentTime);
  }
  formatTime(seconds = 0) {
    const t = '';
    seconds = Math.min(Math.max(seconds, 0), this.state.duration);
    if (this.state.showHours) {
      return `${t}${Runtime927(Math.floor(seconds / 3600).toFixed(0), 2, '0')}:${Runtime927((Math.floor(seconds / 60) % 60).toFixed(0), 2, '0')}:${Runtime927(Math.floor(seconds % 60).toFixed(0), 2, '0')}`;
    }
    return `${t}${Runtime927(Math.floor(seconds / 60).toFixed(0), 2, '0')}:${Runtime927(Math.floor(seconds % 60).toFixed(0), 2, '0')}`;
  }
  setSeekerPosition(inputPosition = 0) {
    const position = this.constrainToSeekerMinMax(inputPosition);
    this.setState((state) => ({
      seekerFillWidth: position,
      seekerPosition: position,
      seekerOffset: state.seeking ? state.seekerOffset : position,
    }));
  }
  constrainToSeekerMinMax(position = 0) {
    if (position <= 0) {
      return 0;
    }
    if (position >= this.player.seekerWidth) {
      return this.player.seekerWidth;
    }
    return position;
  }
  calculateSeekerPosition(currentTime = this.state.currentTime) {
    const e = currentTime / this.state.duration;
    return this.player.seekerWidth * e;
  }
  calculateTimeFromSeekerPosition(position = this.state.seekerPosition) {
    const e = position / this.player.seekerWidth;
    return this.state.duration * e;
  }
  seekTo(seconds = 0) {
    this.player.ref!.seek(seconds);
    this.setState({
      currentTime: seconds,
    });
  }
  UNSAFE_componentWillReceiveProps(next: Props) {
    if (this.state.paused !== next.paused) {
      this.setState({
        paused: next.paused,
      });
    }
    if (this.styles.videoStyle !== next.videoStyle) {
      this.styles.videoStyle = next.videoStyle;
    }
    if (this.styles.containerStyle !== next.style) {
      this.styles.containerStyle = next.style;
    }
  }
  componentDidMount() {
    this.mounted = true;
  }
  componentWillUnmount() {
    this.mounted = false;
    this.clearControlTimeout();
    clearTimeout(this.player.tapActionTimeout);
    clearTimeout(this.scrubTimeout);
    this.loaderAnimation?.stop();
    this.animations.loader.rotate.stopAnimation();
  }
  renderControl(
    content: React.ReactNode,
    action: (() => void) | undefined,
    style: ReactNative.StyleProp<ReactNative.ViewStyle> = {},
  ) {
    return (
      <ReactNative.TouchableHighlight
        underlayColor={'transparent'}
        activeOpacity={0.3}
        onPress={() => {
          this.resetControlTimeout();
          action?.();
        }}
        style={[g.controls.control, style]}
      >
        {content}
      </ReactNative.TouchableHighlight>
    );
  }
  renderNullControl() {
    return <ReactNative.View style={[g.controls.control]} />;
  }
  renderTopControls() {
    const e = this.props.disableBack ? this.renderNullControl() : this.renderBack();
    const n = this.props.TopRight
      ? this.renderControl(this.props.TopRight, this.methods.toggleTimer)
      : this.renderNullControl();
    return (
      <ReactNative.Animated.View
        style={[
          g.controls.top,
          {
            opacity: this.animations.topControl.opacity,
            marginTop: this.animations.topControl.marginTop,
          },
        ]}
      >
        <ReactNative.ImageBackground
          source={topVignette}
          style={[g.controls.column]}
          imageStyle={[g.controls.vignette]}
        >
          {React.createElement(
            _SafeAreaView,
            {
              style: g.controls.topControlGroup,
            },
            e,
            this.renderTitle(),
            n,
          )}
        </ReactNative.ImageBackground>
      </ReactNative.Animated.View>
    );
  }
  renderBack() {
    return this.renderControl(
      <Index.Icon name={this.state.isFullscreen ? icons.CHEVRON_DOWN : icons.WINDOW_CLOSE} />,
      this.state.isFullscreen ? this.events.onExitFullscreen : this.events.onBack,
    );
  }
  renderFullscreen() {
    const e = this.state.isFullscreen === true ? icons.FULLSCREEN_EXIT : icons.FULLSCREEN;
    return this.renderControl(
      <Index.Icon name={e} />,
      this.methods.toggleFullscreen,
      g.controls.fullscreen,
    );
  }
  renderBottomControls() {
    const e = this.props.disableSeekbar ? this.renderNullControl() : this.renderSeekbar();
    const n = this.props.disablePlayPause ? this.renderNullControl() : this.renderPlayPause();
    const o = this.props.disableFullscreen ? this.renderNullControl() : this.renderFullscreen();
    const r = this.props.disableTimer ? this.renderNullControl() : this.renderTimer();
    return (
      <ReactNative.Animated.View
        style={[
          g.controls.bottom,
          {
            opacity: this.animations.bottomControl.opacity,
            marginBottom: this.animations.bottomControl.marginBottom,
          },
        ]}
      >
        <ReactNative.ImageBackground
          source={bottomVignette}
          style={[g.controls.column]}
          imageStyle={[g.controls.vignette]}
        >
          {e}
          {React.createElement(
            _SafeAreaView,
            {
              style: [g.controls.row, g.controls.bottomControlGroup],
            },
            n,
            r,
            o,
          )}
        </ReactNative.ImageBackground>
      </ReactNative.Animated.View>
    );
  }
  renderSeekbar() {
    return (
      <ReactNative.View style={g.seekbar.container} collapsable={false}>
        <Slider
          style={{
            width: '100%',
          }}
          value={this.state.seekerPosition}
          minimumValue={0}
          maximumValue={1}
          minimumTrackTintColor={constants.COLORS.primary}
          maximumTrackTintColor={constants.COLORS.primaryAlpha50}
          onSlidingStart={(t) => {
            this.clearControlTimeout();
            this.setSeekerPosition(t);
            this.setState((state) => ({
              seeking: true,
              originallyPaused: state.paused,
              scrubbing: false,
              paused: this.player.scrubbingTimeStep > 0 ? true : state.paused,
            }));
          }}
          onValueChange={(t) => {
            this.setSeekerPosition(t);
            const e_state = this.state;
            if (this.player.scrubbingTimeStep > 0 && !e_state.loading && !e_state.scrubbing) {
              const o = this.calculateTimeFromSeekerPosition(t);
              const i = 1000 * Math.abs(e_state.currentTime - o);
              if (o < e_state.duration && i >= this.player.scrubbingTimeStep) {
                this.setState({
                  scrubbing: true,
                });
                this.scrubTimeout = setTimeout(() => {
                  this.player.ref!.seek(o, this.player.scrubbingTimeStep);
                }, 1);
              }
            }
          }}
          onSlidingComplete={(t) => {
            this.setSeekerPosition(t);
            const n = this.calculateTimeFromSeekerPosition(t);
            const e_state = this.state;
            if (n >= e_state.duration && !e_state.loading) {
              this.setState({
                paused: true,
              });
              this.events.onEnd();
            } else if (e_state.scrubbing) {
              this.setState({
                seeking: false,
              });
            } else {
              this.seekTo(n);
              this.setControlTimeout();
              this.setState({
                paused: e_state.originallyPaused,
                seeking: false,
              });
            }
          }}
        />
      </ReactNative.View>
    );
  }
  renderPlayPause() {
    const e = this.state.paused === true ? icons.PLAY : icons.PAUSE;
    return this.renderControl(
      <Index.Icon name={e} />,
      this.methods.togglePlayPause,
      g.controls.playPause,
    );
  }
  renderTitle() {
    if (this.props.title) {
      return (
        <ReactNative.View style={[g.controls.title]}>
          <TextTicker
            style={[g.controls.text, g.controls.titleText]}
            disabled={!this.state.showControls}
          >
            {this.props.title || ''}
          </TextTicker>
        </ReactNative.View>
      );
    }
    return null;
  }
  renderTimer() {
    return this.renderControl(
      React.createElement(
        _default,
        {
          style: g.controls.timerText,
        },
        this.calculateTime(),
      ),
      this.methods.toggleTimer,
      g.controls.timer,
    );
  }
  renderLoader() {
    if (this.state.loading) {
      return (
        <ReactNative.View style={g.loader.container}>
          <Index.Spinkit />
        </ReactNative.View>
      );
    }
    return null;
  }
  renderError() {
    if (this.state.error) {
      return (
        <ReactNative.View style={g.error.container}>
          <ReactNative.Image style={g.error.icon} />
          {React.createElement(
            _default,
            {
              style: g.error.text,
            },
            'Video unavailable',
          )}
        </ReactNative.View>
      );
    }
    return null;
  }
  render() {
    return (
      <ReactNative.View
        style={[g.player.container, this.styles.containerStyle]}
        {...this._panResponder.panHandlers}
        onLayout={(t) => {
          this.layoutHeight = t.nativeEvent.layout.height;
        }}
      >
        <VideoComponent
          {...this.props}
          ref={(t) => {
            this.props.onRef?.(t);
            this.player.ref = t;
          }}
          resizeMode={this.state.resizeMode}
          paused={this.state.paused}
          rate={this.state.rate}
          onLoadStart={this.events.onLoadStart}
          onProgress={this.events.onProgress}
          onError={this.events.onError}
          onLoad={this.events.onLoad}
          onEnd={this.events.onEnd}
          onSeek={this.events.onSeek}
          style={[g.player.video, this.styles.videoStyle]}
          source={this.props.source}
        />
        {this.renderError()}
        {this.renderLoader()}
        {this.renderTopControls()}
        {this.renderBottomControls()}
      </ReactNative.View>
    );
  }
}
export default VideoPlayer;
const g = {
  player: ReactNative.StyleSheet.create({
    container: {
      overflow: 'hidden',
      backgroundColor: '#000',
      flex: 1,
      alignSelf: 'stretch',
      justifyContent: 'space-between',
    },
    video: {
      overflow: 'hidden',
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
  }),
  error: ReactNative.StyleSheet.create({
    container: {
      backgroundColor: 'rgba( 0, 0, 0, 0.5 )',
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      justifyContent: 'center',
      alignItems: 'center',
    },
    icon: {
      marginBottom: 16,
    },
    text: {
      backgroundColor: 'transparent',
      color: '#f27474',
    },
  }),
  loader: ReactNative.StyleSheet.create({
    container: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      alignItems: 'center',
      justifyContent: 'center',
    },
  }),
  controls: ReactNative.StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: null,
      width: null,
    },
    column: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: null,
      width: null,
      paddingBottom: 12,
    },
    vignette: {
      resizeMode: 'stretch',
    },
    control: {
      padding: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      backgroundColor: 'transparent',
      color: '#FFF',
      fontSize: 14,
      textAlign: 'center',
    },
    pullRight: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    top: {
      flex: 1,
      alignItems: 'stretch',
      justifyContent: 'flex-start',
    },
    bottom: {
      alignItems: 'stretch',
      flex: 2,
      justifyContent: 'flex-end',
    },
    topControlGroup: {
      alignSelf: 'stretch',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'row',
      width: null,
      margin: 12,
      marginHorizontal: 6,
      marginBottom: 18,
    },
    bottomControlGroup: {
      alignSelf: 'stretch',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginLeft: 12,
      marginRight: 12,
      marginBottom: 8,
    },
    fullscreen: {
      flexDirection: 'row',
    },
    playPause: {
      position: 'relative',
      zIndex: 0,
    },
    title: {
      alignItems: 'center',
      flex: 1,
      flexDirection: 'column',
      padding: 0,
    },
    titleText: {
      fontSize: 16,
      fontWeight: '600',
      textAlign: 'center',
    },
    timer: {},
    timerText: {
      backgroundColor: 'transparent',
      color: '#FFF',
      fontSize: 16,
      textAlign: 'right',
    },
  }),
  seekbar: ReactNative.StyleSheet.create({
    container: {
      alignSelf: 'stretch',
      height: 28,
      marginLeft: 20,
      marginRight: 20,
      marginBottom: -8,
      alignItems: 'center',
      justifyContent: 'center',
    },
  }),
  text: {
    fontSize: 16,
  },
};
