import * as React from 'react';
import * as ReactNative from 'react-native';
import * as components from '../components/index';
import buttons from './buttons';
import ControlIcon from './ControlIcon';
import type {ControlIconProps} from './ControlIcon';
import type {PlayerState, PlayState} from './types';
import TouchableScale from '../components/TouchableScale';
import Text from '../components/Text';
const u = {
  playing: {
    name: buttons.PAUSE.name,
  },
  paused: {
    name: buttons.PLAY.name,
  },
};
class PlayButton extends React.PureComponent<
  Omit<ControlIconProps, 'name'> & {
    playState: PlayState;
    loadState: PlayerState['loadState'];
    spinSize?: number;
  }
> {
  render() {
    const {
      playState,
      disabled,
      loadState,
      color,
      onPress,
      onLongPress,
      size = 55,
      spinSize = 50,
    } = this.props;
    if (loadState === 'failed')
      return (
        <TouchableScale
          accessibilityRole="button"
          accessibilityLabel="重试播放"
          onPress={onPress}
          onLongPress={onLongPress}
          style={{
            minWidth: Math.max(48, size + 12),
            minHeight: 48,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{color: color ?? '#fff'}}>重试</Text>
        </TouchableScale>
      );
    if (loadState === 'ready') {
      return (
        <ControlIcon
          accessibilityLabel={playState === 'playing' ? '暂停' : '播放'}
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
