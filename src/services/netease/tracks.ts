import {responses} from './responses';
import * as http from './http';
import type {TrackId} from '../track';
import md5 from '../../utils/md5';
import chunk from 'lodash/chunk';
interface AudioRequest {
  id?: TrackId;
  ids?: TrackId[];
  br?: number;
}
let audioRequest: AbortController | null = null;
function startAudioRequest() {
  audioRequest?.abort();
  audioRequest = new AbortController();
  return audioRequest;
}
export const song_detail = async (
  tracks: {
    id: TrackId;
  }[],
) => {
  if (!tracks?.length) {
    return;
  }
  const results = await Promise.all(
    chunk(tracks, 1000).map((group) =>
      http.cryptoRequest(responses.song_detail, '/weapi/v3/song/detail', {
        c: JSON.stringify(
          group.map((track) => ({
            id: track.id,
          })),
        ),
      }),
    ),
  );
  return {
    songs: results.flatMap((response) => {
      if (!response.songs) throw new Error(`网易云歌曲详情失败（${response.code}）`);
      return response.songs;
    }),
  };
};
export const musicUrl = function ({id, ids, br = 320000}: AudioRequest) {
  const request = startAudioRequest();
  const body = {
    ids: `[${ids ? ids.join(',') : id}]`,
    level: br > 320000 ? 'lossless' : br >= 320000 ? 'exhigh' : 'standard',
    encodeType: 'aac',
  };
  return http.eapiRequest(responses.musicUrl, '/api/song/enhance/player/url/v1', body, request);
};
export const freeMusicUrl = function ({id, ids, br = 320000}: AudioRequest) {
  return musicUrl({id, ids, br});
};
export const lyric = function (id: TrackId) {
  const query = `?os=osx&id=${id}&lv=-1&kv=-1&tv=-1`;
  return http.request(responses.lyric, '/api/song/lyric', query);
};
export const mv = function (id: TrackId) {
  const query = `?id=${id}`;
  return http.request(responses.mv, '/api/mv/detail', query);
};
export const play_count = function (id: TrackId, sourceId: TrackId | undefined, time: number) {
  const logs = JSON.stringify([
    {
      action: 'play',
      json: {
        download: 0,
        end: 'playend',
        id: id,
        sourceId: sourceId,
        time: time,
        type: 'song',
        wifi: 0,
      },
    },
  ]);
  const query = `logs=${encodeURI(logs)}&timestamp=${Date.now()}`;
  return http.request(responses.play_count, '/api/feedback/weblog', query);
};
export const imgID2url = function (imageId: string, size = 100) {
  if (imageId) {
    const secret = '3go8&$8*3*3h0k(2)2';
    const secretCodes = Array.from(secret).map((_, index) => secret.charCodeAt(index));
    const imageCodes = Array.from(imageId).map((_, index) => imageId.charCodeAt(index));
    const bytes: number[] = [];
    for (let index = 0; index < imageCodes.length; index++) {
      const byte = 255 & (imageCodes[index] ^ secretCodes[index % secret.length]);
      bytes.push(byte);
    }
    const encoded = bytes.map((byte) => String.fromCharCode(byte)).join('');
    return `http://p1.music.126.net/${md5.b64_md5(encoded).replace(/\//g, '_').replace(/\+/g, '-')}==/${imageId}.jpg?param=y${size}y${size}`;
  }
};
