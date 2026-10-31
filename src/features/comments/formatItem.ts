import providers from '../../services/providers';
import * as utils from '../../utils/index';
import type * as z from 'zod/mini';
import type {comment} from '../../services/schemas';
import type {qqComment} from '../../services/qqmusic/responses';
import type {Provider} from '../../services/providers';
type KnownFields<T> = {[K in keyof T as string extends K ? never : K]: T[K]};
export type NeteaseComment = KnownFields<z.output<typeof comment>>;
export type QQComment = KnownFields<z.output<typeof qqComment>>;
export type CommentItem = NeteaseComment | QQComment;
export type CommentReply = KnownFields<NonNullable<NeteaseComment['beReplied']>[number]> & {
  time?: number;
};
export interface FormattedComment {
  content: string;
  userName?: string;
  userAvatar?: string;
  time?: string;
  beReplieds?: CommentReply[];
}
export const isNeteaseComment = (
  value: CommentItem | CommentReply,
): value is NeteaseComment | CommentReply => 'content' in value;
export const getFormattedItem = function (
  e: CommentItem | CommentReply,
  t?: Provider,
): FormattedComment {
  if (!t) {
    t = 'content' in e ? providers.netEase : providers.qqMusic;
  }
  if (t === providers.netEase && isNeteaseComment(e)) {
    const a: FormattedComment = {content: e.content ?? '评论内容不可用'};
    a.userName = e.user.nickname;
    a.userAvatar = `${e.user.avatarUrl}?param=100y100`;
    a.time = utils.timeFormatter.localeString(e.time);
    a.beReplieds = 'beReplied' in e ? e.beReplied : undefined;
    return a;
  }
  if (t === providers.qqMusic && !isNeteaseComment(e)) {
    const a: FormattedComment = {content: e.rootcommentcontent};
    a.content = e.rootcommentcontent;
    a.userName = e.nick;
    a.userAvatar = e.avatarurl;
    a.time = utils.timeFormatter.localeString(1000 * e.time);
    return a;
  }
  throw new Error('评论来源与内容格式不一致');
};
