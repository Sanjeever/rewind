import {WebView} from 'react-native-webview';
import * as React from 'react';
import * as ReactNative from 'react-native';
import * as components from '../components/index';
import * as constants from '../theme/constants';
const injectedJavaScript = `
  (function() {
    function changeFrame(){
        var iframe = document.getElementById('g_iframe');
        console.log('iframe', iframe);
        if(iframe){
            iframe.style.width = '${3 * constants.DEVICE_WIDTH}px';
            iframe.style.height = '${2 * constants.DEVICE_HEIGHT}px';
        }
    };
    changeFrame();
  })();
`;
class WebViewPage extends React.Component {
  state = {
    url: '',
  };
  goBack = () => {
    this.props.navigation.goBack();
  };
  componentDidMount() {
    const url = this.props.route.params.url;
    this.setState({
      url,
    });
  }
  render() {
    const url = this.state.url;
    return (
      <ReactNative.Modal onRequestClose={this.goBack} animationType={'fade'}>
        <ReactNative.View style={d.container}>
          <components.Background />
          <WebView
            ref={(instance) => (this.webView = instance)}
            style={{
              flex: 1,
              width: '100%',
              height: '100%',
            }}
            source={{
              uri: url,
            }}
            userAgent={
              'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36'
            }
            injectedJavaScript={injectedJavaScript}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            automaticallyAdjustContentInsets={false}
          />
          <components.HeaderBar headerStyle={d.header} goBack={this.goBack} />
        </ReactNative.View>
      </ReactNative.Modal>
    );
  }
}
var d = ReactNative.StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: constants.STATUS_BAR_HEIGHT,
  },
  header: {
    position: 'absolute',
    top: 0,
  },
});
export default WebViewPage;
