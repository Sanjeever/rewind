import _default from './../components/Text.js';
import * as React from 'react';
import * as ReactNative from 'react-native';
import * as Index from '../components/index';
import providers from '../services/providers';
import icons from '../theme/icons';
class ProviderSelector extends React.PureComponent {
  renderApiIcon = function (e) {
    let source;
    switch (e) {
      case providers.netEase:
        source = require('../../assets/images/netease.png');
        break;
      case providers.qqMusic:
        source = require('../../assets/images/qqmusic.png');
    }
    return (
      <ReactNative.View
        style={{
          marginRight: 10,
        }}
      >
        {source ? (
          <ReactNative.Image
            source={source}
            style={{
              height: 22,
              width: 22,
            }}
          />
        ) : (
          <Index.Icon name={icons.DISC} />
        )}
      </ReactNative.View>
    );
  };
  _active = new ReactNative.Animated.Value(0);
  _style = {
    transform: [
      {
        scale: this._active.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 0.9],
        }),
      },
    ],
  };
  componentDidUpdate(e) {
    if (this.props.active !== e.active) {
      ReactNative.Animated.timing(this._active, {
        duration: 300,
        easing: ReactNative.Easing.bounce,
        toValue: Number(this.props.active),
      }).start();
    }
  }
  render() {
    const props = this.props;
    const e_data = props.data;
    if (props.type === 'pages') {
      return (
        <ReactNative.Animated.View style={[d.row, this._style]}>
          <Index.Icon
            name={e_data.icon.name}
            style={{
              marginRight: 10,
            }}
          />
          {React.createElement(_default, null, e_data.title)}
        </ReactNative.Animated.View>
      );
    }
    return (
      <ReactNative.Animated.View
        style={[
          d.row,
          {
            marginLeft: 2,
          },
          this._style,
        ]}
      >
        {this.renderApiIcon(e_data)}
        {React.createElement(_default, null, e_data)}
      </ReactNative.Animated.View>
    );
  }
}
export default ProviderSelector;
var d = ReactNative.StyleSheet.create({
  row: {
    paddingHorizontal: 5,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
