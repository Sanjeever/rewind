import * as React from 'react';
import * as ReactNative from 'react-native';
import * as components from '../components/index';
import buttons from './buttons';
import ControlIcon from './ControlIcon';
import type {ControlIconProps} from './ControlIcon';
import type {PlayState} from './types';
const u = {
  playing: {
    name: buttons.PAUSE.name,
  },
  paused: {
    name: buttons.PLAY.name,
  },
};
class PlayButton extends React.PureComponent<
  Omit<ControlIconProps, 'name'> & {playState: PlayState; loaded?: boolean; spinSize?: number}
> {
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
