# Handoff: 倒带标准 React Native 工程迁移

## 1. 任务摘要

在 macOS 继续实施完整工程迁移，将当前倒带 Android 兼容工程改为正式依赖 React、React Native，使用 Metro、自动链接和标准 Android 构建流程的可二次开发工程。保留主要页面、播放行为和用户数据，开发环境同时支持 Windows、macOS。

本文件是实施交接。标准工程迁移尚未开始，下一会话应直接检查并实现，持续推进到构建、安装和运行验收，不能停在方案、空工程或依赖安装阶段。

## 2. 背景

- 开发仓库为 <https://github.com/Sanjeever/rewind>，工作分支为 `main`。兼容构建基线为 `71058ed`；交接提交还移除了硬编码云凭据，应优先以当前 `main` 作为行为和实现参照。
- 上游为 <https://github.com/KusStar/rewind-apks>。当前代码基于倒带 v3.5.0 Android 发布包重建，已整理业务模块、自有 Java 桥接与 Android 工程。
- `package.json` 目前只有编译工具依赖。React、React Native 和部分第三方实现来自 `vendor/rewind-runtime-3.5.0.zip`，因此安装新的 npm 包不会自动成为现有运行时依赖。
- 当前能从自有源码构建、运行并观察修改效果，但仍依赖公共 JS 工厂、模块 ID、合并 Java 库和 JNI。需要迁移才能获得正常依赖管理、Metro 调试和持续维护能力。
- 原安装包、发布元数据和临时验证材料已按要求清理。不要恢复这些文件，也不要把原账号、旧电脑、原源码或原签名私钥作为实施前提。
- 交接前发现硬编码腾讯云凭据，已获授权清理未推送历史，保留原有工作单元与中文提交说明。本地 `backup/pre-secret-cleanup-20261030` 保存清理前历史，不推送该备份分支。后续不得重新引入这些凭据或推送清理前提交。

## 3. 目标与范围

### 目标

1. 使用正式 React / React Native 依赖、pnpm 锁文件、Metro、React Native Babel preset、Gradle 插件和自动链接。
2. 将业务源码整理为可读、可修改的正常 JS/JSX 和明确导入，消除运行库提供的全局编译辅助函数及数字模块引用。
3. 迁移 Android 入口、自有原生能力、播放器、存储、资源、导航和实际存在的主要页面。
4. 保留本地歌单、设置、历史、播放队列等数据语义，提供真实的旧数据迁移验证。
5. Windows、macOS 使用统一项目命令开发 Android 应用，支持 Metro 调试、刷新及独立打包运行。
6. 完成后移除兼容运行库、专用模块映射和提取打包流程。README 准确说明环境、命令、验证与限制。

### 不包含

- iOS 应用适配、产品重设计、新增音乐来源或后端服务。
- 强制全量 TypeScript、将所有类组件改为 hooks，或无关业务重构。
- 恢复旧安装包、私钥或发布账号，承诺覆盖安装原发布版本。
- 用假数据、静默降级或空实现替代在线登录、音频播放、歌词、歌单等真实能力。
- 自动发布、推送后续实现提交或改写 Git 历史。后续推送需获得对应授权。

## 4. 技术上下文

| 项目 | 当前兼容基线 | 迁移方向 |
| --- | --- | --- |
| 框架 | React Native 0.56.1 / React 16.8.3 / JavaScriptCore | React Native 0.88.1 / React 19.3.0 / 默认 Hermes 与新架构 |
| JS 构建 | Babel 与自定义模块映射 | Metro、官方 Babel preset、正常包解析 |
| Android | Gradle 6.7.1 / AGP 4.2.2 / JDK 8 | 按锁定版本官方模板，使用 JDK 17 |
| SDK | compile/target 32，min 21，Build Tools 30.0.3 | 官方模板 compile 37、target 36、min 24、Build Tools 37.0.0 |
| 原生工具 | 固定旧 Java/JNI 依赖 | 模板 NDK 27.1.12297006、Kotlin 2.2.0，正式依赖管理 |
| 播放器 | ExoPlayer 2.17.1，旧包名桥接 | AndroidX Media3、媒体会话和后台播放服务 |
| 依赖管理 | pnpm 11.5.2 | 沿用 pnpm，提交精确版本和锁文件 |

以上目标版本是交接时方案。落地先核对对应版本 npm 元数据与官方模板，使用精确版本，不能直接跟随 `latest` 或混搭模板。React Native 0.88.1 的 Node engine 为 `^22.13.0 || ^24.3.0 || >=26.0.0`，选择满足约束的工具链，并同步 README。

最低 Android 版本将从 Android 5.0 提升至 Android 7.0（API 24），Android 5/6 不在本方案支持范围。新架构是目标版本要求，不能通过 `newArchEnabled=false` 继续承载整个旧工程。简单自有模块可在目标版本支持范围内使用互操作机制；需要 Codegen 的模块按实际接口实现。

开发应用 ID 保持 `com.kuss.rewind.dev`，Java 包为 `com.kuss.rewind`，JS 注册名为 `rewind`。不要通过更换应用 ID、清空数据或新建用户目录绕过迁移问题。原版本号为 `3.5.0-dev`，versionCode 为 `5000098`，升级测试需要兼顾版本号与签名。

可查阅的官方资料：

- [React Native 模板](https://github.com/react-native-community/template)：取与目标版本匹配的模板包或标签，核对工具链和 React 版本。
- [开发环境](https://reactnative.dev/docs/set-up-your-environment)、[新架构要求](https://reactnative.dev/blog/2025/10/08/react-native-0.82)。
- [Metro 模块解析](https://metrobundler.dev/docs/resolution/)、[Media3 ExoPlayer](https://developer.android.com/media/media3/exoplayer)。

## 5. 当前实现分析

| 文件或目录 | 说明 |
| --- | --- |
| `package.json`、`pnpm-lock.yaml`、`babel.config.cjs` | 只有 Babel、ZIP/XML 等构建依赖，尚无正式 React/RN 应用依赖 |
| `scripts/bundle.cjs`、`scripts/module-map.json` | 应用源码和公共 JS 工厂组装，共 938 个模块 ID；28 个第三方别名不等于 npm 依赖清单 |
| `scripts/runtime.cjs`、`vendor/rewind-runtime-3.5.0.zip` | 准备公共 Java、JNI、JS、资源；缓存为 `.cache/android-runtime/` |
| `scripts/android.cjs` | 跨平台 Gradle Wrapper 调用；迁移后按实际需要保留或简化 |
| `index.js`、`src/App.js`、`src/bootstrap/` | 入口、初始化与旧全局辅助函数依赖 |
| `src/screens/`、`src/components/`、`src/navigation/index.js` | 约 40 个页面，旧 StackNavigator、旧组件 API |
| `src/player/`、`src/native/audioPlayer.js` | 播放控制、队列、歌词、迷你播放器和原生接口 |
| `src/services/` | 网易云、QQ 等服务接口与歌曲来源逻辑 |
| `src/storage/` | AsyncStorage 包装、数据键、歌单 JSON、设置和播放状态 |
| `src/settings/`、`src/locales/`、`src/theme/` | 默认设置、语言和界面样式 |
| `assets/`、`android/app/src/main/res/` | 应用动画、图片映射、字体及 Android 资源；需接入正常资源管线 |
| `android/app/src/main/java/com/kuss/rewind/` | Android 应用与 Activity 入口，仍继承旧框架类 |
| `android/app/src/main/java/com/modules/` | 19 组自有模块：播放器、媒体扫描、标签、加密、语言、计时等 |
| `android/app/src/main/java/d/e/m/z0/a.java` | 旧框架异常格式兼容补丁，替换旧框架后删除 |
| `android/app/build.gradle`、`android/app/src/main/AndroidManifest.xml` | 当前为本地 Java/JNI 依赖与稳定资源 ID，迁移时重建 |

存储事实：`src/storage/index.js` 使用 `react-native-storage`，`size=2048`、`defaultExpires=null`、`enableCache=false`，后端为旧 RN 核心 `AsyncStorage`。已观察到 Android 数据库 `databases/RKStorage`、表 `catalystLocalStorage(key,value)`，值包含包装层，不能直接当业务 JSON 读写。键以 `src/storage/keys.js` 为准，包含设置、账号、历史、歌单和上次播放信息。

`src/storage/paths.js` 通过运行时 applicationId 定位应用目录。歌单文件在应用外部 files 目录的 `playlist/playlist.json`，音频缓存在 cache 下的 `audio-cache`。现代存储库不会自动完成这些路径、包装层和数据库的兼容。

已完成的兼容基线验证包括 Windows 源码构建，Android 9 / x86_64 安装启动，自有 JS/JSX/JSON 与 Java 修改生效，本地页面、设置持久化、歌单操作、本地音频解码、播放控制与部分后台媒体指令。验证标记和音频测试材料已清理。macOS 尚未实际构建；Windows Git Bash 启动 POSIX Wrapper 不能视为 macOS 验证。

登录选择页、网易云和 QQ 登录表单可进入，未完成真实账号登录。在线搜索、播放、歌单同步和完整歌词流程尚未验证；此前遇到网络无响应、DNS/TCP 超时，不能据此断言服务永久失效。歌词解析和页面打开通过不等于在线歌词通过。真实设备听感、长时间后台稳定性及其他 Android 版本仍需验证。

评论分词接口尚未配置，当前 JS 调用与原生腾讯签名接口都会明确拒绝并报告未配置。不要将其算作已恢复的在线能力，不要把云服务密钥重新内置到客户端。

## 6. 实现方案

按下面顺序实施，每个阶段拆成可审查的小提交。先打通播放器、文件系统和数据迁移，再大规模迁移页面。

1. **核对环境和建立标准工程。** 读取 Git 状态、根目录约定与本文，确定 Mac 为 Intel 或 Apple Silicon。配置满足目标要求的 Node、pnpm、JDK、SDK、NDK 和可用设备。用精确版本官方模板更新 `package.json`、锁文件、Babel、Metro 和 `android/` 构建入口，建立可运行的基础界面，验证 Metro 加载与刷新。旧基线必要时在独立 worktree 中运行，不在一个 APK 混用两套 React/RN。
2. **建立原生能力和存储入口。** 改写 `MainApplication`、`MainActivity` 与 Manifest，迁移 `src/native/` 和 `com/modules/` 的实际调用，移除旧框架类名引用。文件访问使用目标版本可用的正式库，优先评估 `react-native-blob-util`；媒体扫描使用 MediaStore/content URI，并处理目标 SDK 要求的权限。先打通读取、写入、扫描与持久化。
3. **完成真实数据迁移。** `src/storage/index.js` 改为明确导入，评估社区 AsyncStorage 对旧 `RKStorage` 的行为，按实际证据读取旧值、处理包装层并迁移到新后端。保留 `keys.js` 业务语义，迁移设置、用户、历史、队列和歌单文件。写入并读回成功后才能标记迁移完成，不能静默重置或删除旧数据。需要原生读取时在自有 Android 存储模块实现。增加有价值的迁移测试，验证重复启动和幂等性。
4. **迁移播放器。** 以 Media3 实现 `com/modules/audioplayer/` 的播放器与媒体会话服务，接入 `src/native/audioPlayer.js`、`src/player/`。先保持现有 JS 调用语义，必要 API 调整同步所有调用方。覆盖真实音频、播放/暂停、上一首/下一首、进度跳转、队列、循环模式、音频焦点、通知/耳机控制、后台播放、定时关闭、歌词状态。保持单一播放器状态来源，避免 JS 与服务分别维护不一致队列。
5. **整理 JS 与依赖。** 将业务代码逐步恢复为正常导入、类和 async/await，去掉全局 `babelHelpers`、`regeneratorRuntime` 和 `@runtime/<id>`。旧导航迁到 `@react-navigation/native` 与 native-stack；核心 WebView 迁到社区 WebView；旧列表优先使用 FlatList/SectionList，按实际滚动性能再决定额外库。Pager、Slider、Lottie、图标、Cookie、图片裁剪等逐项核对新架构支持并固定版本。资源改为 Metro 支持的正常图片引用。不能安装包后继续实际调用 ZIP 内旧模块。
6. **逐步迁移页面。** 基础组件与导航 → 设置/本地音乐 → 歌单/完整播放器/歌词 → 搜索/服务歌单/登录/其他实际页面。保留路由参数、返回行为和原有界面语义，不夹带重设计。真实网络和账号允许时验证完整流程，遇到限制明确记录并继续本地独立工作。
7. **删除兼容构建。** 能力全部转移后删除 `vendor/rewind-runtime-3.5.0.zip`、`scripts/runtime.cjs`、自定义 `scripts/bundle.cjs`、`scripts/module-map.json`、旧框架补丁及 Gradle 稳定资源 ID/缓存 Java/JNI 注入。删除旧 npm 构建专用依赖。保留有实际用途的跨平台命令，不能保留一条隐式回退到旧运行库的启动路径。
8. **完整验收与文档。** 在实际 macOS 环境构建、安装和验证，条件允许时在 Windows 干净检出构建。检查目标 Android 的存储、通知、前台服务要求。根据宿主 CPU 选择可加速的模拟器：Apple Silicon 使用 ARM64，Intel 使用 x86_64；具备条件时补充物理 ARM64 设备测试，其他组合明确列为待验证。按照新框架实际 ABI 支持配置，不能沿用旧四 ABI 列表或交叉编译结果就宣称全部运行通过。更新 README 与 AGENTS，准确区分已验证和未验证。

最终开发命令应包含 `pnpm start`、`pnpm android`、`pnpm android:build`；明确 Debug 的 Metro 用法，以及无 Metro 时独立运行的打包方式。Release 验证如需本地签名，凭据与密钥保持本地，不依赖原发布签名，不将测试签名构建宣称为正式发布。

## 7. 文件影响范围

### 修改

- `package.json`、`pnpm-lock.yaml`、`babel.config.cjs`、`index.js`。
- `android/` 的 Gradle Wrapper、构建配置、Manifest、应用入口、自有模块与资源。
- `src/bootstrap/`、`src/native/`、`src/storage/`、`src/player/`、`src/navigation/`、组件及页面的直接调用方。
- 必要的服务导入和 Android API 适配；保持现有服务业务含义。
- `README.md`、`AGENTS.md`、`.gitignore`、`.gitattributes` 及仍有用途的跨平台命令。

### 新增

- `metro.config.js` 或官方模板对应文件、必要的标准 RN 配置。
- Media3 播放服务和必要的原生接口、确有需要的 Codegen spec。
- 旧数据迁移实现，以及持久化、队列、歌词等有维护价值的针对性测试。
- 正常应用资源文件；不把自动生成的 bundle、Codegen 或构建输出加入源码。

### 避免修改

- 无关界面设计、音乐服务协议和内容提供方式，不新增后端。
- 原发布材料、Git 历史及全局机器配置。
- 不新增临时验证报告、提取工具、截图、日志或备用工程树。临时材料放入忽略目录或系统临时目录，结束时清理。

## 8. 约束条件

- 每个独立工作单元做小的本地 Conventional Commit，描述使用简短中文。提交前检查暂存 diff，完成对应验证。示例：`build: 建立标准 React Native 工程`、`refactor(storage): 迁移持久化接口`、`feat(player): 接入媒体播放服务`。不要将整个迁移压成一次提交。
- 实施期间持续推进。工具配置、常规兼容问题与排错自行处理；真实阻塞及时说明，并继续不依赖阻塞条件的工作。
- 先查看原始调用再改写。不能为批量转换方便引入大量默认假值、静默 catch、假登录或假播放。
- 不在仓库写入本机绝对路径、盘符、用户名、SDK/JDK 路径。`android/local.properties` 保持忽略；使用本机环境变量和工具标准配置。
- Wrapper 的 POSIX 文件保留 LF 与可执行权限，Windows 使用对应入口。不能用 Windows Git Bash 验证冒充 macOS 实测。
- README 开头保留上游仓库引用和现有源码来源说明，保留[倒带公告牌](https://t.me/Rewind_News)、[倒带反馈群](https://t.me/Rewind_Group)。不恢复原仓库下载安装地址。
- APK/AAB、`output-metadata.json`、私钥、凭据、缓存、第三方生成树和构建输出不提交。
- 项目 AGENTS 中 JDK 8、兼容 ZIP 和模块映射要求描述当前基线。本任务已要求迁移，按阶段更新这些约定，无需因旧规则再次请求迁移许可。
- 未获新授权不自动 push、发布或重写历史，不能强推远端或删除现有分支。

## 9. 验收标准

- [ ] `package.json` 正式依赖 React/RN 与实际使用的第三方包，pnpm 冻结锁文件安装可复现。
- [ ] Metro、标准 Babel、Gradle 插件与自动链接生效，无数字模块映射或 ZIP 运行库依赖。
- [ ] 自有 JS/JSX、原生模块和资源可读可改，正常源码修改 → 重新构建 → 实际 UI/行为变化链路通过；临时验证标记已清理。
- [ ] 真实 macOS 环境完成安装、构建、启动与调试，记录实际 CPU/工具链/设备。Windows 完成相同干净检出验证，或明确列为缺少实机环境的未验收项。
- [ ] Debug 能连接 Metro 刷新；独立打包版本脱离 Metro 可启动，不含测试绕过和隐藏旧运行库回退。
- [ ] 首页、设置、本地音乐、歌单、播放器、歌词、搜索和登录等实际页面的导航与交互通过对应检查。
- [ ] 真实本地音频播放、暂停、切歌、跳转、队列、后台与媒体控制通过；长时间后台和物理设备听感按实际条件记录。
- [ ] 全新安装与相同应用 ID、相同开发签名的旧数据升级均验证。设置、歌单、历史、用户字段、队列和播放状态可持久化，迁移失败可见且不会清空旧数据。
- [ ] 原生层不再引用旧框架、旧 ExoPlayer 的混合包名；目标 SDK 的权限、媒体访问、通知和前台服务行为经过检查。
- [ ] 真实网络/账号允许时验证在线搜索、播放、歌单、歌词和完整登录；外部限制单独列明，不勾选为已通过，不影响继续交付其他可验证部分。
- [ ] 有效的相关测试和构建通过，每个独立工作单元有简短中文 Conventional Commit。
- [ ] README/AGENTS 与实际版本、命令和验证一致，兼容 ZIP 和专用脚本移除，无临时文件、本机路径、安装包或密钥进入提交。

## 10. Agent 注意事项

- 当前工程能运行，但兼容基线通过的检查不能直接计入新框架验收。先取得目标工程的真实运行证据，再逐项替换。
- 合并 Java 库已排除自有 `com/modules/`、`com/kuss/rewind/`，不能将其重新当应用实现使用。新工程中必须由当前自有源码编译。
- 当前原生入口与播放器仍有 `b.*`、`d.e.m.*`、`d.f.a.b.*` 等旧引用。需要替换实际 API，不是补空类让编译通过。
- `src/modules/module-823.js` 由 `src/screens/CommentPage.js` 调用，当前明确拒绝未配置的分词请求；`com/modules/crypto/RNCrypto.java` 的腾讯签名接口同样拒绝。网易云使用的 `weapi` 加密逻辑保留，不能在后续整理时一并删除。
- 曾发现自动命名造成导入绑定被内部变量遮蔽，导致歌单崩溃。转换源码时检查词法绑定和调用语义，避免简单全局替换。
- `src/bootstrap/errors.js` 的原生弹窗已按 `Alert.alert(title, String(error), buttons)` 修复参数类型；迁移后维持有效错误展示。旧异常格式补丁在新框架中应删除，不屏蔽真实错误。
- `src/storage/playlistFiles.js` 等仍可能有旧式漏 return、吞错逻辑。迁移按真实行为检查，不能把现有代码可编译视为数据安全。
- 从原发布应用读取私有沙箱可能受系统隔离和签名限制。使用自己可控制签名的兼容基线构造真实升级测试，不要求原私钥，也不通过修改应用 ID 规避。
- 首轮优先完成正式依赖、Metro、原生播放、文件访问和旧数据迁移，这些决定后续页面迁移是否可用。进度汇报聚焦已确认事实与阻塞，不在骨架阶段结束任务。
