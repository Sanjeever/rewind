import React, {useState} from 'react';
import {Modal, Pressable, View} from 'react-native';
import {TouchableBorderless, Icon} from '../components';
import {STATUS_BAR_HEIGHT, DEVICE_WIDTH} from '../theme/constants';
import icons from '../theme/icons';
import devMenu from '../native/devMenu';
import {isDebug} from '../native/info';
import Drawer from '../features/home/Drawer';
import HomeContent from '../features/home/HomeContent';
import type {ScreenProps, Navigation, NavigateArgs} from '../navigation/types';

export default function Home({navigation}: ScreenProps<'Home'>) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerNavigation: Navigation = {
    ...navigation,
    navigate(...args: NavigateArgs) {
      setDrawerOpen(false);
      navigation.navigate(...args);
    },
  };
  return (
    <>
      <View style={{flex: 1, backgroundColor: '#000'}}>
        <HomeContent navigation={navigation} />
        <TouchableBorderless
          accessibilityLabel="菜单"
          onPress={() => setDrawerOpen(true)}
          onLongPress={() => {
            if (isDebug) devMenu.show();
          }}
          style={{position: 'absolute', top: STATUS_BAR_HEIGHT, left: 10}}
        >
          <Icon name={icons.MENU} color="#fff" />
        </TouchableBorderless>
        <TouchableBorderless
          accessibilityLabel="搜索"
          onPress={() => navigation.navigate('SearchPage')}
          style={{position: 'absolute', top: STATUS_BAR_HEIGHT, right: 10}}
        >
          <Icon name={icons.MAGNIFY} color="#fff" />
        </TouchableBorderless>
      </View>
      <Modal
        visible={drawerOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setDrawerOpen(false)}
      >
        <View style={{flex: 1, flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.6)'}}>
          <View style={{width: DEVICE_WIDTH * 0.7}}>
            <Drawer navigation={drawerNavigation} />
          </View>
          <Pressable
            accessibilityLabel="关闭菜单"
            style={{flex: 1}}
            onPress={() => setDrawerOpen(false)}
          />
        </View>
      </Modal>
    </>
  );
}
