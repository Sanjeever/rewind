import * as React from 'react';
import * as ReactNative from 'react-native';
import * as reactNativeSpringScrollview from './Scrolling.js';
class ParallaxScrollView extends React.PureComponent {
  _nativeOffset = {
    x: new ReactNative.Animated.Value(0),
    y: new ReactNative.Animated.Value(0),
  };
  _renderForeground = () => {
    const renderForeground = this.props.renderForeground;
    if (renderForeground) {
      return renderForeground(this._nativeOffset);
    }
  };
  render() {
    const props = this.props;
    const {children, onRef, ...rest} = props;
    return (
      <reactNativeSpringScrollview.SpringScrollView
        onNativeContentOffsetExtract={this._nativeOffset}
        {...rest}
        ref={function (e) {
          return onRef && onRef(e);
        }}
      >
        {this._renderForeground()}
        {children}
      </reactNativeSpringScrollview.SpringScrollView>
    );
  }
}
export default ParallaxScrollView;
