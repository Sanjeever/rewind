import {WebView} from 'react-native-webview';
import * as React from 'react';
import * as ReactNative from 'react-native';
import * as components from '../components/index';
import icons from '../theme/icons';
import * as endpoints from '../services/endpoints';
class Tip extends React.Component {
  state = {
    url: `${endpoints.HOST_PAGE}/tutorial`,
  };
  back = () => {
    this.props.navigation.goBack();
  };
  onLink = () => {
    ReactNative.Linking.openURL(this.state.url);
  };
  goBack = () => {
    this.props.navigation.goBack();
  };
  componentDidMount() {
    const params = this.props.route.params;
    if (params) {
      const url = params.url;
      this.setState({
        url,
      });
    }
  }
  render() {
    return (
      <ReactNative.Modal onRequestClose={this.goBack} animationType={'fade'}>
        <ReactNative.View style={p.container}>
          <WebView
            ref={(instance) => (this.webView = instance)}
            style={{
              flex: 1,
              width: '100%',
              height: '100%',
            }}
            source={{
              uri: this.state.url,
            }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            automaticallyAdjustContentInsets={false}
            useWebKit={true}
          />
          <components.Icon
            name={icons.LINK_VARIANT}
            color={'#000'}
            size={22}
            style={p.linkIcon}
            onPress={this.onLink}
          />
        </ReactNative.View>
      </ReactNative.Modal>
    );
  }
}
export default Tip;
var p = ReactNative.StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  linkIcon: {
    position: 'absolute',
    top: ReactNative.StatusBar.currentHeight,
    right: 10,
  },
});
