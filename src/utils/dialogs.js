const _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var reactNativeDialogs = _interopRequireDefault(require("../native/dialogs"));
var l = async function (items, title, promptTitle, custom = item => item.value === -1) {
    const {
      selectedItem
    } = await reactNativeDialogs.default.showPicker(title, null, {
      items
    });
    if (!selectedItem) return;
    if (!custom(selectedItem)) return selectedItem.value;
    const {
      action,
      text
    } = await reactNativeDialogs.default.prompt(promptTitle, null, {
      keyboardType: 'decimal-pad'
    });
    if (action === reactNativeDialogs.default.actionPositive) return Number(text);
  },
  s = {
    showNumberPicker: l,
    showTimePicker: function () {
      return l([5, 10, 15, 30].map(value => ({
        label: value + ' 分钟',
        value
      })).concat({
        label: '自定义',
        value: -1
      }), '在以下时间后停止', '输入在多少分钟后停止');
    },
    showCacheSizePicker: function () {
      return l([128, 256, 512, 1024].map(value => ({
        label: value + ' MB',
        value
      })).concat({
        label: '自定义大小',
        value: -1
      }), '选择缓存上限', '输入缓存上限(MB)');
    }
  };
exports.default = s;
