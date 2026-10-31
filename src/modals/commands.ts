import createEmitter from '../events/Emitter';
import type {ModalEvents, TrackDetails} from './types';

const modals = createEmitter<ModalEvents>();

export function subscribeModal<K extends keyof ModalEvents>(
  name: K,
  listener: (payload: ModalEvents[K]) => void,
) {
  return modals.addListener(name, listener);
}

export function showTrackDetails({
  api = 'netEase',
  ...details
}: Omit<TrackDetails, 'api'> & {api?: TrackDetails['api']}) {
  modals.emit('DetailModal', {...details, api});
}

export function showTrackActions(track: ModalEvents['LongPressModal']) {
  modals.emit('LongPressModal', track);
}

export function collectTracks(tracks: ModalEvents['CollectModal']) {
  modals.emit('CollectModal', tracks);
}

export function savePicture(picture: ModalEvents['SavePicModal']) {
  modals.emit('SavePicModal', picture);
}

export function choosePlaylist() {
  modals.emit('ChangePlaylist');
}

export function closeNowPlaying() {
  modals.emit('NowPlayingModal', {forceClose: true});
}
