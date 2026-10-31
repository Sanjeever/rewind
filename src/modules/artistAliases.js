const o = function ({transNames, alias, trans}) {
  const t = [...(transNames || []), ...(alias || []), trans].filter((e) => e != '');
  return Array.from(new Set(t)).join(' / ');
};
export default o;
