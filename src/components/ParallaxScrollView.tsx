import * as React from 'react';
import * as ReactNative from 'react-native';
import * as reactNativeSpringScrollview from './Scrolling';
import type {SpringScrollViewProps} from './Scrolling';
interface Props extends SpringScrollViewProps {
  renderForeground?: (offset: {
    x: ReactNative.Animated.Value;
    y: ReactNative.Animated.Value;
  }) => React.ReactNode;
  onRef?: (view: reactNativeSpringScrollview.SpringScrollView | null) => void;
}
class ParallaxScrollView extends React.PureComponent<Props> {
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
