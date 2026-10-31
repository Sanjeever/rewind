const o = function ({
  transNames,
  alias,
  trans,
}: {
  transNames?: string[];
  alias?: string[];
  trans?: string;
}) {
  const t = [...(transNames || []), ...(alias || []), trans].filter((e) => e != '');
  return Array.from(new Set(t)).join(' / ');
};
export default o;
