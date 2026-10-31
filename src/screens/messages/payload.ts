import * as z from 'zod/mini';
import {album, video, track} from '../../services/schemas';
export const messagePayload = z.looseObject({
  msg: z.string(),
  type: z.optional(z.number()),
  album: z.optional(album),
  mv: z.optional(video),
  song: z.optional(track),
});
export type MessagePayload = z.output<typeof messagePayload>;
