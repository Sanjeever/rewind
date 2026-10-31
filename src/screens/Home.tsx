import React, {useRef} from 'react';
import {DrawerLayoutAndroid, View} from 'react-native';
import {TouchableBorderless, Icon} from '../components';
import {STATUS_BAR_HEIGHT, DEVICE_WIDTH} from '../theme/constants';
import icons from '../theme/icons';
import devMenu from '../native/devMenu';
import {isDebug} from '../native/info';
import Drawer from '../components/Drawer';
import HomeContent from './home/index';
import type {ScreenProps, Navigation, NavigateArgs} from '../navigation/types';

export default function Home({navigation}: ScreenProps<'Home'>) {
  const drawer = useRef<React.ComponentRef<typeof DrawerLayoutAndroid>>(null);
  const drawerNavigation: Navigation = {
    ...navigation,
    navigate(...args: NavigateArgs) {
      drawer.current!.closeDrawer();
      navigation.navigate(...args);
    },
  };
  return (
    <DrawerLayoutAndroid
      ref={drawer}
      style={{flex: 1}}
      drawerWidth={DEVICE_WIDTH * 0.7}
      drawerPosition="left"
      drawerLockMode="locked-closed"
      renderNavigationView={() => <Drawer navigation={drawerNavigation} />}
    >
      <View style={{flex: 1, backgroundColor: '#000'}}>
        <HomeContent navigation={navigation} />
        <TouchableBorderless
          accessibilityLabel="菜单"
          onPress={() => drawer.current!.openDrawer()}
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
    </DrawerLayoutAndroid>
  );
}
