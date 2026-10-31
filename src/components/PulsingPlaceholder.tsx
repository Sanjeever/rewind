import * as React from 'react';
import * as ReactNative from 'react-native';
const o = 1000;
const s = 500;
class PulsingPlaceholder extends React.PureComponent<ReactNative.TextProps & {textMode?: boolean}> {
  _animation: ReactNative.Animated.CompositeAnimation | null = null;
  _animValue = new ReactNative.Animated.Value(0.3);
  start = () => {
    this._animation = ReactNative.Animated.timing(this._animValue, {
      toValue: 1,
      useNativeDriver: true,
      duration: o,
    });
    this._animation.start(({finished}) => {
      if (!finished) return;
      this._animation = ReactNative.Animated.timing(this._animValue, {
        toValue: 0.3,
        useNativeDriver: true,
        duration: s,
      });
      this._animation.start(({finished}) => {
        if (finished) this.start();
      });
    });
  };
  componentDidMount() {
    this.start();
  }
  componentWillUnmount() {
    this._animation?.stop();
  }
  render() {
    const props = this.props;
    const {style, textMode, ...rest} = props;
    if (textMode) {
      return (
        <ReactNative.Animated.Text
          style={[
            {
              opacity: this._animValue,
            },
            style,
          ]}
          {...rest}
        />
      );
    }
    return (
      <ReactNative.Animated.View
        style={[
          {
            backgroundColor: '#eee',
            opacity: this._animValue,
          },
          style,
        ]}
        {...rest}
      />
    );
  }
}
export default PulsingPlaceholder;
