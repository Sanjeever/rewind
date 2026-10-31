import * as React from 'react';
import * as ReactNative from 'react-native';
import * as reactNativeSpringScrollview from './Scrolling.js';
import * as components from './index';
import * as utils from '../utils/index';
import updateModule from '../services/update';
import ProfileHeader from './ProfileHeader';
import DrawerActions from './DrawerActions';
class Drawer extends React.PureComponent {
  _nativeOffset = {
    x: new ReactNative.Animated.Value(0),
    y: new ReactNative.Animated.Value(0),
  };
  render() {
    const navigation = this.props.navigation;
    return (
      <ReactNative.View
        style={{
          flex: 1,
          backgroundColor: '#303636',
        }}
      >
        <components.Background />
        <reactNativeSpringScrollview.SpringScrollView
          onNativeContentOffsetExtract={this._nativeOffset}
        >
          <ProfileHeader
            onNavigate={function (t) {
              return navigation.navigate(t);
            }}
            nativeOffset={this._nativeOffset}
          />
          <DrawerActions
            envelop={function () {
              return navigation.navigate('Msg');
            }}
            about={function () {
              return navigation.navigate('About');
            }}
            settings={function () {
              return navigation.navigate('Settings');
            }}
            update={function () {
              return updateModule.checkAndAlert();
            }}
            timer={function () {
              return utils.stopTimer.open();
            }}
            cloud={function () {
              return navigation.navigate('Cloud');
            }}
            feature={function () {
              return navigation.navigate('FeaturePage');
            }}
            navigation={navigation}
          />
        </reactNativeSpringScrollview.SpringScrollView>
      </ReactNative.View>
    );
  }
}
export default Drawer;
