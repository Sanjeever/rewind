import {toast} from '../native/toast';
import {Platform} from 'react-native';
import {storage} from '../storage';
import notification from '../settings/notification';
import keys from '../storage/keys';
import AudioPlayer from '../native/audioPlayer';

export default {
  init(actions: {previous(): void; play(): void; pause(): void; next(): void; stop(): void}) {
    let active = true;
    const subscriptions: (() => void)[] = [];
    const load = async () => {
      let config;
      try {
        config = await storage.load<typeof notification.configObject>({
          key: keys.musicNotification,
        });
      } catch (error) {
        if (!(error instanceof Error && error.name === 'NotFoundError')) throw error;
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
      if (Number(Platform.Version) >= 29) AudioPlayer.enableControl('seek', config.seekbar.on);
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
