Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var utils = require("../../utils/index"),
  sign = require("./sign"),
  a = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36',
    Accept: '*/*',
    Referer: 'http://y.qq.com/portal/player.html',
    'Accept-Language': 'zh-CN,zh;q=0.8',
    Host: 'c.y.qq.com'
  },
  s = new class e {
    constructor() {
      this.searchTypeMap = {
        song: 0,
        singer: 1,
        album: 2,
        playlist: 3,
        mv: 4
      };
    }
    "getMusicUrl"(e) {
      return fetch("https://u.y.qq.com/cgi-bin/musicu.fcg?g_tk=5381&loginUin=1152921504792286499&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq.json&needNewCode=0&data={\"req\":{\"module\":\"CDN.SrfCdnDispatchServer\",\"method\":\"GetCdnDispatch\",\"param\":{\"guid\":\"4422768122\",\"calltype\":0,\"userip\":\"\"}},\"req_0\":{\"module\":\"vkey.GetVkeyServer\",\"method\":\"CgiGetVkey\",\"param\":{\"guid\":\"4422768122\",\"songmid\":[\"" + e + "\"],\"songtype\":[0],\"uin\":\"1152921504792286499\",\"loginflag\":1,\"platform\":\"20\"}},\"comm\":{\"uin\":\"1152921504792286499\",\"format\":\"json\",\"ct\":24,\"cv\":0}}", {
        withCredentials: true,
        headers: {
          'Accept-Encoding': 'identity;q=1, *;q=0',
          'Accept-Language': 'zh-CN,zh;q=0.9',
          Connection: 'keep-alive',
          'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.84 Safari/537.36'
        }
      }).then(function (e) {
        return e.json();
      }).then(function (e) {
        var t = e.req_0.data.midurlinfo[0].purl,
          n = e.req.data.sip[2];
        if (t) return "" + n + t;
      }).catch(function () {});
    }
    "searchSong"(e) {
      var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 1,
        n = JSON.stringify({
          data: {
            method: 'DoSearchForQQMusicDesktop',
            module: 'music.search.SearchCgiService',
            param: {
              search_type: 0,
              query: e,
              page_num: t,
              num_per_page: 30
            }
          }
        }),
        r = "https://u.y.qq.com/cgi-bin/musicu.fcg?_=" + Date.now();
      return fetch(r, {
        method: 'POST',
        body: n
      }).then(function (e) {
        return e.json();
      }).then(function (e) {
        return e.data.data.body.song.list;
      });
    }
    "user_subed_artist"(e) {
      var t = e.userId,
        n = e.cookies;
      return fetch("http://c.y.qq.com/rsc/fcgi-bin/fcg_order_singer_getlist.fcg?utf8=1&page=1&perpage=100&uin=" + t + "&rnd=0.32216905383427985&g_tk=5381&loginUin=" + t + "&hostUin=" + t + "&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq.json&needNewCode=0", {
        headers: {
          Referer: 'https://y.qq.com/portal/profile.html',
          Cookie: n
        }
      }).then(function (e) {
        return e.json();
      }).then(function (e) {
        return e.list;
      });
    }
    "user_subed_album"(e) {
      var t = e.userId,
        n = e.cookies;
      if (n) return fetch("http://c.y.qq.com/fav/fcgi-bin/fcg_get_profile_order_asset.fcg?g_tk=5381&loginUin=" + t + "&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq.json&needNewCode=0&ct=20&cid=205360956&userid=" + t + "&reqtype=2&sin=0&ein=9", {
        headers: {
          Referer: 'https://y.qq.com/portal/profile.html',
          Cookie: n,
          UserAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.80 Safari/537.36'
        }
      }).then(function (e) {
        return e.json();
      }).then(function (e) {
        return e.data.albumlist;
      });
    }
    "like_artist"(e) {
      var t = e.mid,
        n = e.cookies,
        r = e.userId,
        i = e.isLike;
      return fetch(true === (void 0 === i || i) ? "http://c.y.qq.com/rsc/fcgi-bin/fcg_order_singer_add.fcg?g_tk=5381&loginUin=" + r + "&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq.json&needNewCode=0&singermid=" + t + "&rnd=1550658587715" : "http://c.y.qq.com/rsc/fcgi-bin/fcg_order_singer_del.fcg?g_tk=5381&loginUin=" + r + "&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq.json&needNewCode=0&singermid=" + t + "&rnd=1550658587715", {
        headers: {
          Referer: 'https://y.qq.com/portal/profile.html',
          Cookie: n
        }
      }).then(function (e) {
        return e.json();
      }).then(function (e) {
        return e;
      });
    }
    "search"(e) {
      var t = e.keywords,
        n = e.page,
        r = void 0 === n ? 1 : n,
        i = e.type,
        o = void 0 === i ? 'song' : i;
      if (t) {
        var c = this.searchTypeMap[o],
          a = JSON.stringify({
            data: {
              method: 'DoSearchForQQMusicDesktop',
              module: 'music.search.SearchCgiService',
              param: {
                search_type: c,
                query: t,
                page_num: r,
                num_per_page: 30
              }
            }
          }),
          s = "https://u.y.qq.com/cgi-bin/musicu.fcg?_=" + Date.now();
        return fetch(s, {
          method: 'POST',
          body: a
        }).then(function (e) {
          return e.json();
        }).then(function (e) {
          return e.data.data.body;
        });
      }
    }
    "search_playlist"(e) {
      var t = e.keywords,
        n = e.page,
        r = void 0 === n ? 0 : n,
        i = e.limit;
      if (t) return fetch("http://c.y.qq.com/soso/fcgi-bin/client_music_search_songlist?remoteplace=txt.yqq.playlist&flag_qc=0&page_no=" + r + "&num_per_page=" + (void 0 === i ? 30 : i) + "&query=" + t + "&g_tk=5381&loginUin=0&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0", {
        headers: {
          Referer: 'https://y.qq.com/portal/search.html'
        }
      }).then(function (e) {
        return e.json();
      }).then(function (e) {
        return e.data;
      });
    }
    "artist_song"(e) {
      if (e) {
        var t = JSON.stringify({
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
              g_tk: 5381
            },
            songList: {
              method: 'GetSingerSongList',
              param: {
                singerMid: e,
                order: 1,
                begin: 0,
                num: 50
              },
              module: 'musichall.song_list_server'
            }
          }),
          n = (0, sign.getSecuritySign)(t);
        return fetch("https://u.y.qq.com/cgi-bin/musics.fcg?_=" + Date.now() + "&sign=" + n, {
          body: t,
          method: 'POST'
        }).then(function (e) {
          return e.json();
        }).then(function (e) {
          var t = e.songList.data.songList;
          return void 0 === t ? [] : t;
        });
      }
    }
    "artist_mv"(e) {
      if (e) return fetch("http://c.y.qq.com/mv/fcgi-bin/fcg_singer_mv.fcg?g_tk=5381&loginUin=0&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0&singermid=" + e + "&order=time&begin=0&num=52&cid=205360581").then(function (e) {
        return e.json();
      }).then(function (e) {
        return e.data.list;
      });
    }
    "album"(e) {
      if (e) return fetch("http://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_album.fcg?format=json&platform=yqq&singermid=" + e + "&order=time&begin=0&num=100&g_tk=5381&loginUin=0&hostUin=0&format=jsonp&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0").then(function (e) {
        return e.json();
      }).then(function (e) {
        return e.data.list;
      });
    }
    "album_song"(e) {
      if (e) return fetch("http://c.y.qq.com/v8/fcg-bin/fcg_v8_album_info_cp.fcg?albummid=" + e + "&g_tk=5381&loginUin=0&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0").then(function (e) {
        return e.json();
      }).then(function (e) {
        return e.data;
      });
    }
    "profile"(e) {
      if (e) return fetch("http://c.y.qq.com/rsc/fcgi-bin/fcg_get_profile_homepage.fcg?format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0&cid=205360838&ct=20&userid=" + e + "&reqfrom=1&reqtype=0", {
        headers: {
          Host: 'c.y.qq.com',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.80 Safari/537.36',
          Referer: 'http://y.qq.com',
          Cookie: 'pgv_pvi=9099566080; pgv_si=s8829851648; pgv_info=ssid=s8935732285; pgv_pvid=3505264524; ts_uid=4647537021; _qpsvr_localtk=0.635905469678008; ptisp=ctc; RK=+eLNjH4YxE; ptcz=d86c4e2c903cc981336e0c79e13ae45d50b587575e3539a7c9ebbbe9518bdf36; yq_index=0; player_exist=1; qqmusic_fromtag=66; ts_refer=xui.ptlogin2.qq.com/cgi-bin/xlogin; ptui_loginuin=2360314753; _ga=GA1.2.366192045.1560243964; tvfe_boss_uuid=21ee0865e4c6fd46; uin=o2360314753; luin=o2360314753; p_uin=o2360314753; p_luin=o2360314753; yqq_stat=0; skey=@32Zv31UFR; lskey=0001000047de96e5d2b008eadd947809d2c3147c7fd15dba77d29403906eeef5a8b9156f77629949f962999d; pt4_token=3EKnvbV5iRNJxtbZSPA*5sBBQddC3s5pO3hu5D5fDfI_; p_skey=XePo8qP0GBWL0oD*dnJntWr9HncwnHDpbhmNJ1iJeUc_; p_lskey=000400007c63068dec37a686ae7827473a9796fef7a18cb629e73db8ebe1f89fda50192310a455be8107c8f8; yplayer_open=0; ts_last=y.qq.com/portal/profile.html; userAction=1'
        },
        credentials: 'include'
      }).then(function (e) {
        return e.json();
      }).then(function (e) {
        var t = e.data;
        if (t) return t;
      });
    }
    "user_created_list"(e) {
      if (e) return fetch("http://c.y.qq.com/fav/fcgi-bin/fcg_get_profile_order_asset.fcg?g_tk=5381&loginUin=" + e + "&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq.json&needNewCode=0&ct=20&cid=205360956&userid=" + e + "&reqtype=3&sin=0&ein=10").then(function (e) {
        return e.json();
      }).then(function (e) {
        return e.data.cdlist;
      });
    }
    "disslist"(e) {
      var t = e.id,
        n = e.qq;
      if (t) return fetch("http://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg?type=1&json=1&utf8=1&onlysong=0&disstid=" + t + "&format=json&g_tk=5381&loginUin=" + (void 0 === n ? 0 : n) + "&hostUin=0&format=jsonp&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0", {
        headers: {
          Accept: 'application/json, text/javascript, */*; q=0.01',
          Origin: 'https://y.qq.com',
          Referer: 'https://y.qq.com/portal/profile.html',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'
        }
      }).then(function (e) {
        return e.json();
      }).then(function (e) {
        var t = e.cdlist;
        if (t) return t;
      }).catch(function () {});
    }
    "addToDir"(e) {
      var t = e.songmid,
        n = e.dirid,
        r = e.op,
        i = void 0 === r ? 1 : r,
        o = e.qq,
        c = void 0 === o ? 0 : o;
      if (t) {
        return fetch('http://c.y.qq.com/splcloud/fcgi-bin/fcg_music_add2songdir.fcg?g_tk=5381', {
          method: 'POST',
          body: "loginUin=" + c + "&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq.post&needNewCode=0&uin=" + c + "&midlist=" + t + "&typelist=13&dirid=" + n + "&addtype=" + i + "&formsender=4&source=153&r2=0&r3=1&utf8=1&g_tk=5381"
        }).then(function (e) {
          return e.json();
        }).then(function (e) {
          return e;
        }).catch(function (e) {
          return e;
        });
      }
    }
    "song_comments"(e) {
      var t = e.songid,
        n = e.pagesize,
        r = void 0 === n ? 30 : n,
        i = e.pagenum;
      if (t) return fetch("http://c.y.qq.com/base/fcgi-bin/fcg_global_comment_h5.fcg?format=json&inCharset=utf8&outCharset=GB2312&notice=0&platform=yqq&needNewCode=0&cid=205360772&reqtype=2&biztype=1&topid=" + t + "&cmd=8&needmusiccrit=0&pagenum=" + (void 0 === i ? 0 : i) + "&pagesize=" + r).then(function (e) {
        return e.json();
      }).then(function (e) {
        var t = e.comment,
          n = e.hot_comment;
        if (t) return {
          comment: t,
          hot_comment: n
        };
      });
    }
    "like"(e) {
      var t = e.songmid,
        n = e.qq;
      if (t) return fetch("http://c.y.qq.com/splcloud/fcgi-bin/fcg_music_add2songdir.fcg?g_tk=5381&loginUin=" + n + "&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq.post&needNewCode=0&uin=" + n + "&midlist=" + t + "&typelist=13&dirid=201&addtype=&formsender=4&source=153&r2=0&r3=1&utf8=1").then(function (e) {
        return e.json();
      }).then(function (e) {
        return e;
      });
    }
    "dislike"(e) {
      var t = e.id,
        n = e.qq,
        r = e.dirid;
      if (t) return fetch("http://c.y.qq.com/qzone/fcg-bin/fcg_music_delbatchsong.fcg?g_tk=5381&loginUin=" + n + "&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq.post&needNewCode=0&uin=" + n + "&dirid=" + (void 0 === r ? 201 : r) + "&ids=" + t + "&source=103&types=3&formsender=4&flag=2&from=3&utf8=1").then(function (e) {
        return e.json();
      }).then(function (e) {
        return e;
      });
    }
    "subscribe_playlist"(e) {
      var t = e.id,
        n = e.op;
      if (t) {
        return fetch('http://c.y.qq.com/folder/fcgi-bin/fcg_qm_order_diss.fcg?g_tk=5381', {
          method: 'POST',
          body: "notice=0&platform=yqq&needNewCode=0&g_tk=5381&dissid=" + t + "&from=1&optype=" + ('subscribe' === (void 0 === n ? 'subscribe' : n) ? 1 : 2) + "&utf8=1"
        }).then(function (e) {
          return e.text();
        }).then(function (e) {
          return e;
        }).catch(function () {});
      }
    }
    "search_suggest"(e) {
      if (e) return fetch("http://c.y.qq.com/splcloud/fcgi-bin/smartbox_new.fcg?is_xml=0&format=jsonp&key=" + e + "&g_tk=5381&loginUin=0&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0").then(function (e) {
        return e.json();
      }).then(function (e) {
        return e;
      }).catch(function (e) {
        return e;
      });
    }
    "getLyric"(e) {
      return fetch('http://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg?callback=MusicJsonCallback_lrc&pcachetime=1494070301711&songmid=' + e + '&g_tk=5381&jsonpCallback=MusicJsonCallback_lrc&loginUin=0&hostUin=0&format=jsonp&inCharset=utf8&outCharset=utf-8\xacice=0&platform=yqq&needNewCode=0', {
        headers: a
      }).then(function (e) {
        return e.text();
      }).then(function (e) {
        var t = e.replace(/(MusicJsonCallback_lrc\()/gi, '').replace(/\)/g, ''),
          n = JSON.parse(t),
          r = utils.base64.decode(n.lyric),
          i = utils.base64.decode(n.trans);
        return {
          lyric: (0, utils.parseLyric)(r),
          trans: (0, utils.parseLyric)(i)
        };
      }).catch(function (e) {
        throw e;
      });
    }
    async "getMV"(id) {
      const files = await this.getMVFiles(id);
      if (!files?.length) return null;
      const {
        host,
        format_id,
        vid,
        filename
      } = files[0];
      return this.getMVUrl(host, format_id, vid, filename);
    }
    "getMVUrl"(e, t, n, r) {
      return fetch("http://vv.video.qq.com/getkey?otype=json&platform=11&format=" + t + "&vid=" + n + "&filename=" + r + "&appver=3.2.19.333").then(function (e) {
        return e.text();
      }).then(function (e) {
        var t = e.replace(/QZOutputJson=/gi, '').replace(/;/gi, '');
        return JSON.parse(t);
      }).then(function (t) {
        var n = t.key;
        return "" + e + r + "?vkey=" + n;
      });
    }
    "getMVFiles"(e) {
      return fetch("http://vv.video.qq.com/getinfo?otype=json&appver=3.2.19.333&platform=11&defnpayver=1&vid=" + e).then(function (e) {
        return e.text();
      }).then(function (t) {
        for (var n = t.replace(/QZOutputJson=/gi, '').replace(/\]\}\};/g, ']}}').replace(/;/, ''), r = JSON.parse(n), i = r.vl.vi[0].lnk, o = r.vl.vi[0].ul.ui[0].url, c = r.fl.fi, a = r.vl.vi[0].cl.fc, s = c[c.length - 1].id, u = [], f = 1; f <= a; f++) {
          var l = i + '.p' + String(s % 1e4) + '.' + f + '.mp4',
            d = {};
          d.format_id = s;
          d.host = o;
          d.filename = l;
          d.vid = e;
          u.push(d);
        }
        return u;
      });
    }
    "getCookie"(e, t) {
      for (var n, r = t.replace(/[ ]/g, ''), i = r.split(';'), o = 0; o < i.length; o++) {
        var c = i[o].split('=');
        if (e === c[0]) {
          n = c[1];
          break;
        }
      }
      return n;
    }
  }();
exports.default = s;
