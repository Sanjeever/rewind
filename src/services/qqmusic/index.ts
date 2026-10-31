import {responses, videoKey, videoFiles} from './responses';
import type {TrackId} from '../track';
interface AccountRequest {
  userId: TrackId;
  cookies: string;
}
import * as qqHttp from './http';
import {searchSongPage} from './search';
import {getLyric} from './lyrics';
import * as sign from './sign';
class QQMusicService {
  searchTypeMap = {
    song: 0,
    singer: 1,
    album: 2,
    playlist: 3,
    mv: 4,
  };
  getMusicUrl(mid: string, highQuality = false, track?: import('../track').TrackFields) {
    return qqHttp.getMusicUrl(mid, highQuality, track);
  }
  searchSong(query: string) {
    return searchSongPage(query).then((result) => result.songs);
  }
  searchSongPage = searchSongPage;
  user_subed_artist({userId, cookies}: AccountRequest) {
    return fetch(
      `http://c.y.qq.com/rsc/fcgi-bin/fcg_order_singer_getlist.fcg?utf8=1&page=1&perpage=100&uin=${userId}&rnd=0.32216905383427985&g_tk=5381&loginUin=${userId}&hostUin=${userId}&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq.json&needNewCode=0`,
      {
        headers: {
          Referer: 'https://y.qq.com/portal/profile.html',
          Cookie: cookies,
        },
      },
    )
      .then((e) => e.json().then((value) => responses.user_subed_artist.parse(value)))
      .then((e) => e.list);
  }
  user_subed_album({userId, cookies}: AccountRequest) {
    if (cookies) {
      return fetch(
        `http://c.y.qq.com/fav/fcgi-bin/fcg_get_profile_order_asset.fcg?g_tk=5381&loginUin=${userId}&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq.json&needNewCode=0&ct=20&cid=205360956&userid=${userId}&reqtype=2&sin=0&ein=9`,
        {
          headers: {
            Referer: 'https://y.qq.com/portal/profile.html',
            Cookie: cookies,
            UserAgent:
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.80 Safari/537.36',
          },
        },
      )
        .then((e) => e.json().then((value) => responses.user_subed_album.parse(value)))
        .then((e) => e.data.albumlist);
    }
  }
  like_artist({
    mid,
    cookies,
    userId,
    isLike,
  }: AccountRequest & {
    mid: string;
    isLike?: boolean;
  }) {
    return fetch(
      (isLike === undefined || isLike) === true
        ? `http://c.y.qq.com/rsc/fcgi-bin/fcg_order_singer_add.fcg?g_tk=5381&loginUin=${userId}&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq.json&needNewCode=0&singermid=${mid}&rnd=1550658587715`
        : `http://c.y.qq.com/rsc/fcgi-bin/fcg_order_singer_del.fcg?g_tk=5381&loginUin=${userId}&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq.json&needNewCode=0&singermid=${mid}&rnd=1550658587715`,
      {
        headers: {
          Referer: 'https://y.qq.com/portal/profile.html',
          Cookie: cookies,
        },
      },
    )
      .then((e) => e.json().then((value) => responses.like_artist.parse(value)))
      .then((e) => e);
  }
  search({
    keywords,
    page = 1,
    type = 'song',
  }: {
    keywords: string;
    page?: number;
    type?: 'song' | 'singer' | 'album' | 'playlist' | 'mv';
  }) {
    if (keywords) {
      const search_type = this.searchTypeMap[type];
      const body = JSON.stringify({
        data: {
          method: 'DoSearchForQQMusicDesktop',
          module: 'music.search.SearchCgiService',
          param: {
            search_type,
            query: keywords,
            page_num: page,
            num_per_page: 30,
          },
        },
      });
      const s = `https://u.y.qq.com/cgi-bin/musicu.fcg?_=${Date.now()}`;
      return fetch(s, {
        method: 'POST',
        body,
      })
        .then((response) => {
          if (!response.ok) throw new Error('QQ 音乐搜索 HTTP ' + response.status);
          return response.json().then((value) => responses.search.parse(value));
        })
        .then((response) => {
          if (response.code !== 0) throw new Error('QQ 音乐搜索失败：业务码 ' + response.code);
          if (response.data?.code !== 0)
            throw new Error('QQ 音乐搜索失败：业务码 ' + response.data?.code);
          if (!response.data.data?.body) throw new Error('QQ 音乐搜索响应缺少结果');
          return response.data.data.body;
        });
    }
  }
  search_playlist({keywords, page = 0, limit}: {keywords: string; page?: number; limit?: number}) {
    if (keywords) {
      return fetch(
        `http://c.y.qq.com/soso/fcgi-bin/client_music_search_songlist?remoteplace=txt.yqq.playlist&flag_qc=0&page_no=${page}&num_per_page=${limit === undefined ? 30 : limit}&query=${keywords}&g_tk=5381&loginUin=0&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0`,
        {
          headers: {
            Referer: 'https://y.qq.com/portal/search.html',
          },
        },
      )
        .then((response) => {
          if (!response.ok) throw new Error('QQ 音乐歌单搜索 HTTP ' + response.status);
          return response.json().then((value) => responses.search_playlist.parse(value));
        })
        .then((response) => {
          if (response.code !== 0) throw new Error('QQ 音乐歌单搜索失败：业务码 ' + response.code);
          return response.data;
        });
    }
  }
  artist_song(singerMid: string) {
    if (singerMid) {
      const body = JSON.stringify({
        comm: {
          cv: 4747474,
          ct: 24,
          format: 'json',
          inCharset: 'utf-8',
          outCharset: 'utf-8',
          notice: 0,
          platform: 'yqq.json',
          needNewCode: 1,
          uin: 0,
          g_tk_new_20200303: 5381,
          g_tk: 5381,
        },
        songList: {
          method: 'GetSingerSongList',
          param: {
            singerMid: singerMid,
            order: 1,
            begin: 0,
            num: 50,
          },
          module: 'musichall.song_list_server',
        },
      });
      const n = sign.getSecuritySign(body);
      return fetch(`https://u.y.qq.com/cgi-bin/musics.fcg?_=${Date.now()}&sign=${n}`, {
        body,
        method: 'POST',
      })
        .then((e) => e.json().then((value) => responses.artist_song.parse(value)))
        .then((e) => {
          const songList = e.songList.data.songList;
          if (songList === undefined) {
            return [];
          }
          return songList;
        });
    }
  }
  artist_mv(mid: TrackId) {
    if (mid) {
      return fetch(
        `http://c.y.qq.com/mv/fcgi-bin/fcg_singer_mv.fcg?g_tk=5381&loginUin=0&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0&singermid=${mid}&order=time&begin=0&num=52&cid=205360581`,
      )
        .then((e) => e.json().then((value) => responses.artist_mv.parse(value)))
        .then((e) => e.data.list);
    }
  }
  album(mid: TrackId) {
    if (mid) {
      return fetch(
        `http://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_album.fcg?format=json&platform=yqq&singermid=${mid}&order=time&begin=0&num=100&g_tk=5381&loginUin=0&hostUin=0&format=jsonp&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0`,
      )
        .then((e) => e.json().then((value) => responses.album.parse(value)))
        .then((e) => e.data.list);
    }
  }
  album_song(mid: TrackId) {
    if (mid) {
      return fetch(
        `http://c.y.qq.com/v8/fcg-bin/fcg_v8_album_info_cp.fcg?albummid=${mid}&g_tk=5381&loginUin=0&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0`,
      )
        .then((e) => e.json().then((value) => responses.album_song.parse(value)))
        .then((e) => e.data);
    }
  }
  profile(userId: TrackId, cookies?: string) {
    if (userId) {
      return fetch(
        `http://c.y.qq.com/rsc/fcgi-bin/fcg_get_profile_homepage.fcg?format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0&cid=205360838&ct=20&userid=${userId}&reqfrom=1&reqtype=0`,
        {
          headers: {
            Host: 'c.y.qq.com',
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.80 Safari/537.36',
            Referer: 'http://y.qq.com',
            ...(cookies
              ? {
                  Cookie: cookies,
                }
              : {}),
          },
          credentials: 'include',
        },
      )
        .then((e) => e.json().then((value) => responses.profile.parse(value)))
        .then(({data}) => {
          if (data) {
            return data;
          }
        });
    }
  }
  user_created_list(userId: TrackId) {
    if (userId) {
      return fetch(
        `http://c.y.qq.com/fav/fcgi-bin/fcg_get_profile_order_asset.fcg?g_tk=5381&loginUin=${userId}&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq.json&needNewCode=0&ct=20&cid=205360956&userid=${userId}&reqtype=3&sin=0&ein=10`,
      )
        .then((e) => e.json().then((value) => responses.user_created_list.parse(value)))
        .then((e) => e.data.cdlist);
    }
  }
  disslist({id, qq}: {id: TrackId; qq?: TrackId}) {
    if (id) {
      return fetch(
        `http://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg?type=1&json=1&utf8=1&onlysong=0&disstid=${id}&format=json&g_tk=5381&loginUin=${qq === undefined ? 0 : qq}&hostUin=0&format=jsonp&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0`,
        {
          headers: {
            Accept: 'application/json, text/javascript, */*; q=0.01',
            Origin: 'https://y.qq.com',
            Referer: 'https://y.qq.com/portal/profile.html',
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36',
          },
        },
      )
        .then((response) => {
          if (!response.ok) throw new Error('QQ 音乐歌单 HTTP ' + response.status);
          return response.json().then((value) => responses.disslist.parse(value));
        })
        .then((response) => {
          if (response.code !== 0) throw new Error('QQ 音乐歌单失败：业务码 ' + response.code);
          if (!Array.isArray(response.cdlist)) throw new Error('QQ 音乐响应缺少歌单');
          return response.cdlist;
        });
    }
  }
  addToDir({
    songmid,
    dirid,
    op = 1,
    qq = 0,
    cookies,
  }: {
    songmid: string;
    dirid: TrackId;
    op?: number;
    qq?: TrackId;
    cookies: string;
  }) {
    if (songmid) {
      return fetch('http://c.y.qq.com/splcloud/fcgi-bin/fcg_music_add2songdir.fcg?g_tk=5381', {
        method: 'POST',
        headers: {Cookie: cookies},
        body: `loginUin=${qq}&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq.post&needNewCode=0&uin=${qq}&midlist=${songmid}&typelist=13&dirid=${dirid}&addtype=${op}&formsender=4&source=153&r2=0&r3=1&utf8=1&g_tk=5381`,
      })
        .then((e) => e.json().then((value) => responses.addToDir.parse(value)))
        .then((e) => e);
    }
  }
  song_comments({
    songid,
    pagesize = 30,
    pagenum,
  }: {
    songid: TrackId;
    pagesize?: number;
    pagenum?: number;
  }) {
    if (songid) {
      return fetch(
        `http://c.y.qq.com/base/fcgi-bin/fcg_global_comment_h5.fcg?format=json&inCharset=utf8&outCharset=GB2312&notice=0&platform=yqq&needNewCode=0&cid=205360772&reqtype=2&biztype=1&topid=${songid}&cmd=8&needmusiccrit=0&pagenum=${pagenum === undefined ? 0 : pagenum}&pagesize=${pagesize}`,
      )
        .then((e) => e.json().then((value) => responses.song_comments.parse(value)))
        .then(({comment, hot_comment}) => {
          if (comment) {
            return {
              comment,
              hot_comment,
            };
          }
        });
    }
  }
  like({songmid, qq}: {songmid: string; qq: TrackId; cookies?: string}) {
    if (songmid) {
      return fetch(
        `http://c.y.qq.com/splcloud/fcgi-bin/fcg_music_add2songdir.fcg?g_tk=5381&loginUin=${qq}&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq.post&needNewCode=0&uin=${qq}&midlist=${songmid}&typelist=13&dirid=201&addtype=&formsender=4&source=153&r2=0&r3=1&utf8=1`,
      )
        .then((e) => e.json().then((value) => responses.like.parse(value)))
        .then((e) => e);
    }
  }
  dislike({id, qq, dirid}: {id: TrackId; qq: TrackId; dirid?: TrackId; cookies?: string}) {
    if (id) {
      return fetch(
        `http://c.y.qq.com/qzone/fcg-bin/fcg_music_delbatchsong.fcg?g_tk=5381&loginUin=${qq}&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq.post&needNewCode=0&uin=${qq}&dirid=${dirid === undefined ? 201 : dirid}&ids=${id}&source=103&types=3&formsender=4&flag=2&from=3&utf8=1`,
      )
        .then((e) => e.json().then((value) => responses.dislike.parse(value)))
        .then((e) => e);
    }
  }
  subscribe_playlist({id, op}: {id: TrackId; op?: 'subscribe' | 'unsubscribe'}) {
    if (id) {
      return fetch('http://c.y.qq.com/folder/fcgi-bin/fcg_qm_order_diss.fcg?g_tk=5381', {
        method: 'POST',
        body: `format=json&notice=0&platform=yqq&needNewCode=0&g_tk=5381&dissid=${id}&from=1&optype=${(op === undefined ? 'subscribe' : op) === 'subscribe' ? 1 : 2}&utf8=1`,
      })
        .then((response) => {
          if (!response.ok) throw new Error('QQ 音乐收藏 HTTP ' + response.status);
          return response.json().then((value) => responses.subscribe_playlist.parse(value));
        })
        .then((response) => {
          if (response.code !== 0) throw new Error('QQ 音乐收藏失败：业务码 ' + response.code);
          return response;
        });
    }
  }
  search_suggest(query: string) {
    if (query) {
      return fetch(
        `http://c.y.qq.com/splcloud/fcgi-bin/smartbox_new.fcg?is_xml=0&format=jsonp&key=${query}&g_tk=5381&loginUin=0&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0`,
      )
        .then((e) => e.json().then((value) => responses.search_suggest.parse(value)))
        .then((e) => e);
    }
  }
  getLyric(mid: TrackId) {
    return getLyric(mid);
  }
  async getMV(id: TrackId) {
    const files = await this.getMVFiles(id);
    if (!files?.length) {
      return null;
    }
    const {host, format_id, vid, filename} = files[0];
    return this.getMVUrl(host, format_id, vid, filename);
  }
  getMVUrl(host: string, formatId: number, vid: TrackId, filename: string) {
    return fetch(
      `http://vv.video.qq.com/getkey?otype=json&platform=11&format=${formatId}&vid=${vid}&filename=${filename}&appver=3.2.19.333`,
    )
      .then((e) => e.text())
      .then((e) => {
        const t = e.replace(/QZOutputJson=/gi, '').replace(/;/gi, '');
        return videoKey.parse(JSON.parse(t));
      })
      .then(({key}) => `${host}${filename}?vkey=${key}`);
  }
  getMVFiles(vid: TrackId) {
    return fetch(
      `http://vv.video.qq.com/getinfo?otype=json&appver=3.2.19.333&platform=11&defnpayver=1&vid=${vid}`,
    )
      .then((e) => e.text())
      .then((t) => {
        const n = t
          .replace(/QZOutputJson=/gi, '')
          .replace(/\]\}\};/g, ']}}')
          .replace(/;/, '');
        const r = videoFiles.parse(JSON.parse(n));
        const lnk = r.vl.vi[0].lnk;
        const url = r.vl.vi[0].ul.ui[0].url;
        const c = r.fl.fi;
        const u: {format_id: number; host: string; filename: string; vid: TrackId}[] = [];
        for (let a = r.vl.vi[0].cl.fc, s = c[c.length - 1].id, f = 1; f <= a; f++) {
          const l = `${lnk}.p${String(s % 10000)}.${f}.mp4`;
          const d: {
            format_id: number;
            host: string;
            filename: string;
            vid: TrackId;
          } = {
            format_id: s,
            host: url,
            filename: l,
            vid,
          };
          d.format_id = s;
          d.host = url;
          d.filename = l;
          d.vid = vid;
          u.push(d);
        }
        return u;
      });
  }
  getCookie(name: string, cookies: string) {
    let n;
    const r = cookies.replace(/[ ]/g, '');
    for (let i = r.split(';'), o = 0; o < i.length; o++) {
      const c = i[o].split('=');
      if (name === c[0]) {
        n = c[1];
        break;
      }
    }
    return n;
  }
}
export default new QQMusicService();
