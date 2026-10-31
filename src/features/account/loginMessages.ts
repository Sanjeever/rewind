import * as z from 'zod/mini';
import {profile} from '../../services/schemas';
export const neteaseMessage = z.looseObject({
  profile: z.extend(profile, {code: z.optional(z.number())}),
  token: z.optional(z.string()),
});
export const qqMessage = z.looseObject({
  nickname: z.string(),
  avatarUrl: z.string(),
  cookies: z.string(),
});
export type NeteaseMessage = z.output<typeof neteaseMessage>;
export type QQMessage = z.output<typeof qqMessage>;
