import React from 'react';
import {NavigationContainer, DarkTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {navigationRef} from '../utils/universalNavigator';
import Home from '../screens/Home';
import Skin from '../screens/Skin';
import About from '../screens/About';
import SearchPage from '../screens/SearchPage';
import Settings from '../screens/Settings';
import MusicHistory from '../screens/MusicHistory';
import CustomPlaylist from '../screens/CustomPlaylist';
import NeteaseLogin from '../screens/NeteaseLogin';
import QQMusicLogin from '../screens/QQMusicLogin';
import InitialLogin from '../screens/InitialLogin';
import Playlist from '../screens/Playlist';
import LocalMusic from '../screens/LocalMusic';
import ArtistPage from '../screens/ArtistPage';
import AlbumPage from '../screens/AlbumPage';
import Msg from '../screens/Msg';
import MsgHistory from '../screens/MsgHistory';
import MusicRecommend from '../screens/MusicRecommend';
import Radio from '../screens/Radio';
import RadioDetail from '../screens/RadioDetail';
import Charts from '../screens/Charts';
import HotPlaylist from '../screens/HotPlaylist';
import Favs from '../screens/Favs';
import CachePage from '../screens/CachePage';
import WebViewPage from '../screens/WebViewPage';
import Tip from '../screens/Tip';
import Cloud from '../screens/Cloud';
import UserManager from '../screens/UserManager';
import UserInfo from '../screens/UserInfo';
import FollowPage from '../screens/FollowPage';
import LanguagePage from '../screens/LanguagePage';
import FeaturePage from '../screens/FeaturePage';
import OrderPage from '../screens/OrderPage';
import MusicNotificationPage from '../screens/MusicNotificationPage';
import CommentPage from '../screens/CommentPage';
import ListenRecord from '../screens/ListenRecord';
import PlaylistIntersection from '../screens/PlaylistIntersection';
import LyricPage from '../screens/LyricPage';
import HappyBirthday from '../screens/HappyBirthday';
import SubNewSongs from '../screens/SubNewSongs';
import Video from '../screens/Video';

import type {AppRoutes} from './types';
const Stack = createNativeStackNavigator<AppRoutes>();

export default function Navigation({
  animationEnabled = true,
  statusBarHidden = false,
}: {
  animationEnabled?: boolean;
  statusBarHidden?: boolean;
}) {
  return (
    <NavigationContainer ref={navigationRef} theme={DarkTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          statusBarStyle: 'light',
          statusBarHidden,
          contentStyle: {backgroundColor: '#000'},
          animation: animationEnabled ? 'slide_from_right' : 'none',
        }}
      >
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Skin" component={Skin} />
        <Stack.Screen name="About" component={About} />
        <Stack.Screen name="SearchPage" component={SearchPage} />
        <Stack.Screen name="Settings">
          {({navigation}) => <Settings navigation={navigation} />}
        </Stack.Screen>
        <Stack.Screen name="MusicHistory">
          {({navigation}) => <MusicHistory navigation={navigation} />}
        </Stack.Screen>
        <Stack.Screen name="CustomPlaylist" component={CustomPlaylist} />
        <Stack.Screen name="NeteaseLogin" component={NeteaseLogin} />
        <Stack.Screen name="QQMusicLogin" component={QQMusicLogin} />
        <Stack.Screen name="InitialLogin" component={InitialLogin} />
        <Stack.Screen name="Playlist" component={Playlist} />
        <Stack.Screen name="LocalMusic" component={LocalMusic} />
        <Stack.Screen name="ArtistPage" component={ArtistPage} />
        <Stack.Screen name="AlbumPage" component={AlbumPage} />
        <Stack.Screen name="Msg" component={Msg} />
        <Stack.Screen name="MsgHistory" component={MsgHistory} />
        <Stack.Screen name="MusicRecommend" component={MusicRecommend} />
        <Stack.Screen name="Radio">
          {({navigation}) => <Radio navigation={navigation} />}
        </Stack.Screen>
        <Stack.Screen name="RadioDetail" component={RadioDetail} />
        <Stack.Screen name="Charts" component={Charts} />
        <Stack.Screen name="HotPlaylist" component={HotPlaylist} />
        <Stack.Screen name="Favs" component={Favs} />
        <Stack.Screen name="CachePage">
          {({navigation}) => <CachePage navigation={navigation} />}
        </Stack.Screen>
        <Stack.Screen name="WebViewPage" component={WebViewPage} />
        <Stack.Screen name="Tip" component={Tip} />
        <Stack.Screen name="Cloud" component={Cloud} />
        <Stack.Screen name="UserManager" component={UserManager} />
        <Stack.Screen name="UserInfo" component={UserInfo} />
        <Stack.Screen name="FollowPage" component={FollowPage} />
        <Stack.Screen name="LanguagePage" component={LanguagePage} />
        <Stack.Screen name="FeaturePage" component={FeaturePage} />
        <Stack.Screen name="OrderPage">
          {({navigation}) => <OrderPage navigation={navigation} />}
        </Stack.Screen>
        <Stack.Screen name="MusicNotificationPage">
          {({navigation}) => <MusicNotificationPage navigation={navigation} />}
        </Stack.Screen>
        <Stack.Screen name="CommentPage" component={CommentPage} />
        <Stack.Screen name="ListenRecord" component={ListenRecord} />
        <Stack.Screen name="PlaylistIntersection" component={PlaylistIntersection} />
        <Stack.Screen name="LyricPage" component={LyricPage} />
        <Stack.Screen name="HappyBirthday" component={HappyBirthday} />
        <Stack.Screen name="SubNewSongs" component={SubNewSongs} />
        <Stack.Screen name="Video" component={Video} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
