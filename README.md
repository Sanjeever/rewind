# 倒带 rewind

倒带 Android 项目，原版发布版本为 3.5.0，包名 `com.kuss.rewind`。

## 工程恢复进度

当前完成四包清单、自有 JavaScript 模块恢复和依赖关系检查，Android 工程正在构建验证。交接目标见 [handoff.md](handoff.md)，开发约定见 [AGENTS.md](AGENTS.md)。

| 项目 | 当前状态 |
| --- | --- |
| 原始发布材料 | 四个 APK 与 output-metadata.json 保持跟踪，禁止修改 |
| JavaScript 与原生依赖 | JS 与原生版本常量均为 RN 0.56.1；AGP 4.2.2；min / target / compile SDK 为 21 / 32 / 32；第三方依赖精确版本待核对 |
| 模块图 | 共 938 个模块，其中 265 个自有模块进入正常源码目录，673 个运行库模块暂用兼容映射；包名映射为识别线索，精确版本待核对 |
| 存储 | 模块 663 使用 react-native-storage 接 AsyncStorage，容量 2048、默认不过期、关闭内存缓存；数据库结构待核对 |
| 源码与 Android 工程 | 自有 JS 模块已恢复，原生源码通过独立 Java 编译；Android 工程构建进行中 |
| 构建、安装、实际运行 | 尚未验证 |
| 播放、歌单、歌词、登录、设置与持久化 | 尚未验证 |

## 当前环境

2026-10-30 在 Windows / PowerShell 中确认 Node.js 22.17.0、pnpm 11.5.2、OpenJDK 17.0.12。当前 PATH 中有 Gradle 9.2.1，但未确认与本项目兼容。项目本地已下载 Gradle 8.7，尚未用于构建。Android SDK 未完成安装。使用本机已有 adb 检查时没有连接设备。项目将使用经过验证的 Gradle Wrapper。

已安装用于清单分析的开发依赖并生成 pnpm 锁文件，包括 Babel parser / traverse / generator / types 7.26.10 与 adm-zip 0.5.16。尚未安装应用运行依赖。

```powershell
pnpm install --frozen-lockfile
pnpm inventory
```

本次安装沿用会话已有代理，通过 pnpm 命令参数传入 `HTTP_PROXY` / `HTTPS_PROXY`，没有写入全局配置。`pnpm inventory` 已执行成功，读取根目录四个原始 APK，生成 `recovery/inventory.json`、`recovery/module-map.json` 和 `.recovery/modules/` 临时模块。安装命令是否需要代理取决于本机网络。

`recovery/inventory.json` 记录每个 APK 及内部文件的大小与 SHA-256。四包 JS 均为 1,808,058 字节，SHA-256 为 `6f47d21b5321aabdd5311fd64c8bf27a25ecfd671ddb4dc68da464e8738ae159`。

当前没有可用的源码构建命令。构建和运行命令将在 Android 工程建立并实际执行后补充。临时提取、分析材料和工具放在被忽略的 `.recovery/`，项目本地 SDK 路径与开发签名不提交。

## JavaScript 源码

入口为 `index.js` 和 `src/App.js`。页面路由位于 `src/navigation/index.js`，主要页面在 `src/screens/`，播放器在 `src/player/`，网络服务在 `src/services/`，存储在 `src/storage/`，原生调用封装在 `src/native/`。尚未确定语义的内部模块使用 `module-编号.js` 命名，后续继续整理。

```powershell
pnpm bundle:android
pnpm check:modules
```

两条命令已执行成功。打包器读取自有源码和 `recovery/module-map.json`，生成 `.recovery/generated/assets/index.android.bundle`。检查覆盖全部 938 个模块依赖、自有源码路径和运行库 factory 一致性，并对照原版执行四组真实歌词解析输入。这些检查尚不能证明 Android 运行效果。

673 个运行库模块暂从原版公共 JavaScript 运行库加载到临时构建目录，包含框架、polyfill、第三方库。自有源码之间使用相对路径；第三方入口使用包名，尚未识别的内部依赖使用 `@runtime/编号`。当前不是标准 Metro 依赖安装流程，精确依赖版本与上游替换仍在进行。React 的实际版本常量为 16.8.3，不依据 RN 默认 peer dependency 推定版本。

`scripts/restore-modules.cjs` 是初次源码结构转换工具，默认拒绝覆盖已有源码。正常修改应用时运行打包命令，避免重新生成并覆盖手工改动。

恢复构建使用本地开发签名，并以独立测试环境或开发包名运行。原版安装与数据兼容性尚未验证。远端服务可用性和账号相关功能待实测。

## 暂停与继续入口

2026-10-30 按用户要求暂停，当前分支 `main`，原有 `master` 与历史保留。下一步先核对 Git 状态，再继续下面工作。

1. 阅读 `recovery/` 两份清单和 `.recovery/modules/295.js`、`309.js`、`663.js`、`770.js`、`801.js`。模块 801 含真实页面路由，770 为播放器主体，313 为存储 key。
2. 本地 JADX 1.5.6 与 Apktool 3.0.3 位于 `.recovery/tools/`。入口、桥接和资源分析材料位于 `.recovery/decompiled/jadx/` 与 `.recovery/decompiled/resources/`。JADX 共报告 24 处错误，不能将所有输出当成可编译源码。`com/modules/` 自有桥接中尚未发现工具失败占位，但仍须逐类恢复和编译核对。
3. 自有原生包包含播放器、媒体库、标签页、列表、加密、音频标签、语言、定时器、唤醒锁、导航栏、启动页等。主入口注册 33 个 package；对应实现、完整桥接清单和依赖版本仍待整理。
4. SDK 安装曾在模拟器文件展开时失败。当前 `.recovery/android-sdk/` 不完整，不可用于构建或运行。平台包与 API 28 镜像下载已暂停，保留部分文件。Gradle 8.7 已展开，构建工具 30.0.3 的实际下载文件名可在 `.recovery/tools/repository.xml` 查到，不能使用无前缀 URL。
5. `.recovery/raw/runtime.jar` 是兼容性分析中间文件，尚未用于构建，不代表已确定工程依赖方案。继续时优先核对正式上游制品与自有补丁。
6. 完成业务模块正常引用、原生工程与资源配置后，再构建、安装并验证源码变更。播放器、登录、外部接口与持久化仍未实测。

## 原版下载

![rewind-version](https://img.shields.io/badge/rewind-v3.5.0-black?style=for-the-badge)
[![倒带公告牌](https://img.shields.io/badge/%E5%80%92%E5%B8%A6%E5%85%AC%E5%91%8A%E7%89%8C-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/Rewind_News)
[![倒带反馈群](https://img.shields.io/badge/%E5%80%92%E5%B8%A6%E5%8F%8D%E9%A6%88%E7%BE%A4-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white&link)](https://t.me/Rewind_Group)

点击下方[链接](#rewind-apks)下载安装包，移动设备选 [ARM](#arm)，其他选 [X86](#x86)

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

