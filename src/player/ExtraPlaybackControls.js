import Pager from './../components/Pager.js';
import * as React from 'react';
import * as ReactNative from 'react-native';
import tabIcons from '../theme/tabIcons';
import buttons from './buttons';
import styles from './styles';
import ControlIcon from './ControlIcon';
class ExtraPlaybackControls extends React.PureComponent {
  render() {
    const props = this.props;
    const {
      animatedOpacity,
      onLike,
      onComment,
      onDetail,
      onFmMode,
      onTimer,
      onCheck,
      showLyric,
      color,
      isFM,
      isLike,
    } = props;
    return (
      <ReactNative.Animated.View
        style={[
          styles.totalTool,
          {
            opacity: animatedOpacity,
          },
        ]}
      >
        <Pager
          style={{
            flex: 1,
            height: '100%',
          }}
        >
          <ReactNative.View
            style={{
              flex: 1,
              height: '100%',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: 'row',
              paddingHorizontal: 45,
            }}
          >
            <ControlIcon
              name={isLike === true ? buttons.HEART.name : buttons.HEART_OFF.name}
              type={buttons.HEART.type}
              onPress={onLike}
              color={showLyric ? '#fff' : color}
              size={23}
            />
            <ControlIcon
              name={buttons.COMMENT.name}
              type={buttons.COMMENT.type}
              onPress={onComment}
              color={color}
              size={23}
            />
            <ControlIcon
              name={buttons.MORE.name}
              type={buttons.MORE.type}
              onPress={onDetail}
              color={showLyric ? '#fff' : color}
              size={23}
            />
          </ReactNative.View>
          <ReactNative.View
            style={{
              flex: 1,
              height: '100%',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: 'row',
              paddingHorizontal: 45,
            }}
          >
            <ControlIcon
              name={buttons.TIMER.name}
              type={buttons.TIMER.type}
              onPress={onTimer}
              color={color}
              size={23}
            />
            <ControlIcon
              name={buttons.CHECK.name}
              type={buttons.CHECK.type}
              onPress={onCheck}
              color={color}
              size={24}
            />
            <ControlIcon
              name={tabIcons.FM.name}
              type={tabIcons.FM.type}
              onPress={onFmMode}
              color={color}
              style={[
                {
                  opacity: 0.7,
                },
                isFM === true && {
                  opacity: 1,
                },
              ]}
              size={23}
            />
          </ReactNative.View>
        </Pager>
      </ReactNative.Animated.View>
    );
  }
}
export default ExtraPlaybackControls;
