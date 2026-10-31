import './bootstrap/globals';
import React from 'react';
import {StatusBar, View} from 'react-native';
import {MenuProvider} from 'react-native-popup-menu';
import {mergeSettings} from './settings/merge.cjs';
import {storage} from './storage';
import * as modals from './modals';
import {defaultSettings} from './settings/defaults';
import names from './events/names';
import {emitter} from './events';
import keys from './storage/keys';
import Player from './player';
import installErrorHandler from './bootstrap/errors';
import {extractKeyValue} from './utils';
import navigationBar from './native/navigationBar';
import orientation from './native/orientation';
import permissions from './native/permissions';
import lastQueue from './storage/lastQueue';
import update from './services/update';
import Navigation from './navigation';

export default class App extends React.PureComponent {
  settingsLoaded = false;
  state = {
    displayNowPlaying: false,
    playerInfo: {
      tracks: [],
      songItem: null,
      songItemInfo: {singer: null, song: null},
      playingIndex: null,
      api: null,
    },
    lyric: null,
    hasTrans: false,
    checkPermissionDone: false,
    settings: extractKeyValue(defaultSettings, 'on'),
    bottomPaddingValue: 0,
  };

  componentDidMount() {
    this.bottomPaddingSubscription = emitter.addListener(
      names.BottomPaddingChange,
      (bottomPaddingValue) => {
        this.setState({bottomPaddingValue});
      },
    );
    this.settingsSubscription = emitter.addListener(names.SettingsChanged, this.loadSettings);
    installErrorHandler();
    this.initialize();
  }

  componentWillUnmount() {
    this.bottomPaddingSubscription.remove();
    this.settingsSubscription.remove();
  }

  initialize = async () => {
    try {
      await permissions.checkPermission();
      orientation.lockToPortrait();
      navigationBar.transparentStatusBar();
      this.setState({checkPermissionDone: true}, this.loadSettings);
      update.onlyCheck();
    } catch (error) {
      toast('初始化失败：' + error.message);
    }
  };

  setPlayerData = (updateQueue, onCommitted) => {
    this.setState(
      (state) => {
        const changes =
          typeof updateQueue === 'function' ? updateQueue(state.playerInfo) : updateQueue;
        return {playerInfo: {...state.playerInfo, ...changes}};
      },
      () => onCommitted?.(this.state.playerInfo),
    );
  };

  loadSettings = async () => {
    try {
      let saved;
      try {
        saved = await storage.load({key: keys.settings});
      } catch (error) {
        if (error.name !== 'NotFoundError') throw error;
        saved = defaultSettings;
        await storage.save({key: keys.settings, data: saved});
      }
      const settings = mergeSettings(saved, defaultSettings);
      const firstLoad = !this.settingsLoaded;
      this.settingsLoaded = true;
      this.setState(
        {
          settings: extractKeyValue(settings, 'on'),
          bottomPaddingValue: settings.bottomPadding.subtitle,
        },
        () => {
          if (firstLoad && settings.autoLoadLastPlayedTracks.on) {
            lastQueue.emit().catch((error) => toast('恢复播放队列失败：' + error.message));
          }
        },
      );
      emitter.emit(names.SetHomeState, {autoSetPlaylistOrder: settings.autoSetPlaylistOrder.on});
    } catch (error) {
      toast('读取设置失败：' + error.message);
    }
  };

  setDisplayNowPlaying = (displayNowPlaying) => this.setState({displayNowPlaying});
  setLyric = (lyric, hasTrans) => this.setState({lyric, hasTrans});

  render() {
    const {
      settings,
      displayNowPlaying,
      playerInfo,
      lyric,
      hasTrans,
      checkPermissionDone,
      bottomPaddingValue,
    } = this.state;
    if (!checkPermissionDone) return null;
    return (
      <MenuProvider>
        <View style={{flex: 1}}>
          <StatusBar backgroundColor="transparent" translucent hidden={settings.hideStatusBar} />
          <Navigation
            animationEnabled={!settings.disabledRouterTransition}
            statusBarHidden={settings.hideStatusBar}
          />
          <Player
            {...playerInfo}
            lyric={lyric}
            hasTrans={hasTrans}
            settings={settings}
            bottomPaddingValue={bottomPaddingValue}
            setPlayerData={this.setPlayerData}
            setDisplayNowPlaying={this.setDisplayNowPlaying}
            setLyric={this.setLyric}
          />
          <modals.LongPressModal />
          <modals.DetailModal
            cloneThroughLinking={settings.cloneThroughLinking}
            isRound={settings.isRound}
          />
          <modals.CollectModal />
          <modals.NowPlayingModal
            api={playerInfo.api}
            data={playerInfo.tracks}
            songItem={playerInfo.songItem}
            index={playerInfo.playingIndex}
            setDisplayNowPlaying={this.setDisplayNowPlaying}
            show={displayNowPlaying}
            isRound={settings.isRound}
          />
          <modals.SavePicModal />
          <modals.ChangePlaylistModal songItem={playerInfo.songItem} />
        </View>
      </MenuProvider>
    );
  }
}
