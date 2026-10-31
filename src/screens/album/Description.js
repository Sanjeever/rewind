import Text from './../../components/Text.js';
import * as React from 'react';
import * as ReactNative from 'react-native';
import * as components from '../../components/index';
import * as constants from '../../theme/constants';
import icons from '../../theme/icons';
class Description extends React.PureComponent {
  render() {
    const props = this.props;
    const {showModal, albumImg, onClose, company, publishTime, description} = props;
    return (
      <ReactNative.Modal
        visible={showModal}
        backdropOpacity={0.8}
        onRequestClose={onClose}
        position={'center'}
        animationType={'fade'}
      >
        <ReactNative.View
          style={{
            flex: 1,
            paddingTop: constants.STATUS_BAR_HEIGHT + 20,
          }}
        >
          <components.Background coverUrl={albumImg} blur={true} />
          <components.Icon name={icons.WINDOW_CLOSE} size={25} onPress={onClose} />
          <ReactNative.ScrollView
            overScrollMode={'never'}
            style={{
              marginTop: constants.STATUS_BAR_HEIGHT + 20,
              height: '100%',
              flex: 1,
              paddingHorizontal: 20,
            }}
          >
            <ReactNative.View
              style={{
                flex: 1,
              }}
            >
              <Text />
              <Text
                style={[
                  {
                    fontSize: 15,
                    lineHeight: 30,
                  },
                ]}
              >
                {'发行公司：'}
                {company}
                {'\n'}
                {'发行日期：'}
                {publishTime}
                {'\n\n'}
                {description}
              </Text>
            </ReactNative.View>
            <ReactNative.View
              style={{
                height: 200,
              }}
            />
          </ReactNative.ScrollView>
        </ReactNative.View>
      </ReactNative.Modal>
    );
  }
}
export default Description;
