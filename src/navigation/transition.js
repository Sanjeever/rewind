const i = ({navigation, scene}) => {
  const r = navigation.state.index === scene.index;
  const a = r ? 0 : 1000000;
  return {
    opacity: r ? 1 : 0,
    transform: [
      {
        translateX: a,
      },
      {
        translateY: a,
      },
    ],
  };
};
const u = (e) => {
  const {layout, position, scene} = e;
  if (!layout.isMeasured) {
    return i(e);
  }
  const scene_index = scene.index;
  const inputRange = [scene_index - 1, scene_index, scene_index + 0.99, scene_index + 1];
  return {
    opacity: position.interpolate({
      inputRange,
      outputRange: [0, 1, 1, 0],
    }),
  };
};
const o = function (e) {
  return {
    transitionSpec: e
      ? {
          duration: 0,
          useNativeDriver: true,
        }
      : {
          useNativeDriver: true,
        },
    screenInterpolator: function (e) {
      return u(e);
    },
  };
};
export default o;
