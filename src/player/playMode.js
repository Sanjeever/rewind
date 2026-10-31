import {toast} from '../native/toast';
import providers from '../services/providers';
import locales from '../locales';
import * as services from '../services';
import users from '../storage/users';

async function refreshNeteaseLikes() {
  const response = await services.Netease.likelist();
  if (response?.code === 200) await users.saveUserLikeList(response.ids, providers.netEase);
}

async function refreshQQLikes() {
  const playlists = await users.getUserPlayList();
  const playlist = playlists?.qqMusic?.[0];
  if (!playlist) return;
  const response = await services.QQMusic.disslist({id: playlist.id || playlist.dissid});
  if (response?.[0]?.songlist)
    await users.saveUserLikeList(
      response[0].songlist.map((song) => song.songmid),
      providers.qqMusic,
    );
}

async function likeNetease(song, isLike) {
  const response = await services.Netease.like({id: song.id, isLike});
  if (response?.code === 200) await refreshNeteaseLikes();
  else if (response?.code === 512) toast(locales.PAIDSONG_CANT_COLLECT);
  else if (response?.code === -460) {
    const playlists = await users.getUserPlayList();
    const id = playlists?.netEase?.[0]?.id;
    if (id)
      await services.Netease.playlist_tracks({
        op: isLike ? 'add' : 'del',
        pid: id,
        tracks: song.id,
      });
  }
}

async function likeQQ(song, isLike) {
  const account = (await users.getUserInfo())?.qqMusic;
  if (!account?.cookies) return;
  if (isLike) {
    await services.QQMusic.like({
      songmid: song.mid || song.songmid,
      qq: account.userId,
      cookies: account.cookies,
    });
    await refreshQQLikes();
  } else {
    const response = await services.QQMusic.dislike({
      id: song.id || song.songid,
      qq: account.userId,
      cookies: account.cookies,
    });
    if (response.code !== 0) toast(locales.ERROR);
  }
}

export default {
  async onLike(song, api, liked = true) {
    if (api === providers.netEase) {
      await likeNetease(song, !liked);
      await users.removeNetEasePlaylistCache();
    } else if (api === providers.qqMusic) await likeQQ(song, !liked);
  },
};
