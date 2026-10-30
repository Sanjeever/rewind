上游仓库：[KusStar/rewind-apks](https://github.com/KusStar/rewind-apks)

# 倒带 rewind

本项目以倒带 v3.5.0 Android 发布包为基础重建。发布包中的应用逻辑和资源经过模块整理，形成当前 JavaScript 业务代码、Java 原生桥接与 Android 工程，供二次开发使用。框架和部分第三方实现沿用与发布包匹配的兼容运行库。

[倒带公告牌](https://t.me/Rewind_News) · [倒带反馈群](https://t.me/Rewind_Group)

## 开发环境

| 工具 | 版本或用途 |
| --- | --- |
| Node.js | 22 |
| pnpm | 11.5.2 |
| PowerShell | 7，运行依赖准备脚本 |
| JDK 17 | 准备兼容运行库 |
| JDK 8 | 构建 Android 工程 |
| Android SDK | Platform 32、Build Tools 30.0.3、Platform Tools |
| Gradle / AGP | Wrapper 6.7.1 / 4.2.2 |

配置 `ANDROID_HOME` 或 `ANDROID_SDK_ROOT` 指向本机 Android SDK。项目不提供带本机路径的 `android/local.properties`；Android Studio 生成的本地配置保持忽略。

准备依赖与构建使用不同 JDK。依赖准备终端的 `JAVA_HOME` 指向 JDK 17，Android 构建终端的 `JAVA_HOME` 指向 JDK 8。安装路径由本机环境配置。

## 安装与构建

在项目根目录安装依赖，并用 JDK 17 准备运行库。

```powershell
pnpm install --frozen-lockfile
pnpm prepare:runtime
```

首次准备会下载构建工具并从仓库内的 APK 生成兼容依赖，缓存位于 `.cache/`。原始 APK 是构建输入，应保留。

切换到 JDK 8 构建 Android。

```powershell
pnpm android:build
```

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
- `scripts/`：运行库准备、JavaScript 编译与构建必需的模块映射。

修改 JS、JSX 或 JSON 后直接构建，Gradle 会重新打包源码。新增模块通过相对路径引用，无需手动分配模块 ID。单独生成 JavaScript 包可执行：

```powershell
pnpm bundle:android
```

生成文件位于 `android/app/build/generated/assets/rewind/`。原生代码和资源按 Android 工程方式修改。`scripts/module-map.json` 用于连接业务模块与兼容运行库，应随相关依赖调整维护。

## 当前边界

工程使用 React Native 0.56.1、React 16.8.3 和 JavaScriptCore。JavaScript 通过 Babel 与模块映射打包，尚未接入 Metro 热更新及常规图片 `require` 流程；图片资源在 Android 资源目录维护。

框架、第三方 Java、JNI 和公共 JS 仍依赖兼容运行库，部分精确版本尚未确认。升级依赖时需一并检查原生桥接、资源 ID 和运行时兼容性。

本地功能已在 Android 9 / x86_64 环境运行。在线搜索、播放、歌单同步、歌词和完整登录流程仍需结合可用网络与账号确认。其他 Android 版本、ABI 和物理设备音频表现尚未完整确认。
