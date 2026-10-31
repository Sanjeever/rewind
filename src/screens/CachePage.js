import {toast} from '../native/toast';
import * as _appStorage from './../storage/index.js';
import * as React from 'react';
import * as ReactNative from 'react-native';
import * as reactNativeSpringScrollview from './../components/Scrolling.js';
import * as components from '../components/index';
import providers from '../services/providers';
import icons from '../theme/icons';
import keys from '../storage/keys';
import locales from '../locales/index';
import * as utils from '../utils/index';
import * as types from '../utils/types';
import * as files from '../storage/files';
class CachePage extends React.PureComponent {
  state = {
    caches: [
      {
        type: providers.netEase,
        name: locales.NETEASE_MUSIC,
        size: 0,
      },
      {
        type: providers.qqMusic,
        name: locales.QQ_MUSIC,
        size: 0,
      },
    ],
    maxCacheSize: 200,
    deleted: false,
    cacheSize: 0,
  };
  saveStorageCacheSize = () => {
    const n_state = this.state;
    const e_maxCacheSize = n_state.maxCacheSize;
    if (n_state.deleted === false) {
      _appStorage.storage.save({
        key: keys.maxCacheSize,
        data: e_maxCacheSize,
      });
    }
  };
  getStorageCacheSize = () => {
    _appStorage.storage
      .load({
        key: keys.maxCacheSize,
      })
      .then((maxCacheSize) => {
        this.setState({
          maxCacheSize,
        });
      })
      .catch(() => {});
  };
  getCacheSize = async () => {
    this.setState({
      cacheSize: await files.getCurrentCache(),
    });
  };
  removeSettings = () => {
    _appStorage.storage
      .remove({
        key: keys.maxCacheSize,
      })
      .then(() => {
        this.setState({
          deleted: true,
          maxCacheSize: 200,
        });
        toast(locales.CACHE_SETTING_DONE);
      });
  };
  onSetCacheMax = async () => {
    const size = await utils.dialogs.showCacheSizePicker();
    if (types.isNumber(size) && size > 0) {
      this.setState({
        maxCacheSize: size,
      });
    }
  };
  onDelete = async () => {
    try {
      await files.clearCache();
      this.setState({
        cacheSize: 0,
      });
    } catch (error) {
      toast(`清理缓存失败：${error.message}`);
    }
  };
  componentDidMount() {
    this.getCacheSize();
    this.getStorageCacheSize();
  }
  componentWillUnmount() {
    this.saveStorageCacheSize();
  }
  render() {
    const e = this;
    const state = this.state;
    const {cacheSize, maxCacheSize} = state;
    return (
      <components.PageContainer
        title={locales.CACHE}
        goBack={function () {
          return e.props.navigation.goBack();
        }}
        rightIcon={{
          name: icons.BACKUP_RESTORE,
          onPress: function () {
            return e.removeSettings();
          },
        }}
      >
        <reactNativeSpringScrollview.SpringScrollView style={g.scrollContainer}>
          <components.SettingItem
            title={locales.CACHE_MAX_SIZE}
            subtitle={`${maxCacheSize}MB`}
            onPress={this.onSetCacheMax}
            showChevron={true}
          />
          <components.SettingItem
            title={locales.CACHE_SIZE}
            subtitle={files.bytesToSize(cacheSize)}
            onPress={this.onDelete}
            showChevron={true}
          />
        </reactNativeSpringScrollview.SpringScrollView>
      </components.PageContainer>
    );
  }
}
var g = ReactNative.StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 12,
  },
});
export default CachePage;
