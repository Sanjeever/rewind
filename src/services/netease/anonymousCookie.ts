function a(e: string, n: number) {
  return Array.from(Array(n))
    .map(() => e[Math.floor(Math.random() * e.length)])
    .join('');
}
const u = `${a('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKMNOPQRSTUVWXYZ\\/+', 176)}:${Date.now()}`;
const _ = a('0123456789abcdefghijklmnopqrstuvwxyz', 32);
const d = `JSESSIONID-WYYY=${u}; _iuqxldmzr_=32; _ntes_nnid=${_},${Date.now()}; _ntes_nuid=${_}; os=pc; appver=2.10.6; __remember_me=true; NMTID=xxx;`;
export default d;
