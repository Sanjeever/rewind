const a = function (e) {
  if (e) {
    if (Array.isArray(e)) {
      return e.map((e) => e.name).join('/');
    }
    return e;
  }
};
export default a;
