# 倒带 rewind

倒带 Android 项目，原版发布版本为 3.5.0，包名 `com.kuss.rewind`。

## 工程恢复进度

当前已建立可构建运行的兼容基线，正在继续业务验证与依赖整理。交接目标见 [handoff.md](handoff.md)，开发约定见 [AGENTS.md](AGENTS.md)。

| 项目 | 当前状态 |
| --- | --- |
| 原始发布材料 | 四个 APK 与 output-metadata.json 保持跟踪，禁止修改 |
| JavaScript 与原生依赖 | JS 与原生版本常量均为 RN 0.56.1；AGP 4.2.2；min / target / compile SDK 为 21 / 32 / 32；第三方依赖精确版本待核对 |
| 模块图 | 共 938 个模块，其中 265 个自有模块进入正常源码目录，673 个运行库模块暂用兼容映射；包名映射为识别线索，精确版本待核对 |
| 存储 | react-native-storage 接 AsyncStorage，容量 2048、默认不过期、关闭内存缓存；设备数据库为 RKStorage，业务表为 catalystLocalStorage(key, value) |
| 源码与 Android 工程 | 265 个自有 JS 模块、114 份自有 Java 文件与 Gradle Wrapper 已建立 |
| 构建、安装、实际运行 | assembleDebug 成功，API 28 x86_64 模拟器安装启动成功，与原版并存 |
| 源码到 APK | 修改 JS 关于页与原生版本信息、重建安装后，实际显示 3.5.0-dev · 源码验证；临时验证文字已撤回 |
| 业务验证 | 首页、关于、设置、本地媒体列表与本地播放已检查，其余逐项进行 |

## 当前环境

2026-10-30 实际环境为 Windows 11、PowerShell 7、Node.js 22.17.0、pnpm 11.5.2。运行库准备工具使用 OpenJDK 17.0.12，Android 构建使用本机已有 JDK 8u491、AGP 4.2.2 和 Gradle Wrapper 6.7.1。SDK Platform 为 32，Build Tools 为 30.0.3。系统 PATH 中的其他 Gradle 不用于本工程。

运行验证使用 Android Emulator 32.1.15、Google APIs Android 9 / API 28 x86_64 镜像，设备序列号 `emulator-5556`。本机 HAXM 7.6.5 可用。新版 Emulator 37 拒绝 HAXM，因此使用兼容版本。SDK、模拟器和 AVD 位于 `.recovery/`，没有修改主机虚拟化功能。

已安装源码编译和清单分析依赖并生成 pnpm 锁文件，包括 Babel 7.26 系列与 adm-zip 0.5.16。应用运行库通过下述 `prepare:runtime` 准备。

```powershell
pnpm install --frozen-lockfile
pnpm inventory
```

本次安装沿用会话已有代理，通过 pnpm 命令参数传入 `HTTP_PROXY` / `HTTPS_PROXY`，没有写入全局配置。`pnpm inventory` 已执行成功，读取根目录四个原始 APK，生成 `recovery/inventory.json`、`recovery/module-map.json` 和 `.recovery/modules/` 临时模块。安装命令是否需要代理取决于本机网络。

`recovery/inventory.json` 记录每个 APK 及内部文件的大小与 SHA-256。四包 JS 均为 1,808,058 字节，SHA-256 为 `6f47d21b5321aabdd5311fd64c8bf27a25ecfd671ddb4dc68da464e8738ae159`。

临时提取、分析材料和工具放在被忽略的 `.recovery/`，项目本地 SDK 路径与开发签名不提交。

## Android 构建与运行

先安装上节依赖，再准备兼容运行库。准备工具要求 Java 17 可用，首次执行会从上游正式发行地址下载 Apktool 3.0.3 和 dex-tools 2.4。

```powershell
pnpm prepare:runtime
```

此命令已执行成功。它从仓库发布材料准备框架、第三方运行库、资源和四个 ABI 的 JNI 库，输出均在 `.recovery/`。运行库剔除全部 127 个自有类，自有 Java 由当前 `android/app/src/main/java/` 编译。资源名称与资源 ID 映射由准备脚本和 Gradle 处理。

41 份应用图标、布局、主题、字符串和网络配置已放入 `android/app/src/main/res/`，可直接修改后构建。准备脚本会排除运行库中的同名文件和同配置值，保留第三方公共资源。JS 图片注册信息位于 `assets/images/`，应用加载动画位于 `assets/animations/`。当前新增图片按 Android 资源流程维护，打包器尚未提供 Metro 图片导入流程。

以下为本机实际执行成功的构建命令。其他机器需将 `JAVA_HOME` 和 SDK 路径改为实际安装位置，SDK 须包含 Platform 32 和 Build Tools 30.0.3。

```powershell
$env:JAVA_HOME = 'D:\jdks\jdk1.8.0_491'
$env:GRADLE_USER_HOME = Join-Path $PWD '.recovery/gradle-home'
$sdkRoot = Join-Path $PWD '.recovery/android-sdk'
"sdk.dir=$($sdkRoot.Replace('\', '/'))" | Set-Content android/local.properties -Encoding utf8
.\android\gradlew.bat -p android assembleDebug --console=plain
```

产物为 `android/app/build/outputs/apk/debug/app-debug.apk`，包名 `com.kuss.rewind.dev`，版本 `3.5.0-dev`。Gradle 构建自动编译当前 JS 源码。首次 Wrapper 分发包下载在本机代理下曾停滞，随后使用已下载的同版本官方分发包填充本地 Wrapper 缓存；缓存就绪后，上述 Wrapper 命令实际成功。代理参数保存在忽略目录的 Gradle 用户配置中。

```powershell
$adb = Join-Path $sdkRoot 'platform-tools/adb.exe'
& $adb -s emulator-5556 install -r -g android/app/build/outputs/apk/debug/app-debug.apk
& $adb -s emulator-5556 shell am start -n com.kuss.rewind.dev/com.kuss.rewind.MainActivity
```

已在独立模拟器执行安装和启动，原版 `com.kuss.rewind` 仍保留。开发包可通过 `run-as com.kuss.rewind.dev` 检查沙盒。开发构建使用嵌入式 JS 运行库，尚未启用 Metro 热更新。

当前依赖边界为兼容运行库，第三方 Java、JNI 和公共 JS 还未全部替换成正式上游依赖。ExoPlayer 的版本常量已确认 2.17.1，其他精确依赖版本仍待整理。开发 Manifest 保留业务服务、媒体按键、文件提供器和裁剪入口，未启用原版统计初始化组件。四个 JNI ABI 已纳入 APK，目前实际运行验证覆盖 x86_64。

异常栈格式化类有一份源码兼容补丁，未知行号显示 `?`，避免格式化异常覆盖原始 JS 消息。运行库准备时剔除对应二进制类，再由工程编译补丁；不吞掉原始错误。可运行以下检查，使用接口代理覆盖缺失、空值和正常行列号，再结合设备实际页面验证。

```powershell
pwsh -NoProfile -File scripts/check-exceptions.ps1
```

## JavaScript 源码

入口为 `index.js` 和 `src/App.js`。页面路由位于 `src/navigation/index.js`，主要页面在 `src/screens/`，播放器在 `src/player/`，网络服务在 `src/services/`，存储在 `src/storage/`，原生调用封装在 `src/native/`。尚未确定语义的内部模块使用 `module-编号.js` 命名，后续继续整理。

已按实际用途整理 44 个内部模块，包括播放器封面、歌词视图、进度条、播放按钮和队列位置，以及关于页、登录帮助、抽屉与视频播放器。第三方映射已核对触控缩放和 Lottie 桥接；未确认所属包的 LRU 实现继续使用编号，不预设依赖版本。

```powershell
pnpm bundle:android
pnpm check:modules
```

两条命令已执行成功。打包器读取自有源码和 `recovery/module-map.json`，生成 `.recovery/generated/assets/index.android.bundle`。检查先重新编译源码，再核对模块引用、自有源码路径、运行库 factory、四组歌词对照和两套包名的存储路径。

应用源码使用 Babel 7 编译，支持 JSX、ES 模块与 JSON。新增 JS / JSON 文件通过相对路径引用，打包器自动分配新增模块 ID，无需手改模块表。编译目标兼容当前 JSC，未迁移 React Native 版本。新增第三方入口仍须先核对兼容版本和运行库映射。

已临时新增 JSX 组件与 JSON 配置，重新构建安装后，关于页实际显示 `3.5.0-dev · JSX链路验证`，证明新增文件也进入运行 APK。截图在 `.recovery/validation/dev-jsx-proof.png`，临时组件、配置和文字均已撤回。

673 个运行库模块暂从原版公共 JavaScript 运行库加载到临时构建目录，包含框架、polyfill、第三方库。自有源码之间使用相对路径；第三方入口使用包名，尚未识别的内部依赖使用 `@runtime/编号`。当前不是标准 Metro 依赖安装流程，精确依赖版本与上游替换仍在进行。React 的实际版本常量为 16.8.3，不依据 RN 默认 peer dependency 推定版本。

`scripts/restore-modules.cjs` 是初次源码结构转换工具，默认拒绝覆盖已有源码。正常修改应用时运行打包命令，避免重新生成并覆盖手工改动。

导入重命名会检查全部内部作用域，并在转换时重新核对绑定引用数，防止导入组件被同名局部变量遮蔽。该问题曾在空歌单详情触发，修复后已在设备上打开详情和多选页。错误提示也已修正参数类型，保留实际错误文字。

恢复构建使用本地开发签名，并以独立测试环境或开发包名运行。原版安装与数据兼容性尚未验证。远端服务可用性和账号相关功能待实测。

## 验证记录与限制

- 原版与开发包均在 API 28 模拟器启动。原版权限与首次启动对话框已观察，开发包首页、关于、设置、本地音乐列表已检查。
- 源码链路截图位于本机 `.recovery/validation/dev-about-proof.png`，对应页面显示 JS 验证文字和来自当前 BuildConfig 的版本号。截图与临时日志不提交。
- 设置中关闭“自动调整歌单顺序”后强制结束进程，实际 SQLite 快照中 `settings.rawData.autoSetPlaylistOrder.on` 为 false，数据库完整性检查为 ok。
- 本地播放测试使用隔离模拟器内两份明确标记的测试音频，验证真实 MediaStore、解码、AudioTrack 和媒体会话。已观察播放状态、暂停位置和队列中的两首曲目，测试素材不进入业务源码。模拟器采用无窗口、无扬声器模式，尚未验证物理设备听感。
- 歌词解析有源码对照检查，在线歌词、完整账号登录、远端搜索与在线播放仍在实测，不能视为通过。部分内部变量与库类型仍使用短名，精确依赖版本和上游替换尚未完成。

## 原版下载

![rewind-version](https://img.shields.io/badge/rewind-v3.5.0-black?style=for-the-badge)
[![倒带公告牌](https://img.shields.io/badge/%E5%80%92%E5%B8%A6%E5%85%AC%E5%91%8A%E7%89%8C-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/Rewind_News)
[![倒带反馈群](https://img.shields.io/badge/%E5%80%92%E5%B8%A6%E5%8F%8D%E9%A6%88%E7%BE%A4-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white&link)](https://t.me/Rewind_Group)

点击下方[链接](#原版下载)下载安装包，移动设备选 [ARM](#arm)，其他选 [X86](#x86)

> 优先选择 64 位，遇到问题再尝试 32 位

以下链接无法下载请尝试 [备用下载1](https://n56zqzh3ji.feishu.cn/docx/doxcnL8w8MPe7iqmEwSUdZuEcof)

## ARM

[**64 位**](https://github.com/KusStar/rewind-apks/blob/master/app-arm64-v8a-release.apk?raw=true)

[**32 位**](https://github.com/KusStar/rewind-apks/blob/master/app-armeabi-v7a-release.apk?raw=true)

## X86

[**64 位**](https://github.com/KusStar/rewind-apks/blob/master/app-x86_64-release.apk?raw=true)

[**32 位**](https://github.com/KusStar/rewind-apks/blob/master/app-x86-release.apk?raw=true)

## Thanks

[shields](https://github.com/badges/shields)

