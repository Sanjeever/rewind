import _neteaseImage from '../../assets/images/netease.png';
import _qqmusicImage from '../../assets/images/qqmusic.png';
import * as constants from '../theme/constants';
import * as React from 'react';
import * as ReactNative from 'react-native';
import * as Scrolling from './../components/Scrolling.js';
import * as Index from '../components/index';
import providers from '../services/providers';
import locales from '../locales/index';
class InitialLogin extends React.Component {
  goTo = (e) => {
    let t;
    if (e === providers.netEase) {
      t = 'NeteaseLogin';
    } else if (e === providers.qqMusic) {
      t = 'QQMusicLogin';
    }
    this.props.navigation.navigate(t);
  };
  render() {
    return (
      <Index.PageContainer
        title={locales.LOG_IN}
        goBack={() => {
          return this.props.navigation.goBack();
        }}
        headerStyle={{
          marginBottom: 30,
        }}
      >
        <Scrolling.SpringScrollView>
          <ReactNative.View style={b.con}>
            {React.createElement(p, {
              source: _neteaseImage,
              onPress: () => {
                return this.goTo(providers.netEase);
              },
            })}
            {React.createElement(p, {
              source: _qqmusicImage,
              onPress: () => {
                return this.goTo(providers.qqMusic);
              },
            })}
          </ReactNative.View>
        </Scrolling.SpringScrollView>
      </Index.PageContainer>
    );
  }
}
var p = function ({onPress, source}) {
  return (
    <Index.TouchableBorderless onPress={onPress} style={b.iconCon}>
      <ReactNative.View>
        <ReactNative.Image style={b.icon} source={source} />
      </ReactNative.View>
    </Index.TouchableBorderless>
  );
};
var b = ReactNative.StyleSheet.create({
  con: {
    height: constants.DEVICE_HEIGHT - (40 + constants.STATUS_BAR_HEIGHT),
    width: constants.DEVICE_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCon: {
    marginBottom: 100,
  },
  icon: {
    height: 35,
    width: 35,
  },
});
export default InitialLogin;
