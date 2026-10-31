import Text from './Text';
import * as React from 'react';
import * as ReactNative from 'react-native';
import TouchableScale from './TouchableScale';
import * as components from './index';
import * as constants from '../theme/constants';
import icons from '../theme/icons';
import type {IconProps} from './Icon';
interface Props {
  img?: string | null;
  errorIconName?: string;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  trans?: string | null;
  vip?: boolean;
  numberOfLines?: number;
  onPress?: ReactNative.TouchableNativeFeedbackProps['onPress'];
  onLongPress?: ReactNative.TouchableNativeFeedbackProps['onLongPress'];
  onPressImg?: ReactNative.TouchableNativeFeedbackProps['onPress'];
  rightIcon?: IconProps;
}
const d = '6y-UleORITEDbvrOLV0Q8A==/5639395138885805';
class ListItem extends React.PureComponent<Props, {imgError: boolean}> {
  static defaultProps = {numberOfLines: 1};
  state = {
    imgError: false,
  };
  renderImg = () => {
    const imgError = this.state.imgError;
    const props = this.props;
    const {img, errorIconName} = props;
    if (!img || imgError === true || img.includes(d)) {
      return (
        <ReactNative.View
          style={[
            b.img,
            {
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#111',
            },
          ]}
        >
          <components.Icon name={errorIconName || icons.ACCOUNT_MUSIC} />
        </ReactNative.View>
      );
    }
    return (
      <ReactNative.Image
        style={b.img}
        source={{
          uri: img,
        }}
        onError={() => {
          return this.setState({
            imgError: true,
          });
        }}
      />
    );
  };
  renderTitle = () => {
    const props = this.props;
    const {title, trans, vip, numberOfLines} = props;
    if (title === '♡') {
      return (
        <components.Icon
          name={icons.HEART_OUTLINE}
          style={{
            backgroundColor: 'transparent',
          }}
          size={23}
        />
      );
    }
    if (trans) {
      return (
        <Text numberOfLines={numberOfLines} style={[b.bold, b.title]}>
          {title}
          <Text style={[b.trans]}>
            {' ('}
            {trans}
            {')'}
          </Text>
        </Text>
      );
    }
    if (vip) {
      return (
        <ReactNative.View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Text numberOfLines={numberOfLines} style={[b.bold, b.title]}>
            {title}
          </Text>
          <components.Icon
            iconStyle={{
              marginLeft: 5,
            }}
            name={icons.CHECK_DECAGRAM}
            size={13}
          />
        </ReactNative.View>
      );
    }
    return (
      <Text numberOfLines={numberOfLines} style={[b.bold, b.title]}>
        {title}
      </Text>
    );
  };
  render() {
    const props = this.props;
    const {onLongPress, onPress, subtitle, onPressImg, rightIcon} = props;
    return (
      <ReactNative.TouchableNativeFeedback onPress={onPress} onLongPress={onLongPress}>
        <ReactNative.View style={[b.container]}>
          <TouchableScale disabled={!onPressImg} onPress={onPressImg}>
            {this.renderImg()}
          </TouchableScale>
          <ReactNative.View style={b.info}>
            {this.renderTitle()}
            {subtitle ? (
              <Text numberOfLines={1} style={[b.subtitle]}>
                {subtitle}
              </Text>
            ) : null}
          </ReactNative.View>
          {rightIcon && (
            <components.Icon
              style={{
                marginHorizontal: 10,
              }}
              {...rightIcon}
            />
          )}
        </ReactNative.View>
      </ReactNative.TouchableNativeFeedback>
    );
  }
}
const b = ReactNative.StyleSheet.create({
  container: {
    height: constants.ITEM_HEIGHT,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  bold: {
    fontWeight: 'bold',
  },
  title: {
    fontSize: 15,
  },
  subtitle: {
    fontSize: 13,
    opacity: 0.8,
  },
  trans: {
    fontWeight: 'normal',
    fontSize: 13,
    opacity: 0.6,
  },
  img: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
  },
  info: {
    paddingLeft: 10,
    flex: 1,
  },
});
export default ListItem;
