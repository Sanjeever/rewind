import * as React from 'react';
import * as ReactNative from 'react-native';
import * as reactNativeSpringScrollview from './../components/Scrolling.js';
import * as components from '../components/index';
import icons from '../theme/icons';
import * as services from '../services/index';
import * as utils from '../utils/index';
import * as filterColors from '../components/filterColors';
import filterStyles from '../components/filterStyles';
class PlaylistFilters extends React.PureComponent {
  renderCategoryItem = ({item, index}) => {
    const fontSize = utils.random.getInt(20, 30);
    return React.createElement(filterStyles, {
      key: index,
      name: item.name,
      highlight: this.props.currentType === item.name,
      onPress: () => {
        return this.props.onType(item.name);
      },
      textStyle: {
        fontSize,
      },
    });
  };
  render() {
    const props = this.props;
    const {visible, onClose, onSearch, currentType} = props;
    return (
      <ReactNative.Modal
        transparent={true}
        animationType={'fade'}
        visible={visible}
        onRequestClose={onClose}
      >
        <ReactNative.View
          style={{
            backgroundColor: 'rgba(0,0,0,0.9)',
            flex: 1,
          }}
        >
          <reactNativeSpringScrollview.SpringScrollView
            contentStyle={{
              paddingTop: '25%',
              flexDirection: 'row',
              flexWrap: 'wrap',
              padding: 20,
            }}
          >
            <components.Icon
              color={filterColors.highlightColor}
              name={icons.WINDOW_CLOSE}
              size={40}
              onPress={onClose}
            />
            {services.Netease.playlist_category_names.map((item, index) =>
              this.renderCategoryItem({
                item,
                index,
              }),
            )}
            <components.Icon
              color={
                currentType === 'search' ? filterColors.highlightColor : filterColors.defaultColor
              }
              name={icons.MAGNIFY}
              size={40}
              onPress={onSearch}
            />
          </reactNativeSpringScrollview.SpringScrollView>
        </ReactNative.View>
      </ReactNative.Modal>
    );
  }
}
export default PlaylistFilters;
