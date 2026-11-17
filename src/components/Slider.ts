import Slider from '@react-native-community/slider';
import type {SliderProps} from '@react-native-community/slider';
import type {ComponentType} from 'react';

// 上游运行时导出 forwardRef，类型却声明为类组件；保留属性类型并排除不匹配的 ref。
export default Slider as unknown as ComponentType<Omit<SliderProps, 'ref'>>;
