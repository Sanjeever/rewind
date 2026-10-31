import Slider from '@react-native-community/slider';
import type {SliderProps} from '@react-native-community/slider';
import type {ComponentType} from 'react';

// 5.1.2 运行时导出 forwardRef；其声明仍继承 RN 旧 View 类。
export default Slider as unknown as ComponentType<Omit<SliderProps, 'ref'>>;
