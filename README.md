上游仓库：[KusStar/rewind-apks](https://github.com/KusStar/rewind-apks)

# 倒带 rewind

本项目以倒带 v3.5.0 Android 发布包为基础重建。发布包中的应用逻辑和资源经过模块整理，形成 JavaScript 业务源码与自有 Android 原生能力，供二次开发使用。本文说明开发环境、构建方式、架构取舍与验证范围。

标准 React Native 工程迁移已落地，在线听歌仍未完成可用性验收，具体见[验证记录与未解决问题](#验证记录与未解决问题)。

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
| Kotlin | 2.2.10 |
| Android SDK | Platform 37.0；Build Tools 37.0.0、36.0.0；Platform Tools |
| Android NDK | 27.1.12297006 |
| Android 设备 | API 24 及以上 |

JS 版本与 Node 约束以 [package.json](package.json) 和锁文件为准；Android 版本见 [android/build.gradle](android/build.gradle)、[gradle.properties](android/gradle.properties) 与 [Wrapper 配置](android/gradle/wrapper/gradle-wrapper.properties)。框架与构建入口依据[对应官方模板](https://www.npmjs.com/package/@react-native-community/template/v/0.88.1)建立，AGP 由固定版本的 React Native Gradle 插件提供。Kotlin 与 AsyncStorage 的编译器要求对齐，KSP 由该依赖按 Kotlin 版本匹配；部分原生库使用 AGP 默认的 Build Tools。

设置 `JAVA_HOME` 指向所需 JDK，优先用 `ANDROID_HOME` 指向本机 SDK，并将 SDK 的 `platform-tools` 加入 `PATH`。使用 `ANDROID_SDK_ROOT` 时也须保证 `adb` 在 `PATH` 中，因为当前 React Native CLI 通过 `ANDROID_HOME` 或 `PATH` 定位它。Gradle 还支持本地 `android/local.properties`，该文件保持忽略，不提交机器路径。

pnpm 使用严格依赖布局，根开发依赖中的 Gradle 插件、Codegen 和 Hermes 编译器供构建工具定位，不能按业务 JS 是否导入来判断它们是否多余。

Apple Silicon 使用 ARM64 模拟器，Intel Mac 与 Windows x64 使用 x86_64 模拟器。默认 ABI 由上述 `gradle.properties` 定义；单一设备构建可向 Gradle 传入 `-PreactNativeArchitectures=arm64-v8a` 或 `x86_64`。

## 安装与开发

```sh
pnpm install --frozen-lockfile
pnpm start
```

保持 Metro 运行，在另一终端连接已授权 USB 调试的设备或启动模拟器，然后执行：

```sh
pnpm android --no-packager
```

Debug 构建使用 Metro。应用内开发菜单支持刷新，首页菜单图标长按也可打开开发菜单。Windows、macOS 使用相同 pnpm 命令，[scripts/android.cjs](scripts/android.cjs) 自动选择对应 Gradle Wrapper。单独构建与安装 Debug：

```sh
pnpm android:build
pnpm android:install
```

通过 Gradle 单独安装 Debug 到 USB 真机时，还需将设备端口转发到 Metro，默认端口为 `8081`。单设备可执行 `adb reverse tcp:8081 tcp:8081`，多设备时用 `adb -s` 指定目标；上述 `pnpm android` 流程会尝试自动配置转发。

不依赖 Metro 的本地验证构建：

```sh
pnpm android:build:standalone
pnpm android:install:standalone
```

`standalone` 通过 React Native Gradle 插件打包 JS、图片和 Hermes 字节码，使用本机开发签名，用于验证脱离 Metro 的运行。产物位于 `android/app/build/outputs/apk/standalone/`。当前 `release` 未配置发布签名，`standalone` 也不作为正式发布包；签名配置见 [android/app/build.gradle](android/app/build.gradle)。

应用标识和版本以该构建文件为准。覆盖安装须保留相同应用 ID 与开发签名，并检查 versionCode；更换开发设备时应保留本地签名。原发布包的私钥不在本项目中，现有升级证据来自本工程可控签名的兼容基线，不承诺覆盖安装原发布包。

```sh
pnpm test
pnpm bundle:android
```

单元测试使用 Node 内置测试框架，覆盖[迁移纯逻辑](src/storage/migrate.test.cjs)、[设置合并](src/settings/merge.test.cjs)、[旧字符编码的签名摘要](src/utils/md5.test.cjs)、[歌词时间解析](src/utils/parseLyric.test.cjs)、[歌曲结构](src/services/trackInfo.test.cjs)与[队列和播放顺序](src/player/queue.test.cjs)。迁移测试使用内存后端，不替代 SQLite、原生文件写入、播放器或网络的设备验证。

单独 Metro 包写入 `.cache/metro/`。常规 Android 构建由 Gradle 插件管理打包，无需预先执行 `pnpm bundle:android`。

## 架构与数据兼容

工程范围为 Android 应用，保留已有页面和业务语义，迁移不包含 iOS 适配、产品重设计或新增音乐来源。沿用现有 JS 与类组件，不要求全量改为 TypeScript 或 hooks，避免无关重写扩大行为变化。

- **正式构建与新架构。** 旧兼容包固定打包第三方实现，无法靠安装 npm 依赖替换实际运行代码，因此改用 Metro、正式依赖和自动链接。保持 Hermes 与新架构，最低 Android 版本随目标框架提高，旧 Android 5/6 不在支持范围。自有原生模块保留 JS 接口，通过互操作方式注册，减少同时重写原生能力与业务调用的风险。
- **单一播放队列。** JS 维护队列与业务播放模式，Media3 服务持有当前音频、媒体会话和音频焦点，避免通知与页面各自维护队列导致不同步。关闭时释放媒体资源，由 Activity 正常生命周期卸载界面；提前销毁 ReactHost 曾触发 Fabric Surface 生命周期断言。
- **队列归属。** `App.state.playerInfo` 持有唯一业务队列。`setPlayerData` 接受基于最新队列的更新函数，提交回调获得最终队列，播放控制器在提交后加载歌曲。队列更新回归见 [App 测试](src/App.test.cjs)。
- **播放指令与状态。** `PlayerController` 处理播放指令、队列操作和资源加载，原生 `rewind.playbackState` 通知更新播放状态，不再次调用播放或暂停。切歌、清空和卸载使旧音源请求及准备回调失效；前台播放时每 600 毫秒读取进度，暂停和后台停止界面轮询。通知控制接收明确的操作回调，卸载时解除绑定。控制器回归见 [播放状态与请求竞态测试](src/player/PlayerController.test.cjs)。
- **播放器视图。** `player/index` 连接控制器与视图，`PlayerView` 和 `MiniPlayerView` 接收播放状态、队列、设置和命名操作回调，不读取控制器实例。展开布局直接用 JSX 表达，调整视图无需修改播放命令处理。
- **歌曲结构与身份。** `trackInfo.normalizeTrack` 提供来源、标题、歌手数组、专辑、封面、毫秒时长和 `source` 原始数据，页面展示使用该结构，旧接口与持久化继续使用原始歌曲。队列身份使用来源加歌曲 ID，本地歌曲使用媒体路径；同名歌曲和跨来源相同 ID 不合并。队列选择、插入、删除与播放顺序计算为纯函数，不修改输入歌曲。
- **搜索到播放。** `SearchPage` 保存输入和已提交关键词，`SongSearchResults` 负责结果状态与分页，`services/search` 统一来源响应。关键词或来源改变时丢弃旧请求结果；空结果、请求失败与加载分别展示。搜索通过 `player/commands` 发出播放或队列插入指令，旧页面的 `events.toPlayer` 汇入同一入口。新增逻辑的测试见 [搜索服务](src/services/search.test.cjs)、[结果状态](src/modules/SongSearchResults.test.cjs)与[播放命令](src/player/commands.test.cjs)。组件测试用现有 Babel 转换源码，隔离原生与网络边界，不代替 React 渲染和设备验收。
- **搜索建议。** 建议组件通过 props 接收输入、来源和聚焦状态，内部取消防抖任务并丢弃旧响应；页面不调用建议组件实例。提交搜索沿用串行历史写入，历史清空后旧读取不能恢复已删除记录。回归见 [建议状态测试](src/modules/SearchSuggestions.test.cjs)。
- **保留旧数据格式。** 旧 `RKStorage` 包含业务包装值、索引与未知键，不能按普通业务 JSON 重建。[迁移逻辑](src/storage/migrate.cjs)原样复制并读回校验，成功后标记完成，保留旧数据库。迁移或歌单校验失败时停止启动并显示错误，不能用清空数据、改包名或更换目录规避问题。
- **保留文件位置。** 歌单继续使用同一应用外部 files 目录下的 `playlist/playlist.json`，更新串行写入并原子替换，降低中断写入损坏文件的风险。音频缓存继续使用应用外部 cache 目录中的 `audio-cache`；路径以 [src/storage/paths.js](src/storage/paths.js) 为准。

| 代码位置 | 职责 |
| --- | --- |
| `src/screens/`、`src/components/`、`src/modules/`、`src/navigation/` | 页面、业务组件与导航 |
| `src/player/`、`src/services/`、`src/storage/` | 播放业务、音乐服务与持久化 |
| `src/native/`、`android/app/src/main/kotlin/` | JS 原生接口与 Android 实现 |
| `assets/`、`android/app/src/main/res/`、`android/app/src/main/assets/` | Metro 图片与动画、Android 资源和字体 |

## 验证记录与未解决问题

以下记录来自 2026-10-30 的人工验收，模拟器环境为 macOS Apple M4 与 API 36 ARM64。它们说明已检查的范围，相关行为变更后须重新验证；工程迁移或构建通过不代表全部在线业务可用。

| 项目 | 实际结果 |
| --- | --- |
| 依赖与构建 | 冻结锁文件安装、现有单元测试、生产模式 Metro 打包、默认 ABI 的 Debug 与 standalone 构建通过 |
| 调试与独立运行 | 标准 `pnpm android --no-packager` 完成构建、安装和启动，Debug 连接 Metro 并刷新；关闭 Metro 后 standalone 可启动、导航和播放 |
| 源码到 APK | 临时修改自有 JS 标题与原生版本，重建后在独立包观察到两处变化；标记已移除并重建 |
| 真实覆盖升级 | 在模拟器用兼容基线 `f0026e1` 实际生成设置、歌单、历史、队列和播放进度，再以相同应用 ID、开发签名与 UID 覆盖安装，全程未卸载或清空数据 |
| 全新安装 | 在独立 API 36 模拟器安装同一 standalone 包，完成媒体/通知权限与首次启动流程；重启保留初始化状态，本地 MP3 播放进度正常推进 |
| 数据保护 | 旧 RKStorage 保持字节一致；旧歌单在原路径继续使用。升级后修改设置、通过界面收藏本地音频，重启与后续覆盖安装均保留；生产包遇到损坏歌单会显示启动错误，文件未被空数据覆盖，恢复备份后可启动 |
| 本地播放 | 真实 MP3 解码、播放/暂停、上一首/下一首、进度跳转、两首队列、随机/单曲循环/列表模式、后台前台服务和系统媒体指令通过；一分钟后台定时关闭后媒体会话与服务释放 |
| 文件与缓存 | MediaStore 扫描、音乐标签写入、音频与图片导出、系统删除确认的取消/允许通过；真实 HTTP 音频缓存后关闭测试服务，缓存仍能跳转播放 |
| 页面与在线数据 | 首页、设置、本地音乐、歌单、历史、搜索、登录入口及表单、专辑和歌词页面完成对应检查；网易云真实搜索、专辑、歌手与歌词/翻译返回并显示，未完成账号认证 |
| 实体手机 | Android 13 ARM64 手机完成安装、启动、媒体授权与本地音乐列表展示；用户断开设备前未开始播放测试 |

Windows 构建入口、Wrapper 换行与可执行权限已检查，Windows 干净检出尚未实测。实体机播放与听感、耳机/蓝牙、跨应用音频焦点、长时间后台，以及其他 Android 版本的运行仍未验收。

在线功能仍有未解决项，不能按预期行为或单纯外部限制处理：

- 网易云音源请求在上述验收中返回 `-460`，服务提示网络环境风险。2026-10-31 按项目匿名 Cookie 请求三首搜索结果仍返回 `-460`；不带该 Cookie 的另一次请求返回顶层 `200`，歌曲项为 `-110` 且地址为空。客户端现在保留顶层和歌曲级错误，触发风控的具体条件、更换网络或登录是否能恢复仍未定位。
- QQ 的空 catch 已移除，搜索检查两层业务码，音源检查授权结果并使用返回的有效 CDN 地址，网络请求十五秒超时。2026-10-31 宿主机同名歌曲分别取得授权码 `104003` 和有效地址；后者实际 Range 请求返回 HTTP `206`、`audio/mp4` 和 4096 字节。模拟器对照原请求形式和新请求形式，均为顶层 `0`、搜索模块 `2001`，具体拒绝条件未定位；现在展示错误与重试。这些证据尚不能证明稳定在线播放或真实账号可用。
- 完整认证、真实账号升级、在线收藏与歌单同步均未验收。账号包装值的迁移测试不能替代真实登录，歌词获取和显示也不能替代音频与歌词同步验证。

评论分词服务仍未接入，当前明确返回未配置错误，不能算作已恢复能力。云凭据从客户端移除是安全约束；恢复分词需要另行接入服务，不能重新内置密钥。项目不保存原发布签名、安装包或发布元数据。

音源错误与备用来源回归见 [音源解析](src/player/trackUrl.test.cjs)、[QQ 请求](src/services/qqmusic/http.test.cjs)、[备用匹配](src/services/provider.test.cjs)和[下载备用来源](src/services/download.test.cjs)。这些测试隔离网络，不作为在线验收；原始响应、诊断脚本和设备截图不进入版本库。
