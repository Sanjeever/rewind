const u = {
  isOverEdge: function ({
    gestureState,
    DEVICE_WIDTH,
  }: {
    gestureState: {moveX: number};
    DEVICE_WIDTH: number;
  }) {
    const gestureState_moveX = gestureState.moveX;
    return gestureState_moveX > 65 && gestureState_moveX < DEVICE_WIDTH - 65;
  },
  stepMap: function (e: number, t = 10) {
    const r = -e;
    if (Math.abs(e) >= t) {
      return r >= 0 ? t : -t;
    }
    return r;
  },
};
export default u;
