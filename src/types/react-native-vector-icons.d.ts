declare module 'react-native-vector-icons/lib/create-icon-set' {
  import type {ComponentType} from 'react';
  import type {ColorValue, TextProps} from 'react-native';
  export default function createIconSet(
    glyphMap: Readonly<Record<string, string | number>>,
    fontFamily: string,
    fontFile?: string,
  ): ComponentType<TextProps & {name: string; size?: number; color?: ColorValue}>;
}
