import {Platform} from 'react-native';
import {storage} from '../storage';
import notification from '../settings/notification';
import keys from '../storage/keys';
import audioPlayer from '../native/audioPlayer';

export default {
  async init(player) {
    let config;
    try {
      config = await storage.load({key: keys.musicNotification});
    } catch (error) {
      if (error.name !== 'NotFoundError') throw error;
      config = notification.configObject;
    }
    audioPlayer.enableControl('previousTrack', config.prev.on);
    audioPlayer.enableControl('playPause', config.play.on);
    audioPlayer.enableControl('nextTrack', config.next.on);
    audioPlayer.enableControl('stop', config.stop.on);
    if (config.prev.on) audioPlayer.on('previousTrack', () => player.changeSong('pre'));
    if (config.play.on) {
      audioPlayer.on('play', () => player.playSound());
      audioPlayer.on('pause', () => player.pauseSound());
    }
    if (config.next.on) audioPlayer.on('nextTrack', () => player.changeSong('next'));
    if (config.stop.on) audioPlayer.on('stop', () => player.exit());
    if (Platform.Version >= 29) audioPlayer.enableControl('seek', config.seekbar.on);
  },
};
