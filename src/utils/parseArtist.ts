import type {Artist} from '../services/track';
const a = function (e: string | Artist[] | null | undefined) {
  if (e) {
    if (Array.isArray(e)) {
      return e.map((e) => e.name).join('/');
    }
    return e;
  }
};
export default a;
