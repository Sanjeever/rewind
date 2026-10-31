import 'react';
import * as ReactNative from 'react-native';
import * as reactNativePopupMenu from 'react-native-popup-menu';
import * as components from '../../components/index';
import icons from '../../theme/icons';
const DComponent = function ({
  onWebview,
  onOpenUrl,
  onCopy,
  onShare,
  followed,
  onLike,
}: {
  onWebview(): void;
  onOpenUrl(): void;
  onCopy(): void;
  onShare(): void;
  followed: boolean;
  onLike(): void;
}) {
  return (
    <reactNativePopupMenu.Menu
      style={{
        position: 'absolute',
      }}
    >
      <reactNativePopupMenu.MenuTrigger
        customStyles={{
          triggerWrapper: {
            alignItems: 'center',
            justifyContent: 'center',
          },
          TriggerTouchableComponent: ReactNative.TouchableOpacity,
        }}
      >
        <components.IconButton name={icons.DOTS_VERTICAL} size={25} disabled />
      </reactNativePopupMenu.MenuTrigger>
      <reactNativePopupMenu.MenuOptions
        optionsContainerStyle={{
          elevation: 0,
          borderRadius: 16,
          flex: 0,
          width: 'auto',
          marginTop: 32,
        }}
        customStyles={{
          optionsWrapper: {
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            borderWidth: 1,
            borderColor: '#fff',
            borderRadius: 16,
            padding: 8,
            flex: 0,
            justifyContent: 'center',
            alignItems: 'center',
          },
          OptionTouchableComponent: ReactNative.TouchableOpacity,
        }}
      >
        <reactNativePopupMenu.MenuOption onSelect={onLike}>
          <components.Icon
            name={followed ? icons.HEART : icons.HEART_OUTLINE}
            style={{
              margin: 2,
            }}
            size={25}
          />
        </reactNativePopupMenu.MenuOption>
        <reactNativePopupMenu.MenuOption onSelect={onCopy}>
          <components.Icon
            name={icons.CONTENT_COPY}
            style={{
              margin: 2,
            }}
            size={23}
          />
        </reactNativePopupMenu.MenuOption>
        <reactNativePopupMenu.MenuOption onSelect={onOpenUrl}>
          <components.Icon
            name={icons.LINK_VARIANT}
            style={{
              margin: 2,
            }}
            size={25}
          />
        </reactNativePopupMenu.MenuOption>
        <reactNativePopupMenu.MenuOption onSelect={onWebview}>
          <components.Icon
            name={icons.WEB}
            style={{
              margin: 2,
            }}
            size={25}
          />
        </reactNativePopupMenu.MenuOption>
        <reactNativePopupMenu.MenuOption onSelect={onShare}>
          <components.Icon
            name={icons.SHARE_VARIANT_OUTLINE}
            style={{
              margin: 2,
            }}
            size={25}
          />
        </reactNativePopupMenu.MenuOption>
      </reactNativePopupMenu.MenuOptions>
    </reactNativePopupMenu.Menu>
  );
};
export default DComponent;
