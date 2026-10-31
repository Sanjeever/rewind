import * as z from 'zod/mini';

const string = z.optional(z.string());
const number = z.optional(z.number());
const boolean = z.optional(z.boolean());
export const id = z.union([z.string(), z.number()]);
export const artist = z.looseObject({
  id: z.optional(id),
  mid: string,
  name: z.string(),
  alias: z.optional(z.array(z.string())),
  img1v1Url: string,
  picUrl: string,
  albumSize: number,
  musicSize: number,
  mvSize: number,
  trans: string,
  briefDesc: string,
  followed: boolean,
  is_follow: number,
});
export const album = z.looseObject({
  type: string,
  size: number,
  id: z.optional(id),
  mid: string,
  name: string,
  picUrl: string,
  publishTime: number,
  company: z.optional(z.nullable(z.string())),
  description: string,
  artist: z.optional(artist),
  artists: z.optional(z.array(artist)),
  alias: z.optional(z.array(z.string())),
  transNames: z.optional(z.array(z.string())),
});
export const track = z.looseObject({
  api: z.optional(z.enum(['netEase', 'qqMusic', 'local'])),
  id: z.optional(id),
  mid: string,
  songmid: string,
  songid: z.optional(id),
  name: string,
  songname: string,
  song: string,
  title: string,
  filename: string,
  singer: z.optional(z.union([z.string(), z.array(artist)])),
  artists: z.optional(z.array(artist)),
  ar: z.optional(z.array(artist)),
  album: z.optional(z.union([z.string(), album])),
  al: z.optional(z.union([album, z.array(album)])),
  albumname: string,
  albummid: string,
  albumId: z.optional(id),
  path: string,
  dt: number,
  duration: number,
  interval: number,
  fee: number,
  type: number,
  file: z.optional(z.looseObject({media_mid: string})),
  mv: z.optional(z.union([z.number(), z.looseObject({vid: z.optional(id)})])),
  mvid: z.optional(id),
  mainTrackId: number,
  rid: z.optional(id),
  description: string,
  localPath: string,
  alias: z.optional(z.array(z.string())),
  tns: z.optional(z.array(z.string())),
  transName: string,
});
export const profile = z.looseObject({
  userId: id,
  avatarUrl: string,
  nickname: string,
  signature: string,
  birthday: number,
  followed: boolean,
  follows: number,
  followeds: number,
  backgroundUrl: string,
  gender: number,
  city: number,
  province: number,
  playlistCount: number,
  userType: number,
  eventCount: number,
});
export const playlist = z.looseObject({
  id: z.optional(id),
  name: string,
  title: string,
  coverImgUrl: string,
  trackCount: number,
  creator: z.optional(profile),
  tracks: z.optional(z.nullable(z.array(track))),
  trackIds: z.optional(z.array(z.looseObject({id, lr: number}))),
  subscribed: boolean,
  description: z.optional(z.nullable(z.string())),
  playCount: number,
  updateTime: number,
  userId: z.optional(id),
  tags: z.optional(z.array(z.string())),
});
export const video = z.looseObject({
  id: z.optional(id),
  name: string,
  cover: string,
  imgurl: string,
  artistName: string,
  artistId: z.optional(id),
  duration: number,
  playCount: number,
});
export const comment = z.looseObject({
  commentId: id,
  content: z.string(),
  time: z.number(),
  user: profile,
  likedCount: number,
  beReplied: z.optional(z.array(z.looseObject({content: z.string(), user: profile}))),
});
export const audio = z.looseObject({
  type: string,
  url: z.optional(z.nullable(z.string())),
  code: number,
  payed: number,
  freeTrialInfo: z.optional(z.nullable(z.looseObject({start: number, end: number}))),
});
export const radio = z.looseObject({
  id,
  name: z.string(),
  picUrl: string,
  desc: string,
  programCount: number,
  subCount: number,
  dj: z.optional(profile),
});
export const program = z.looseObject({
  id,
  name: string,
  mainSong: track,
  description: string,
  duration: number,
  coverUrl: string,
  createTime: number,
  mainTrackId: number,
});
export const userMessage = z.looseObject({
  fromUser: profile,
  toUser: z.optional(profile),
  lastMsg: string,
  msg: string,
  time: number,
  newMsgCount: number,
});

export function response<T extends z.core.$ZodLooseShape>(shape: T) {
  return z.looseObject({
    code: z.number(),
    message: z.optional(z.nullable(z.string())),
    msg: z.optional(z.nullable(z.string())),
    ...shape,
  });
}
export const status = response({});
export function parseResponse<S extends z.ZodMiniType>(schema: S, value: unknown): z.output<S> {
  const result = z.safeParse(schema, value);
  if (!result.success) throw new Error('服务响应格式无效', {cause: result.error});
  return result.data;
}
