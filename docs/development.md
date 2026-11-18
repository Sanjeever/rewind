# 开发与构建

本文说明环境准备、开发命令、构建类型和验证方式。版本与脚本定义以仓库配置为准，设计取舍见[架构约束](architecture.md)，已验证范围见[验证概况](validation.md)。

## 环境与配置来源

### 用户网站

主页与用户手册在 [website/pages](../website/pages/) 维护。站点沿用上游 Next.js 与 Nextra，与根项目使用同一版本的 pnpm，依赖由站点的 [package.json](../website/package.json) 和锁文件独立管理。在仓库根目录执行：

```sh
cd website
pnpm install --frozen-lockfile
pnpm dev
```

访问终端显示的本地地址。用 `pnpm build` 检查生产构建并生成静态站点 `website/out/`。新增页面时同步更新 [页面导航](../website/pages/_meta.json)。

网站改动合入 `main` 后，由[组织主页仓库的发布工作流](https://github.com/open-rewind/open-rewind.github.io/actions/workflows/pages.yml)定时检查并发布，也可在该工作流页面手动触发。线上版本见[已部署的网站提交](https://open-rewind.github.io/website-revision.txt)。

### Android 应用

准备 Node.js、pnpm、JDK 17 和 Android SDK。安装依赖前按下表确认工具链，避免在文档维护第二份版本清单。

| 内容                                                 | 事实来源                                                                                                                                  |
| ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Node 范围、pnpm、JS 依赖与命令                       | [package.json](../package.json)；依赖解析见 [pnpm-lock.yaml](../pnpm-lock.yaml)，安装策略见 [pnpm-workspace.yaml](../pnpm-workspace.yaml) |
| Android SDK、Build Tools、NDK、Kotlin 与最低设备 API | [android/build.gradle](../android/build.gradle)；依赖模块也可能要求额外 Build Tools                                                       |
| Gradle Wrapper                                       | [Wrapper 配置](../android/gradle/wrapper/gradle-wrapper.properties)                                                                       |
| AGP 与 Gradle 插件的 JDK 要求                        | 固定版本的 `@react-native/gradle-plugin`，安装后可查其 `gradle/libs.versions.toml` 与构建文件                                             |
| ABI、新架构、Hermes 与 Gradle 参数                   | [android/gradle.properties](../android/gradle.properties)                                                                                 |
| 应用标识、版本、构建类型与签名                       | [android/app/build.gradle](../android/app/build.gradle)；JS 注册名见 [index.js](../index.js)                                              |
| 权限声明与运行时申请                                 | [AndroidManifest.xml](../android/app/src/main/AndroidManifest.xml)、[权限入口](../src/native/permissions.ts)                              |

设置 `JAVA_HOME` 指向所需 JDK，优先用 `ANDROID_HOME` 指向本机 SDK，并将 SDK 的 `platform-tools` 加入 `PATH`。使用 `ANDROID_SDK_ROOT` 时也须保证 `adb` 在 `PATH` 中，因为 React Native CLI 通过 `ANDROID_HOME` 或 `PATH` 定位它。Gradle 还支持本地 `android/local.properties`，该文件保持忽略，不提交机器路径。

依赖使用精确版本，框架升级按对应官方模板核对兼容性。pnpm 使用严格依赖布局，根开发依赖中的 Gradle 插件、Codegen 和 Hermes 编译器供构建工具定位。Kotlin 需满足原生依赖的编译器要求，AsyncStorage 的 KSP 匹配逻辑由依赖管理。

Apple Silicon 使用 ARM64 模拟器，Intel Mac 与 Windows x64 使用 x86_64 模拟器。单一设备构建可向 `pnpm android:build` 追加 `-PreactNativeArchitectures=arm64-v8a` 或 `-PreactNativeArchitectures=x86_64`；默认 ABI 查 Gradle 参数。

## 日常开发

```sh
pnpm install --frozen-lockfile
pnpm start
```

保持 Metro 运行，在另一终端连接已授权 USB 调试的设备或启动模拟器：

```sh
pnpm android --no-packager
```

Debug 使用 Metro。应用内开发菜单支持刷新，首页菜单图标长按也可打开开发菜单。Windows、macOS 使用相同 pnpm 入口，[Android 脚本](../scripts/android.mjs)选择对应 Gradle Wrapper。单独构建与安装 Debug：

```sh
pnpm android:build
pnpm android:install
```

单独通过 Gradle 安装 Debug 到 USB 真机时，还需将设备端口转发到 Metro，默认端口为 `8081`。单设备执行 `adb reverse tcp:8081 tcp:8081`，多设备时用 `adb -s` 指定目标；`pnpm android` 流程会尝试自动配置转发。

## 独立构建

```sh
pnpm android:build:standalone
pnpm android:install:standalone
```

`standalone` 由 React Native Gradle 插件打包 JS、图片和 Hermes 字节码，使用本机开发签名，供验证脱离 Metro 运行。APK 输出在 `android/app/build/outputs/apk/standalone/`。当前 `release` 未配置发布签名，`standalone` 也不作为正式发布包。

构建入口保留跨平台 Wrapper 调用，不依赖 PowerShell、用户目录或固定盘符。Wrapper 的换行规则见 [.gitattributes](../.gitattributes)，`gradlew` 在 Git 中保留可执行权限。

## 覆盖安装与签名

覆盖安装须保留相同应用 ID 与开发签名，并检查 versionCode；更换开发设备时应保留本地签名。原发布包私钥不在本项目中，现有升级证据来自本工程可控签名的兼容基线，不承诺覆盖安装原发布包。升级验证不卸载、不清空数据，数据兼容要求见[架构约束](architecture.md#数据保护与升级)。

SDK/JDK 本机路径、私钥、凭据、缓存和构建输出不提交。仓库也不保存 APK/AAB、发布元数据、提取转换工具或临时验证材料，忽略规则见 [.gitignore](../.gitignore)。

## 检查与验收

```sh
pnpm check
pnpm bundle:android
```

`pnpm check` 串行执行 Oxlint、Oxfmt、严格类型检查与测试；各项也可通过 `lint`、`format:check`、`typecheck`、`test` 独立运行。`lint:fix` 和 `format` 会修改文件。GitHub Actions 在 push 和 PR 中冻结锁文件安装并执行检查。

Lint 规则、全局变量与豁免范围见 [.oxlintrc.json](../.oxlintrc.json)。TypeScript 文件中交给类型系统负责的规则在该配置中关闭，修改规则时需结合两套类型检查判断覆盖范围。

格式设置与忽略范围见 [.oxfmtrc.json](../.oxfmtrc.json)。编辑器可通过 Oxc 扩展接入同一套 lint 与格式配置。

应用、测试与配置采用 [ESM 工程约束](architecture.md#工程边界)。Babel 同步加载配置依赖项目 Node 范围内的原生 `require(esm)` 能力。配置入口见 [babel.config.js](../babel.config.js) 与 [metro.config.js](../metro.config.js)。

[应用配置](../tsconfig.json)与[测试配置](../tsconfig.test.json)分开检查，避免应用依赖 Jest 或 Node 全局类型。TypeScript 负责检查，Metro/Babel 负责打包。第三方缺失类型的声明与兼容边界需对应实际版本接口，不能用无类型模块声明绕过检查。

测试入口与发现范围见 [jest.config.js](../jest.config.js)。`pnpm test` 通过 Node VM Modules 执行 ESM，Babel 根据调用方保留模块语法；Node 仍会打印实验性 VM Modules 提示。ESM mock 使用 `jest.unstable_mockModule` 后动态导入，隔离使用异步模块隔离，不能照搬 CJS 的 require/mock 提升时序。可参考[命令通道回归](../src/player/commands.test.ts)与[播放器渲染回归](../src/player/VideoPlayer.test.tsx)；测试靠近对应源码，按变更概念查[实现与回归入口](architecture.md#按概念查实现与回归)。

单独 Metro 包写入 `.cache/metro/`；常规 Android 构建由 Gradle 插件管理打包，无需预先执行 `pnpm bundle:android`。

选择能验证本次变化的检查：业务逻辑使用相关回归；依赖、原生或构建变更按影响验证打包和设备运行；纯文档变更核对事实、链接和 diff。内存迁移后端、网络与原生 mock、直接调用组件方法的状态测试，都不能替代 SQLite、文件写入、React 渲染或设备验收。

PR 写明实际执行的检查与结果。设备验收记录代码基线、日期、环境、操作和未覆盖范围，分别说明构建、启动与业务结果。重要验收按[记录方式](validation.md#记录方式)归档，待处理事项更新到[问题与续测](tasks.md)。
