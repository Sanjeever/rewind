import React, {useContext} from 'react';
import TouchableScale from 'react-native-touchable-scale';
import {ReducedMotionContext} from '../theme/motion';

export default function Touchable(props: React.ComponentProps<typeof TouchableScale>) {
  const reducedMotion = useContext(ReducedMotionContext);
  return (
    <TouchableScale {...props} activeScale={reducedMotion ? 1 : (props.activeScale ?? 0.97)} />
  );
}
