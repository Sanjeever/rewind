import 'react';
import buttons from './buttons';
import ControlIcon from './ControlIcon';
import type {ControlIconProps} from './ControlIcon';
import type {PlayMode} from './types';
type Props = Pick<ControlIconProps, 'onPress' | 'color' | 'size' | 'style'> & {playMode: PlayMode};
const DComponent = function ({playMode, onPress, color, size, style}: Props) {
  let a;
  switch (playMode) {
    case 'list':
      a = {
        name: buttons.REPEAT.name,
      };
      break;
    case 'random':
      a = {
        name: buttons.RANDOM.name,
      };
      break;
    case 'circulate':
      a = {
        name: buttons.CIRLUATE.name,
      };
  }
  return (
    <ControlIcon
      accessibilityLabel={`播放模式：${playMode === 'random' ? '随机播放' : playMode === 'circulate' ? '单曲循环' : '列表循环'}`}
      onPress={onPress}
      name={a.name}
      size={size || 28}
      color={color}
      style={style}
    />
  );
};
export default DComponent;
