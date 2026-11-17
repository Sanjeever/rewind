import React, {createContext, useEffect, useState} from 'react';
import * as ReactNative from 'react-native';

export const motion = {press: 100, state: 180, panel: 260};
export const ReducedMotionContext = createContext(false);

export function MotionProvider({children}: React.PropsWithChildren) {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    let active = true;
    let changed = false;
    const subscription = ReactNative.AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (value) => {
        changed = true;
        setReduced(value);
      },
    );
    ReactNative.AccessibilityInfo.isReduceMotionEnabled().then((value) => {
      if (active && !changed) setReduced(value);
    });
    return () => {
      active = false;
      subscription.remove();
    };
  }, []);
  return <ReducedMotionContext.Provider value={reduced}>{children}</ReducedMotionContext.Provider>;
}
