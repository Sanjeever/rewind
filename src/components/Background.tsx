import * as _appStorage from './../storage/index';
import * as React from 'react';
import * as ReactNative from 'react-native';
import * as constants from '../theme/constants';
import names from '../events/names';
import keys from '../storage/keys';
import * as events from '../events/index';
import * as backgroundModule from '../theme/background';
import type {Subscription} from '../events/Emitter';
import type {AppEvents} from '../events/types';
interface Props {
  coverUrl?: string | null;
  bgStyle?: ReactNative.StyleProp<ReactNative.ViewStyle>;
  hideMask?: boolean;
  imageStyle?: ReactNative.StyleProp<ReactNative.ImageStyle>;
  blur?: boolean;
}
interface State {
  url: string | null;
  opacity?: number;
  error: boolean;
  blur: boolean;
}
class Background extends React.PureComponent<Props, State> {
  sub!: Subscription;
  state: State = {
    url: null,
    error: false,
    blur: false,
  };
  changeBackgroundEmitter = (e: AppEvents['ChangeBackground']) => {
    if (e?.path) {
      _appStorage.storage
        .save({
          key: keys.background,
          data: e,
        })
        .catch((e) => e);
      this.setState({
        url: e.path,
        opacity: e.opacity,
        blur: e.blur,
        error: false,
      });
      backgroundModule.initBackgroundState();
    }
  };
  loadBackground = async () => {
    const background = await backgroundModule.getBackground();
    this.setState((state) => ({...state, ...background}));
  };
  componentDidMount() {
    this.loadBackground();
    this.sub = events.emitter.addListener(names.ChangeBackground, this.changeBackgroundEmitter);
  }
  componentWillUnmount() {
    this.sub.remove?.();
  }
  render() {
    const props = this.props;
    const {coverUrl, bgStyle, hideMask, imageStyle} = props;
    const state = this.state;
    const {url, opacity, error, blur} = state;
    const uri = coverUrl || url;
    const h = this.props.blur ?? blur;
    return (
      <ReactNative.View style={[p.background, bgStyle]}>
        {uri && (!error || coverUrl) && (
          <ReactNative.Image
            style={[
              {
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
              },
              imageStyle,
            ]}
            source={{
              uri,
            }}
            blurRadius={h ? 10 : 0}
          />
        )}
        {uri && !hideMask ? (
          <ReactNative.View
            style={[
              p.msk,
              {
                opacity: coverUrl ? 0.3 : 1 - opacity!,
              },
            ]}
          />
        ) : null}
      </ReactNative.View>
    );
  }
}
const p = ReactNative.StyleSheet.create({
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: constants.DEVICE_HEIGHT,
    backgroundColor: '#000',
  },
  msk: {
    position: 'absolute',
    width: '100%',
    height: constants.DEVICE_HEIGHT,
    backgroundColor: 'rgba(0,0,0,1)',
  },
});
export default Background;
