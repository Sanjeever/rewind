import {responses} from './responses';
import * as http from './http';
import type {TrackId} from '../track';
interface CommentRequest {
  id: TrackId;
  limit?: number;
  offset?: number;
}
export const comment = function ({id, limit = 30, offset}: CommentRequest) {
  if (id) {
    const query = `offset=${offset === undefined ? 0 : offset}&limit=${limit}`;
    return http.request(responses.comment, `/api/v1/resource/comments/R_SO_4_${id}`, query);
  }
};
export const comment_radio = function ({id, limit = 30, offset}: CommentRequest) {
  const query = `offset=${offset === undefined ? 0 : offset}&limit=${limit}`;
  return http.request(responses.comment_radio, `/api/v1/resource/comments/A_DJ_1_${id}`, query);
};
export const comment_add = function ({id, text}: {id: TrackId; text: string}) {
  const timestamp = Math.round(Date.now());
  const body = {
    threadId: `R_SO_4_${id}`,
    content: text,
    csrf_token: '',
  };
  return http.cryptoRequest(
    responses.comment_add,
    `/weapi/resource/comments/add/?csrf_token=&timestamp=${timestamp}`,
    body,
  );
};
