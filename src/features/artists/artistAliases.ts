const o = function ({
  transNames,
  alias,
  trans,
}: {
  transNames?: string[];
  alias?: string[];
  trans?: string | null;
}) {
  const t = [...(transNames || []), ...(alias || []), trans].filter((e) => e != null && e !== '');
  return Array.from(new Set(t)).join(' / ');
};
export default o;
