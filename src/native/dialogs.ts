import {NativeModules} from 'react-native';
export interface PickerItem<T> {
  label: string;
  value: T;
}
type Selection<T> =
  {action: 'positive'; selectedItem: T} | {action: 'negative'; selectedItem?: never};
type PromptResult = {action: 'positive'; text: string} | {action: 'negative'; text?: never};
const native = NativeModules.RewindDialogs as {
  prompt(
    title: string,
    message: string | null,
    options: {defaultValue?: string; keyboardType?: string},
  ): Promise<PromptResult>;
  showPicker<T extends {label: string}>(
    title: string,
    message: string | null,
    options: {items: T[]},
  ): Promise<Selection<T>>;
};

export default {
  actionPositive: 'positive' as const,
  prompt: native.prompt,
  showPicker: native.showPicker,
};
