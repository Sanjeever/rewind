export default function (e, r) {
  const {render, defaultProps} = e;
  e.defaultProps = {
    ...defaultProps,
    ...r,
  };
  e.render = function (e) {
    const l = e;
    e = {
      ...e,
      style: [r.style, e.style],
    };
    try {
      return render.apply(this, arguments);
    } finally {
      e = l;
    }
  };
}
