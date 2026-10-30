上游仓库：[KusStar/rewind-apks](https://github.com/KusStar/rewind-apks)

# 倒带 rewind

本项目以倒带 v3.5.0 Android 发布包为基础重建。发布包中的应用逻辑和资源经过模块整理，形成 JavaScript 业务源码与自有 Android 原生能力，供二次开发使用。当前按 [handoff.md](handoff.md) 从兼容工程迁移到正式 React Native 工程。

[倒带公告牌](https://t.me/Rewind_News) · [倒带反馈群](https://t.me/Rewind_Group)

## 开发环境

| 工具 | 锁定版本或要求 |
| --- | --- |
| Node.js | `^22.13.0 || ^24.3.0 || >=26.0.0` |
| pnpm | 11.5.2 |
| React / React Native | 19.3.0 / 0.88.1 |
| React Native CLI | 20.2.0 |
| JDK | 17 |
| Gradle / AGP | Wrapper 9.4.1 / 9.2.1 |
| Kotlin / KSP | 2.2.10 / 2.2.10-2.0.2 |
| Android SDK | Platform 37.0、36；Build Tools 37.0.0、36.0.0；Platform Tools |
| Android NDK | 27.1.12297006 |
| Android 设备 | API 24 及以上 |

框架与构建入口依据 [0.88.1 官方模板](https://www.npmjs.com/package/@react-native-community/template/v/0.88.1)建立。AGP 与依赖实际解析到 Kotlin 2.2.10，项目同步锁定该版本与匹配的 KSP。部分原生依赖还使用 Build Tools 36。应用使用新架构与 Hermes。

设置 `JAVA_HOME` 为 JDK 17，`ANDROID_HOME` 或 `ANDROID_SDK_ROOT` 为本机 SDK 目录，并将 SDK 的 `platform-tools` 加入 `PATH`。Windows 与 macOS 使用相同 pnpm 命令，脚本自动选择 `gradlew.bat` 或 `gradlew`。Android Studio 生成的 `android/local.properties` 保持本地忽略，不提交机器路径。

Apple Silicon 使用 ARM64 模拟器，Intel Mac 与 Windows x64 使用 x86_64 模拟器。当前默认打包 `arm64-v8a`、`x86_64`；单一设备构建可向 Gradle 传入 `-PreactNativeArchitectures=arm64-v8a` 或 `x86_64`。

## 安装与开发

```sh
pnpm install --frozen-lockfile
pnpm start
```

保持 Metro 运行，在另一终端连接设备或启动模拟器，然后执行：

```sh
pnpm android --no-packager
```

Debug 构建使用 Metro。应用内开发菜单支持刷新，首页菜单图标长按也可打开开发菜单。单独构建与安装 Debug：

```sh
pnpm android:build
pnpm android:install
```

不依赖 Metro 的本地验证构建：

```sh
pnpm android:build:standalone
pnpm android:install:standalone
```

`standalone` 通过 React Native Gradle 插件打包 JS、图片和 Hermes 字节码，使用本机开发签名。产物位于 `android/app/build/outputs/apk/standalone/`，不作为正式发布包。`release` 保留正式签名配置入口，凭据与私钥由本地环境管理。

应用 ID 为 `com.kuss.rewind.dev`，当前 versionCode 为 `5000099`。覆盖升级需要保留相同开发签名；更换开发设备时应保留本地签名，不能通过卸载或清空数据代替升级验证。

```sh
pnpm test
pnpm bundle:android
```

测试覆盖旧数据复制、读回校验、迁移幂等性与签名摘要语义。单独 Metro 包写入 `.cache/metro/`；Android 常规构建由 Gradle 插件管理打包，无需预先执行该命令。

## 源码与数据

- `index.js` 在数据迁移成功后加载 `src/App.js`，迁移失败会显示具体错误。
- `src/screens/`、`src/components/`、`src/navigation/` 保存页面、组件和标准导航。`src/modules/` 按业务名称保存列表、搜索和评论组件。
- `src/player/` 保存队列、播放控制与歌词状态；`android/app/src/main/kotlin/com/kuss/rewind/player/` 使用 Media3 媒体服务与系统媒体会话。
- `src/native/` 为原生接口，第三方能力通过正式依赖与自动链接接入。媒体扫描返回 content URI，公共音乐通过 MediaStore 导出。
- `src/storage/` 保留设置、用户、历史和上次播放信息的业务键。迁移将旧 `RKStorage` 包装值和索引原样写入独立存储，逐项读回成功后记录完成状态，保留原数据库。
- 歌单继续位于同一应用外部 files 目录下的 `playlist/playlist.json`，写入按顺序执行并原子替换。音频缓存继续使用应用外部 cache 目录中的 `audio-cache`。
- `assets/` 保存普通 Metro 图片与动画；Android 图标、启动动画、字体保留在原生资源目录。资源来源沿用原发布包的重建说明。

## 验证进度

迁移仍在验收中，尚未将新框架构建与设备运行标记为全部通过。

当前 macOS 环境为 Apple Silicon、Node 26.11.0、pnpm 11.5.2、JDK 17.0.17。已准备 API 36 ARM64 模拟器；冻结锁文件安装、Debug/生产模式 Metro 打包、数据迁移与摘要单元测试通过，正式原生依赖及自有 Kotlin 源码已进入构建检查。

兼容基线已在该模拟器构建、安装并实际播放本地音频，通过界面生成设置、歌单、历史、队列和进度，用于后续相同应用 ID、相同开发签名的覆盖升级。新框架的播放、页面、迁移读回、Metro 刷新与独立运行正在逐项验证，旧版结果不计入新版验收。

Windows 干净检出构建、物理设备听感、长时间后台播放和其他 Android 版本尚未实机验证。真实账号登录、在线播放、歌单同步和完整在线歌词需要可用网络与账号；不以表单打开或测试数据代替完整验证。

评论分词服务尚未配置，调用会明确报错。项目不内置腾讯云凭据，也不保存原发布签名、安装包或发布元数据。
