上游仓库：[KusStar/rewind-apks](https://github.com/KusStar/rewind-apks)

# 倒带 rewind

本项目以倒带 v3.5.0 Android 发布包为基础重建。发布包中的应用逻辑和资源经过模块整理，形成当前 JavaScript 业务代码、Java 原生桥接与 Android 工程，供二次开发使用。框架和部分第三方实现沿用与发布包匹配的兼容运行库。

[倒带公告牌](https://t.me/Rewind_News) · [倒带反馈群](https://t.me/Rewind_Group)

## 开发环境

| 工具 | 版本或用途 |
| --- | --- |
| Node.js | 22 |
| pnpm | 11.5.2 |
| JDK 8 | 构建 Android 工程 |
| Android SDK | Platform 32、Build Tools 30.0.3、Platform Tools |
| Gradle / AGP | Wrapper 6.7.1 / 4.2.2 |

配置 `ANDROID_HOME` 或 `ANDROID_SDK_ROOT` 指向本机 Android SDK。项目不提供带本机路径的 `android/local.properties`；Android Studio 生成的本地配置保持忽略。

Windows、macOS 使用同一组 pnpm 命令，脚本自动选择对应的 Gradle Wrapper。将 `JAVA_HOME` 配置为 JDK 8 的安装位置。

Apple Silicon Mac 使用旧版 Android 构建工具时，建议安装 Rosetta 2 并使用 x86_64 JDK 8，保持与当前工具链兼容。

## 安装与构建

在项目根目录安装依赖并构建。

```powershell
pnpm install --frozen-lockfile
pnpm android:build
```

Gradle 自动准备兼容依赖并编译源码。依赖位于 `vendor/rewind-runtime-3.5.0.zip`，缓存解包到 `.cache/android-runtime/`。Android Studio 直接构建也会执行相同的准备步骤。

产物位于 `android/app/build/outputs/apk/debug/app-debug.apk`。开发包名为 `com.kuss.rewind.dev`，版本为 `3.5.0-dev`，可与原版并存。

连接 Android 设备或启动模拟器后安装。

```powershell
pnpm android:install
```

## 代码结构

- `index.js`、`src/App.js`：应用入口。
- `src/screens/`、`src/components/`、`src/navigation/`：页面、组件和导航。
- `src/player/`、`src/services/`、`src/storage/`：播放、网络服务和持久化。
- `src/native/`：JavaScript 原生调用封装。
- `android/app/src/main/java/`：Android 入口、原生模块与兼容补丁。
- `android/app/src/main/res/`、`assets/`：应用资源。
- `scripts/`：跨平台 Gradle 调用、运行库加载、JavaScript 编译与模块映射。
- `vendor/`：固定版本的框架与第三方兼容运行库。

修改 JS、JSX 或 JSON 后直接构建，Gradle 会重新打包源码。新增模块通过相对路径引用，无需手动分配模块 ID。单独生成 JavaScript 包可执行：

```powershell
pnpm bundle:android
```

生成文件位于 `android/app/build/generated/assets/rewind/`。原生代码和资源按 Android 工程方式修改。`scripts/module-map.json` 用于连接业务模块与兼容运行库，应随相关依赖调整维护。

## 当前边界

工程使用 React Native 0.56.1、React 16.8.3 和 JavaScriptCore。JavaScript 通过 Babel 与模块映射打包，尚未接入 Metro 热更新及常规图片 `require` 流程；图片资源在 Android 资源目录维护。

框架、第三方 Java、JNI 和公共 JS 仍依赖兼容运行库，部分精确版本尚未确认。升级依赖时需一并检查原生桥接、资源 ID 和运行时兼容性。

兼容库保存框架和第三方依赖，应用业务代码与原生自有类由当前源码编译。库中不含 APK、应用 DEX、安装清单或签名文件。仓库不再保存发布安装包和发布元数据。

本地功能已在 Android 9 / x86_64 环境运行。在线搜索、播放、歌单同步、歌词和完整登录流程仍需结合可用网络与账号确认。其他 Android 版本、ABI 和物理设备音频表现尚未完整确认。

评论分词服务尚未配置，调用时会明确报错。项目不内置腾讯云凭据。
