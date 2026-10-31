import 'react';
import buttons from './buttons';
import ControlIcon from './ControlIcon';
const DComponent = function ({playMode, onPress, color, size, style}) {
  let a;
  switch (playMode) {
    case 'list':
      a = {
        name: buttons.REPEAT.name,
        type: buttons.REPEAT.type,
      };
      break;
    case 'random':
      a = {
        name: buttons.RANDOM.name,
        type: buttons.RANDOM.type,
      };
      break;
    case 'circulate':
      a = {
        name: buttons.CIRLUATE.name,
        type: buttons.CIRLUATE.type,
      };
  }
  return (
    <ControlIcon
      onPress={onPress}
      name={a.name || null}
      type={a.type}
      size={size || 28}
      color={color}
      style={style}
    />
  );
};
export default DComponent;
