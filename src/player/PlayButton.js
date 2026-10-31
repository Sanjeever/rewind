import * as React from 'react';
import * as ReactNative from 'react-native';
import * as components from '../components/index';
import buttons from './buttons';
import ControlIcon from './ControlIcon';
const u = {
  playing: {
    name: buttons.PAUSE.name,
    type: buttons.PAUSE.type,
  },
  paused: {
    name: buttons.PLAY.name,
    type: buttons.PLAY.type,
  },
};
class PlayButton extends React.PureComponent {
  render() {
    const {
      playState,
      disabled,
      loaded,
      color,
      onPress,
      onLongPress,
      size = 55,
      spinSize = 50,
    } = this.props;
    if (loaded === true) {
      return (
        <ControlIcon
          color={color}
          name={u[playState].name}
          type={u[playState].type}
          size={size}
          onPress={onPress}
          onLongPress={onLongPress}
          disabled={disabled}
          style={
            !size && {
              padding: 0,
            }
          }
        />
      );
    }
    return (
      <ReactNative.View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          width: size + 12,
        }}
      >
        <components.Spinkit size={spinSize} />
      </ReactNative.View>
    );
  }
}
export default PlayButton;
