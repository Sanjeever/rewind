import _neteaseImage from '../../../assets/images/netease.png';
import _qqmusicImage from '../../../assets/images/qqmusic.png';
import Text from '../../components/Text';
import * as React from 'react';
import * as ReactNative from 'react-native';
import * as Index from '../../components/index';
import providers from '../../services/providers';
import icons from '../../theme/icons';
type Props = {active?: boolean} & (
  {type: 'pages'; data: {icon: {name: string}; title: string}} | {type: 'apis'; data: string}
);
class ProviderSelector extends React.PureComponent<Props> {
  renderApiIcon = function (e: string) {
    let source;
    switch (e) {
      case providers.netEase:
        source = _neteaseImage;
        break;
      case providers.qqMusic:
        source = _qqmusicImage;
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
  componentDidUpdate(e: Props) {
    if (this.props.active !== e.active) {
      ReactNative.Animated.timing(this._active, {
        duration: 300,
        easing: ReactNative.Easing.bounce,
        toValue: Number(this.props.active),
        useNativeDriver: true,
      }).start();
    }
  }
  render() {
    const props = this.props;
    if (props.type === 'pages') {
      return (
        <ReactNative.Animated.View style={[d.row, this._style]}>
          <Index.Icon
            name={props.data.icon.name}
            style={{
              marginRight: 10,
            }}
          />
          {React.createElement(Text, null, props.data.title)}
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
        {this.renderApiIcon(props.data)}
        {React.createElement(Text, null, props.data)}
      </ReactNative.Animated.View>
    );
  }
}
export default ProviderSelector;
const d = ReactNative.StyleSheet.create({
  row: {
    paddingHorizontal: 5,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
