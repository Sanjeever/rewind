import * as React from 'react';
import * as ReactNative from 'react-native';
import * as reactNativeSpringScrollview from './../components/Scrolling';
import * as components from '../components/index';
import icons from '../theme/icons';
import * as services from '../services/index';
class SearchUser extends React.PureComponent {
  state = {
    data: [],
    search: '',
  };
  searchUser = (keywords) => {
    const t = {
      keywords,
      type: 1002,
    };
    services.Netease.search(t).then(({result}) => {
      if (result) {
        const r = result.userprofiles;
        if (r) {
          const data = r;
          this.setState({
            data,
          });
        }
      }
    });
  };
  _renderItem = ({item, index}) => {
    return (
      <components.ListItem
        key={index}
        title={item.nickname}
        subtitle={item.signature}
        img={item.avatarUrl}
        onPress={() => {
          return this.onSelect(item);
        }}
      />
    );
  };
  onSelect = (e) => {
    this.props.onSelected(e);
  };
  render() {
    const props = this.props;
    const {isOpen, onModalClose} = props;
    const search = this.state.search;
    return (
      <ReactNative.Modal visible={isOpen} onRequestClose={onModalClose} animationType={'fade'}>
        <components.PageContainer
          goBack={onModalClose}
          searchText={search}
          onChangeText={(search_1) => {
            return this.setState({
              search: search_1,
            });
          }}
          onSubmitEditing={() => {
            return this.searchUser(search);
          }}
          backIcon={{
            name: icons.WINDOW_CLOSE,
          }}
          textInput={true}
          forceShowTextInput={true}
          disabledTextInputBtn={true}
        >
          <reactNativeSpringScrollview.SpringScrollView>
            {this.state.data.map((item, index) =>
              this._renderItem({
                item,
                index,
              }),
            )}
          </reactNativeSpringScrollview.SpringScrollView>
        </components.PageContainer>
      </ReactNative.Modal>
    );
  }
}
export default SearchUser;
