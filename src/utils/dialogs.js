import reactNativeDialogs from '../native/dialogs';
const showNumberPicker = async (
  items,
  title,
  promptTitle,
  custom = (item) => item.value === -1,
) => {
  const {selectedItem} = await reactNativeDialogs.showPicker(title, null, {
    items,
  });
  if (!selectedItem) {
    return;
  }
  if (!custom(selectedItem)) {
    return selectedItem.value;
  }
  const {action, text} = await reactNativeDialogs.prompt(promptTitle, null, {
    keyboardType: 'decimal-pad',
  });
  if (action === reactNativeDialogs.actionPositive) {
    return Number(text);
  }
};
const s = {
  showNumberPicker,
  showTimePicker: function () {
    return showNumberPicker(
      [5, 10, 15, 30]
        .map((value) => ({
          label: `${value} 分钟`,
          value,
        }))
        .concat({
          label: '自定义',
          value: -1,
        }),
      '在以下时间后停止',
      '输入在多少分钟后停止',
    );
  },
  showCacheSizePicker: function () {
    return showNumberPicker(
      [128, 256, 512, 1024]
        .map((value) => ({
          label: `${value} MB`,
          value,
        }))
        .concat({
          label: '自定义大小',
          value: -1,
        }),
      '选择缓存上限',
      '输入缓存上限(MB)',
    );
  },
};
export default s;
