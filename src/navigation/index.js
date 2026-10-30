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

const Stack = createNativeStackNavigator();
const screens = {Home, Skin, About, SearchPage, Settings, MusicHistory, CustomPlaylist, NeteaseLogin, QQMusicLogin, InitialLogin, Playlist, LocalMusic, ArtistPage, AlbumPage, Msg, MsgHistory, MusicRecommend, Radio, RadioDetail, Charts, HotPlaylist, Favs, CachePage, WebViewPage, Tip, Cloud, UserManager, UserInfo, FollowPage, LanguagePage, FeaturePage, OrderPage, MusicNotificationPage, CommentPage, ListenRecord, PlaylistIntersection, LyricPage, HappyBirthday, SubNewSongs, Video};

export default function Navigation({animationEnabled = true, statusBarHidden = false}) {
  return <NavigationContainer ref={navigationRef} theme={DarkTheme}>
    <Stack.Navigator screenOptions={{headerShown: false, statusBarStyle: 'light', statusBarHidden, contentStyle: {backgroundColor: '#000'}, animation: animationEnabled ? 'slide_from_right' : 'none'}}>
      {Object.entries(screens).map(([name, component]) => <Stack.Screen key={name} name={name} component={component} />)}
    </Stack.Navigator>
  </NavigationContainer>;
}
