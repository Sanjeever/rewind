import cookies from '../../native/cookies';
import users from '../../storage/users';

export const guid = String(Math.floor(Math.random() * 9_000_000_000) + 1_000_000_000);

export function parseSession(header: string) {
  const values = new Map(
    header.split(';').flatMap((entry) => {
      const separator = entry.indexOf('=');
      return separator > 0
        ? [[entry.slice(0, separator).trim(), entry.slice(separator + 1).trim()]]
        : [];
    }),
  );
  const musicKey = values.get('qm_keyst') || values.get('qqmusic_key') || '';
  const musicId = (values.get('qqmusic_uin') || values.get('uin') || '0').replace(/^o0*/, '');
  let token = 5381;
  for (const char of musicKey) token = (token * 33 + char.charCodeAt(0)) & 0x7fffffff;
  const authenticated = musicKey.length > 0 && /^\d+$/.test(musicId) && Number(musicId) > 0;
  return {
    cookies: header,
    musicId: authenticated ? musicId : '0',
    musicKey: authenticated ? musicKey : '',
    token: authenticated ? token : 5381,
    loginType: authenticated ? (musicKey.startsWith('W_X') ? 1 : 2) : 0,
  };
}

export async function getWebSession() {
  const [web, api] = await Promise.all([
    cookies.get('https://y.qq.com'),
    cookies.get('https://u.y.qq.com'),
  ]);
  return parseSession(
    Object.values({...web, ...api})
      .map((cookie) => cookie.name + '=' + cookie.value)
      .join('; '),
  );
}

export async function getSession() {
  const current = await getWebSession();
  const account = await users.getUserInfo();
  return current.musicKey ? current : parseSession(account?.qqMusic?.cookies || '');
}
