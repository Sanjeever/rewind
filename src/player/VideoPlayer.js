Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var slider = babelHelpers.interopRequireDefault(require("@react-native-community/slider")),
  Runtime927 = babelHelpers.interopRequireDefault(require("@runtime/927")),
  React = babelHelpers.interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  reactNativeTextTicker = babelHelpers.interopRequireDefault(require("react-native-text-ticker")),
  reactNativeVideo = babelHelpers.interopRequireDefault(require("react-native-video")),
  constants = require("../theme/constants"),
  icons = babelHelpers.interopRequireDefault(require("../theme/icons")),
  components = require("../components/index"),
  m = function (e) {
    function n(e) {
      var t;
      babelHelpers.classCallCheck(this, n);
      (t = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(n).call(this, e))).lastTouch = Date.now();
      t.layoutHeight = 0;
      t.componentDidUpdate = function (e) {
        var n = t.props.isFullscreen;
        e.isFullscreen !== n && t.setState({
          isFullscreen: n
        });
      };
      t._onPanResponderRelease = function (e, n) {
        var o = n.dy;
        0 != o ? o < -10 ? t.events.onEnterFullscreen() : o > 10 ? t.events.onExitFullscreen() : t.events.onScreenTouch() : t.events.onScreenTouch();
      };
      t._panResponder = ReactNative.PanResponder.create({
        onStartShouldSetPanResponderCapture: function (e) {
          if (e.nativeEvent.pageY > 80 && e.nativeEvent.pageY < t.layoutHeight - 100) return true;
        },
        onPanResponderRelease: t._onPanResponderRelease
      });
      t.state = {
        resizeMode: t.props.resizeMode,
        paused: t.props.paused,
        muted: t.props.muted,
        rate: t.props.rate,
        isFullscreen: t.props.isFullScreen || 'cover' === t.props.resizeMode || false,
        showTimeRemaining: t.props.showTimeRemaining,
        showHours: t.props.showHours,
        seekerFillWidth: 0,
        showControls: t.props.showOnStart,
        seekerPosition: 0,
        seekerOffset: 0,
        seeking: false,
        originallyPaused: false,
        scrubbing: false,
        loading: false,
        currentTime: 0,
        error: false,
        duration: 0
      };
      t.opts = {
        playWhenInactive: t.props.playWhenInactive,
        playInBackground: t.props.playInBackground,
        repeat: t.props.repeat,
        title: t.props.title
      };
      t.events = {
        onError: t.props.onError || t._onError.bind(babelHelpers.assertThisInitialized(babelHelpers.assertThisInitialized(t))),
        onBack: t.props.onBack || t._onBack.bind(babelHelpers.assertThisInitialized(babelHelpers.assertThisInitialized(t))),
        onEnd: t.props.onEnd || t._onEnd.bind(babelHelpers.assertThisInitialized(babelHelpers.assertThisInitialized(t))),
        onScreenTouch: t._onScreenTouch.bind(babelHelpers.assertThisInitialized(babelHelpers.assertThisInitialized(t))),
        onEnterFullscreen: t.props.onEnterFullscreen,
        onExitFullscreen: t.props.onExitFullscreen,
        onShowControls: t.props.onShowControls,
        onHideControls: t.props.onHideControls,
        onLoadStart: t._onLoadStart.bind(babelHelpers.assertThisInitialized(babelHelpers.assertThisInitialized(t))),
        onProgress: t._onProgress.bind(babelHelpers.assertThisInitialized(babelHelpers.assertThisInitialized(t))),
        onSeek: t._onSeek.bind(babelHelpers.assertThisInitialized(babelHelpers.assertThisInitialized(t))),
        onLoad: t._onLoad.bind(babelHelpers.assertThisInitialized(babelHelpers.assertThisInitialized(t))),
        onPause: t.props.onPause,
        onPlay: t.props.onPlay
      };
      t.methods = {
        toggleFullscreen: t._toggleFullscreen.bind(babelHelpers.assertThisInitialized(babelHelpers.assertThisInitialized(t))),
        togglePlayPause: t._togglePlayPause.bind(babelHelpers.assertThisInitialized(babelHelpers.assertThisInitialized(t))),
        toggleControls: t._toggleControls.bind(babelHelpers.assertThisInitialized(babelHelpers.assertThisInitialized(t))),
        toggleTimer: t._toggleTimer.bind(babelHelpers.assertThisInitialized(babelHelpers.assertThisInitialized(t)))
      };
      t.player = {
        controlTimeoutDelay: t.props.controlTimeout || 15e3,
        controlTimeout: null,
        tapActionTimeout: null,
        iconOffset: 0,
        seekerWidth: 1,
        ref: reactNativeVideo.default,
        scrubbingTimeStep: t.props.scrubbing || 0,
        tapAnywhereToPause: t.props.tapAnywhereToPause
      };
      var o = t.props.showOnStart ? 1 : 0;
      t.animations = {
        bottomControl: {
          marginBottom: new ReactNative.Animated.Value(0),
          opacity: new ReactNative.Animated.Value(o)
        },
        topControl: {
          marginTop: new ReactNative.Animated.Value(0),
          opacity: new ReactNative.Animated.Value(o)
        },
        video: {
          opacity: new ReactNative.Animated.Value(1)
        },
        loader: {
          rotate: new ReactNative.Animated.Value(0),
          MAX_VALUE: 360
        }
      };
      t.styles = {
        videoStyle: t.props.videoStyle || {},
        containerStyle: t.props.style || {}
      };
      return t;
    }
    babelHelpers.createClass(n, [{
      key: "_onLoadStart",
      value: function () {
        var e,
          t = this.state;
        (t.loading = true, this.loadAnimation(), this.setState(t), 'function' == typeof this.props.onLoadStart) && (e = this.props).onLoadStart.apply(e, arguments);
      }
    }, {
      key: "_onLoad",
      value: function () {
        var e,
          t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
          n = this.state;
        (n.duration = t.duration, n.loading = false, this.setState(n), n.showControls && this.setControlTimeout(), 'function' == typeof this.props.onLoad) && (e = this.props).onLoad.apply(e, arguments);
      }
    }, {
      key: "_onProgress",
      value: function () {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
          t = this.state;
        if (!t.scrubbing) {
          if (t.currentTime = e.currentTime, !t.seeking) {
            var n = this.calculateSeekerPosition();
            this.setSeekerPosition(n);
          }
          var o;
          if ('function' == typeof this.props.onProgress) (o = this.props).onProgress.apply(o, arguments);
          this.setState(t);
        }
      }
    }, {
      key: "_onSeek",
      value: function () {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
          t = this.state;
        t.scrubbing && (t.scrubbing = false, t.currentTime = e.currentTime, t.seeking || (this.setControlTimeout(), t.paused = t.originallyPaused), this.setState(t));
      }
    }, {
      key: "_onEnd",
      value: function () {}
    }, {
      key: "_onError",
      value: function (e) {
        var t = this.state;
        t.error = true;
        t.loading = false;
        this.setState(t);
      }
    }, {
      key: "_onScreenTouch",
      value: function () {
        var e = this;
        this.player.tapActionTimeout ? (clearTimeout(this.player.tapActionTimeout), this.methods.togglePlayPause(), this.player.tapActionTimeout = null) : this.player.tapActionTimeout = setTimeout(function () {
          e.methods.toggleControls();
          e.player.tapActionTimeout = null;
        }, this.props.doubleTapTime);
      }
    }, {
      key: "setControlTimeout",
      value: function () {
        var e = this;
        this.player.controlTimeout = setTimeout(function () {
          e._hideControls();
        }, this.player.controlTimeoutDelay);
      }
    }, {
      key: "clearControlTimeout",
      value: function () {
        clearTimeout(this.player.controlTimeout);
      }
    }, {
      key: "resetControlTimeout",
      value: function () {
        this.clearControlTimeout();
        this.setControlTimeout();
      }
    }, {
      key: "hideControlAnimation",
      value: function () {
        ReactNative.Animated.parallel([ReactNative.Animated.timing(this.animations.topControl.opacity, {
          toValue: 0,
          duration: this.props.controlAnimationTiming,
          useNativeDriver: false
        }), ReactNative.Animated.timing(this.animations.topControl.marginTop, {
          toValue: -100,
          duration: this.props.controlAnimationTiming,
          useNativeDriver: false
        }), ReactNative.Animated.timing(this.animations.bottomControl.opacity, {
          toValue: 0,
          duration: this.props.controlAnimationTiming,
          useNativeDriver: false
        }), ReactNative.Animated.timing(this.animations.bottomControl.marginBottom, {
          toValue: -100,
          duration: this.props.controlAnimationTiming,
          useNativeDriver: false
        })]).start();
      }
    }, {
      key: "showControlAnimation",
      value: function () {
        ReactNative.Animated.parallel([ReactNative.Animated.timing(this.animations.topControl.opacity, {
          toValue: 1,
          useNativeDriver: false,
          duration: this.props.controlAnimationTiming
        }), ReactNative.Animated.timing(this.animations.topControl.marginTop, {
          toValue: 0,
          useNativeDriver: false,
          duration: this.props.controlAnimationTiming
        }), ReactNative.Animated.timing(this.animations.bottomControl.opacity, {
          toValue: 1,
          useNativeDriver: false,
          duration: this.props.controlAnimationTiming
        }), ReactNative.Animated.timing(this.animations.bottomControl.marginBottom, {
          toValue: 0,
          useNativeDriver: false,
          duration: this.props.controlAnimationTiming
        })]).start();
      }
    }, {
      key: "loadAnimation",
      value: function () {
        this.state.loading && ReactNative.Animated.sequence([ReactNative.Animated.timing(this.animations.loader.rotate, {
          toValue: this.animations.loader.MAX_VALUE,
          duration: 1500,
          easing: ReactNative.Easing.linear,
          useNativeDriver: false
        }), ReactNative.Animated.timing(this.animations.loader.rotate, {
          toValue: 0,
          duration: 0,
          easing: ReactNative.Easing.linear,
          useNativeDriver: false
        })]).start(this.loadAnimation.bind(this));
      }
    }, {
      key: "_hideControls",
      value: function () {
        if (this.mounted) {
          var e = this.state;
          e.showControls = false;
          this.hideControlAnimation();
          'function' == typeof this.events.onHideControls && this.events.onHideControls();
          this.setState(e);
        }
      }
    }, {
      key: "_toggleControls",
      value: function () {
        var e = this.state;
        e.showControls = !e.showControls;
        e.showControls ? (this.showControlAnimation(), this.setControlTimeout(), 'function' == typeof this.events.onShowControls && this.events.onShowControls()) : (this.hideControlAnimation(), this.clearControlTimeout(), 'function' == typeof this.events.onHideControls && this.events.onHideControls());
        this.setState(e);
      }
    }, {
      key: "_toggleFullscreen",
      value: function () {
        var e = this.state;
        e.isFullscreen = !e.isFullscreen;
        this.props.toggleResizeModeOnFullscreen && (e.resizeMode = true === e.isFullscreen ? 'cover' : 'contain');
        e.isFullscreen ? 'function' == typeof this.events.onEnterFullscreen && this.events.onEnterFullscreen() : 'function' == typeof this.events.onExitFullscreen && this.events.onExitFullscreen();
        this.setState(e);
      }
    }, {
      key: "_togglePlayPause",
      value: function () {
        var e = this.state;
        e.paused = !e.paused;
        e.paused ? 'function' == typeof this.events.onPause && this.events.onPause() : 'function' == typeof this.events.onPlay && this.events.onPlay();
        this.setState(e);
      }
    }, {
      key: "_toggleTimer",
      value: function () {
        var e = this.state;
        e.showTimeRemaining = !e.showTimeRemaining;
        this.setState(e);
      }
    }, {
      key: "_onBack",
      value: function () {
        this.props.navigator && this.props.navigator.pop && this.props.navigator.pop();
      }
    }, {
      key: "calculateTime",
      value: function () {
        if (this.state.showTimeRemaining) {
          var e = this.state.duration - this.state.currentTime;
          return "" + this.formatTime(e);
        }
        return this.formatTime(this.state.currentTime);
      }
    }, {
      key: "formatTime",
      value: function () {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0,
          t = this.state.showRemainingTime ? '-' : '';
        e = Math.min(Math.max(e, 0), this.state.duration);
        return this.state.showHours ? "" + t + (0, Runtime927.default)(Math.floor(e / 3600).toFixed(0), 2, 0) + ":" + (0, Runtime927.default)((Math.floor(e / 60) % 60).toFixed(0), 2, 0) + ":" + (0, Runtime927.default)(Math.floor(e % 60).toFixed(0), 2, 0) : "" + t + (0, Runtime927.default)(Math.floor(e / 60).toFixed(0), 2, 0) + ":" + (0, Runtime927.default)(Math.floor(e % 60).toFixed(0), 2, 0);
      }
    }, {
      key: "setSeekerPosition",
      value: function () {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0,
          t = this.state;
        e = this.constrainToSeekerMinMax(e);
        t.seekerFillWidth = e;
        t.seekerPosition = e;
        t.seeking || (t.seekerOffset = e);
        this.setState(t);
      }
    }, {
      key: "constrainToSeekerMinMax",
      value: function () {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0;
        return e <= 0 ? 0 : e >= this.player.seekerWidth ? this.player.seekerWidth : e;
      }
    }, {
      key: "calculateSeekerPosition",
      value: function () {
        var e = this.state.currentTime / this.state.duration;
        return this.player.seekerWidth * e;
      }
    }, {
      key: "calculateTimeFromSeekerPosition",
      value: function () {
        var e = this.state.seekerPosition / this.player.seekerWidth;
        return this.state.duration * e;
      }
    }, {
      key: "seekTo",
      value: function () {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0,
          t = this.state;
        t.currentTime = e;
        this.player.ref.seek(e);
        this.setState(t);
      }
    }, {
      key: "UNSAFE_componentWillReceiveProps",
      value: function (e) {
        this.state.paused !== e.paused && this.setState({
          paused: e.paused
        });
        this.styles.videoStyle !== e.videoStyle && (this.styles.videoStyle = e.videoStyle);
        this.styles.containerStyle !== e.style && (this.styles.containerStyle = e.style);
      }
    }, {
      key: "componentDidMount",
      value: function () {
        this.mounted = true;
      }
    }, {
      key: "componentWillUnmount",
      value: function () {
        this.mounted = false;
        this.clearControlTimeout();
      }
    }, {
      key: "renderControl",
      value: function (e, t) {
        var n = this,
          o = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
        return React.default.createElement(ReactNative.TouchableHighlight, {
          underlayColor: "transparent",
          activeOpacity: .3,
          onPress: function () {
            n.resetControlTimeout();
            t();
          },
          style: [g.controls.control, o]
        }, e);
      }
    }, {
      key: "renderNullControl",
      value: function () {
        return React.default.createElement(ReactNative.View, {
          style: [g.controls.control]
        });
      }
    }, {
      key: "renderTopControls",
      value: function () {
        var e = this.props.disableBack ? this.renderNullControl() : this.renderBack(),
          n = this.props.TopRight ? this.renderControl(this.props.TopRight, this.methods.toggleTimer) : this.renderNullControl();
        return React.default.createElement(ReactNative.Animated.View, {
          style: [g.controls.top, {
            opacity: this.animations.topControl.opacity,
            marginTop: this.animations.topControl.marginTop
          }]
        }, React.default.createElement(ReactNative.ImageBackground, {
          source: require("../modules/module-934"),
          style: [g.controls.column],
          imageStyle: [g.controls.vignette]
        }, React.default.createElement(ReactNative.SafeAreaView, {
          style: g.controls.topControlGroup
        }, e, this.renderTitle(), n)));
      }
    }, {
      key: "renderBack",
      value: function () {
        return this.renderControl(React.default.createElement(components.Icon, {
          name: this.state.isFullscreen ? icons.default.CHEVRON_DOWN : icons.default.WINDOW_CLOSE,
          style: g.controls.back
        }), this.state.isFullscreen ? this.events.onExitFullscreen : this.events.onBack, g.controls.back);
      }
    }, {
      key: "renderFullscreen",
      value: function () {
        var e = true === this.state.isFullscreen ? icons.default.FULLSCREEN_EXIT : icons.default.FULLSCREEN;
        return this.renderControl(React.default.createElement(components.Icon, {
          name: e
        }), this.methods.toggleFullscreen, g.controls.fullscreen);
      }
    }, {
      key: "renderBottomControls",
      value: function () {
        var e = this.props.disableSeekbar ? this.renderNullControl() : this.renderSeekbar(),
          n = this.props.disablePlayPause ? this.renderNullControl() : this.renderPlayPause(),
          o = this.props.disableFullscreen ? this.renderNullControl() : this.renderFullscreen(),
          r = this.props.disableTimer ? this.renderNullControl() : this.renderTimer();
        return React.default.createElement(ReactNative.Animated.View, {
          style: [g.controls.bottom, {
            opacity: this.animations.bottomControl.opacity,
            marginBottom: this.animations.bottomControl.marginBottom
          }]
        }, React.default.createElement(ReactNative.ImageBackground, {
          source: require("../modules/module-935"),
          style: [g.controls.column],
          imageStyle: [g.controls.vignette]
        }, e, React.default.createElement(ReactNative.SafeAreaView, {
          style: [g.controls.row, g.controls.bottomControlGroup]
        }, n, r, o)));
      }
    }, {
      key: "renderSeekbar",
      value: function () {
        var e = this;
        return React.default.createElement(ReactNative.View, {
          style: g.seekbar.container,
          collapsable: false
        }, React.default.createElement(slider.default, {
          style: {
            width: '100%'
          },
          value: this.state.seekerPosition,
          minimumValue: 0,
          maximumValue: 1,
          minimumTrackTintColor: constants.COLORS.primary,
          maximumTrackTintColor: constants.COLORS.primaryAlpha50,
          onSlidingStart: function (t) {
            var n = e.state;
            e.clearControlTimeout();
            e.setSeekerPosition(t);
            n.seeking = true;
            n.originallyPaused = n.paused;
            n.scrubbing = false;
            e.player.scrubbingTimeStep > 0 && (n.paused = true);
            e.setState(n);
          },
          onValueChange: function (t) {
            e.setSeekerPosition(t);
            var n = e.state;
            if (e.player.scrubbingTimeStep > 0 && !n.loading && !n.scrubbing) {
              var o = e.calculateTimeFromSeekerPosition(),
                i = 1e3 * Math.abs(n.currentTime - o);
              o < n.duration && i >= e.player.scrubbingTimeStep && (n.scrubbing = true, e.setState(n), setTimeout(function () {
                e.player.ref.seek(o, e.player.scrubbingTimeStep);
              }, 1));
            }
          },
          onSlidingComplete: function (t) {
            e.setSeekerPosition(t);
            var n = e.calculateTimeFromSeekerPosition(),
              o = e.state;
            n >= o.duration && !o.loading ? (o.paused = true, e.events.onEnd()) : o.scrubbing ? o.seeking = false : (e.seekTo(n), e.setControlTimeout(), o.paused = o.originallyPaused, o.seeking = false);
            e.setState(o);
          }
        }));
      }
    }, {
      key: "renderPlayPause",
      value: function () {
        var e = true === this.state.paused ? icons.default.PLAY : icons.default.PAUSE;
        return this.renderControl(React.default.createElement(components.Icon, {
          name: e
        }), this.methods.togglePlayPause, g.controls.playPause);
      }
    }, {
      key: "renderTitle",
      value: function () {
        return this.props.title ? React.default.createElement(ReactNative.View, {
          style: [g.controls.title]
        }, React.default.createElement(reactNativeTextTicker.default, {
          style: [g.controls.text, g.controls.titleText],
          disabled: !this.state.showControls
        }, this.props.title || '')) : null;
      }
    }, {
      key: "renderTimer",
      value: function () {
        return this.renderControl(React.default.createElement(ReactNative.Text, {
          style: g.controls.timerText
        }, this.calculateTime()), this.methods.toggleTimer, g.controls.timer);
      }
    }, {
      key: "renderLoader",
      value: function () {
        return this.state.loading ? React.default.createElement(ReactNative.View, {
          style: g.loader.container
        }, React.default.createElement(components.Spinkit, {
          style: g.loader.icon
        })) : null;
      }
    }, {
      key: "renderError",
      value: function () {
        return this.state.error ? React.default.createElement(ReactNative.View, {
          style: g.error.container
        }, React.default.createElement(ReactNative.Image, {
          style: g.error.icon
        }), React.default.createElement(ReactNative.Text, {
          style: g.error.text
        }, "Video unavailable")) : null;
      }
    }, {
      key: "render",
      value: function () {
        var e = this;
        return React.default.createElement(ReactNative.View, babelHelpers.extends({
          style: [g.player.container, this.styles.containerStyle]
        }, this._panResponder.panHandlers, {
          onLayout: function (t) {
            e.layoutHeight = t.nativeEvent.layout.height;
          }
        }), React.default.createElement(reactNativeVideo.default, babelHelpers.extends({}, this.props, {
          ref: function (t) {
            var n, o;
            null === (n = (o = e.props).onRef) || void 0 === n || n.call(o, t);
            e.player.ref = t;
          },
          resizeMode: this.state.resizeMode,
          paused: this.state.paused,
          rate: this.state.rate,
          onLoadStart: this.events.onLoadStart,
          onProgress: this.events.onProgress,
          onError: this.events.onError,
          onLoad: this.events.onLoad,
          onEnd: this.events.onEnd,
          onSeek: this.events.onSeek,
          style: [g.player.video, this.styles.videoStyle],
          source: this.props.source
        })), this.renderError(), this.renderLoader(), this.renderTopControls(), this.renderBottomControls());
      }
    }]);
    babelHelpers.inherits(n, e);
    return n;
  }(React.Component);
exports.default = m;
m.defaultProps = {
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
  showHours: false
};
var g = {
  player: ReactNative.StyleSheet.create({
    container: {
      overflow: 'hidden',
      backgroundColor: '#000',
      flex: 1,
      alignSelf: 'stretch',
      justifyContent: 'space-between'
    },
    video: {
      overflow: 'hidden',
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    }
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
      alignItems: 'center'
    },
    icon: {
      marginBottom: 16
    },
    text: {
      backgroundColor: 'transparent',
      color: '#f27474'
    }
  }),
  loader: ReactNative.StyleSheet.create({
    container: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      alignItems: 'center',
      justifyContent: 'center'
    }
  }),
  controls: ReactNative.StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: null,
      width: null
    },
    column: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: null,
      width: null,
      paddingBottom: 12
    },
    vignette: {
      resizeMode: 'stretch'
    },
    control: {
      padding: 16,
      alignItems: 'center',
      justifyContent: 'center'
    },
    text: {
      backgroundColor: 'transparent',
      color: '#FFF',
      fontSize: 14,
      textAlign: 'center'
    },
    pullRight: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
    },
    top: {
      flex: 1,
      alignItems: 'stretch',
      justifyContent: 'flex-start'
    },
    bottom: {
      alignItems: 'stretch',
      flex: 2,
      justifyContent: 'flex-end'
    },
    topControlGroup: {
      alignSelf: 'stretch',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'row',
      width: null,
      margin: 12,
      marginHorizontal: 6,
      marginBottom: 18
    },
    bottomControlGroup: {
      alignSelf: 'stretch',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginLeft: 12,
      marginRight: 12,
      marginBottom: 8
    },
    fullscreen: {
      flexDirection: 'row'
    },
    playPause: {
      position: 'relative',
      zIndex: 0
    },
    title: {
      alignItems: 'center',
      flex: 1,
      flexDirection: 'column',
      padding: 0
    },
    titleText: {
      fontSize: 16,
      fontWeight: '600',
      textAlign: 'center'
    },
    timer: {},
    timerText: {
      backgroundColor: 'transparent',
      color: '#FFF',
      fontSize: 16,
      textAlign: 'right'
    }
  }),
  seekbar: ReactNative.StyleSheet.create({
    container: {
      alignSelf: 'stretch',
      height: 28,
      marginLeft: 20,
      marginRight: 20,
      marginBottom: -8,
      alignItems: 'center',
      justifyContent: 'center'
    }
  }),
  text: {
    fontSize: 16
  }
};
