import {toast} from '../native/toast';
import {Platform} from 'react-native';
import {storage} from '../storage';
import notification from '../settings/notification';
import keys from '../storage/keys';
import AudioPlayer from '../native/audioPlayer';

export default {
  init(actions) {
    let active = true;
    const subscriptions = [];
    const load = async () => {
      let config;
      try {
        config = await storage.load({key: keys.musicNotification});
      } catch (error) {
        if (error.name !== 'NotFoundError') throw error;
        config = notification.configObject;
      }
      if (!active) return;
      AudioPlayer.enableControl('previousTrack', config.prev.on);
      AudioPlayer.enableControl('playPause', config.play.on);
      AudioPlayer.enableControl('nextTrack', config.next.on);
      AudioPlayer.enableControl('stop', config.stop.on);
      if (config.prev.on) subscriptions.push(AudioPlayer.on('previousTrack', actions.previous));
      if (config.play.on) {
        subscriptions.push(
          AudioPlayer.on('play', actions.play),
          AudioPlayer.on('pause', actions.pause),
        );
      }
      if (config.next.on) subscriptions.push(AudioPlayer.on('nextTrack', actions.next));
      if (config.stop.on) subscriptions.push(AudioPlayer.on('stop', actions.stop));
      if (Platform.Version >= 29) AudioPlayer.enableControl('seek', config.seekbar.on);
    };
    load().catch((error) => {
      if (active) toast('通知控制初始化失败：' + error.message);
    });
    return () => {
      active = false;
      subscriptions.forEach((unsubscribe) => unsubscribe());
    };
  },
};
