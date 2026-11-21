# 开发与构建

## 日常开发

首次运行见 [README 的快速开始](../README.md#快速开始)。

Debug 使用 Metro。长按首页菜单图标可打开开发菜单并重新加载应用。Windows 和 macOS 使用相同的命令，由 [Android 脚本](../scripts/android.mjs)选择对应的 Gradle Wrapper。可单独构建和安装 Debug 包。

```sh
pnpm android:build
pnpm android:install
```

单独通过 Gradle 安装 Debug 到 USB 真机时，还需将设备端口转发到 Metro。使用默认端口时执行 `adb reverse tcp:8081 tcp:8081`。连接多台设备时，先用 `adb devices` 查看序列号，再将 `adb -s SERIAL reverse tcp:8081 tcp:8081` 中的 `SERIAL` 替换为目标设备序列号。`pnpm android` 会尝试自动配置转发。

## 独立构建

```sh
pnpm android:build:standalone
pnpm android:install:standalone
```

`standalone` 由 React Native Gradle 插件打包 JS、图片和 Hermes 字节码，使用本机开发签名，供验证脱离 Metro 运行。APK 输出在 `android/app/build/outputs/apk/standalone/`。当前 `release` 未配置发布签名，`standalone` 也不作为正式发布包。

Wrapper 的换行规则见 [.gitattributes](../.gitattributes)。`gradlew` 在 Git 中保留可执行权限。

## 覆盖安装与签名

回听与原版倒带、旧开发包 `com.kuss.rewind.dev` 可并存。旧应用的本地歌单、设置和登录状态保存在各自的私有目录，首次安装回听时需重新登录。

回听版本间覆盖安装须使用相同的应用 ID 和签名，并检查 `versionCode`。更换开发机器时应保留原签名密钥。验收约束见[数据保护与升级](architecture.md#数据保护与升级)。

SDK/JDK 本机路径、私钥、凭据、缓存和构建输出不提交。仓库也不保存 APK/AAB、发布元数据、提取转换工具或临时验证材料，忽略规则见 [.gitignore](../.gitignore)。

## 检查与验收

- 业务逻辑或界面状态改动先跑对应测试，例如 `pnpm test --runInBand src/player/PlayerController.test.ts`。提交前用 `pnpm check` 跑完整检查。
- 修改 Metro、Babel 或资源导入后，用 `pnpm bundle:android` 检查打包。原生依赖或构建配置变更还需构建并启动 Android 应用。
- 涉及账号、系统媒体操作或数据升级时，用相应账号、设备或旧数据复测。已有缺口见[问题与续测](tasks.md)。
- 纯文档改动核对事实、命令、链接和 diff。仓库 Markdown 使用现有 Oxfmt 检查覆盖范围内的格式，例如 `pnpm exec oxfmt README.md docs --check`。网站 MDX 用[网站生产构建](#用户网站)验证。

`pnpm check` 运行应用的静态检查与测试，各项命令见 [package.json](../package.json) 的 `scripts`。`lint:fix` 和 `format` 会修改文件。[CI 工作流](../.github/workflows/check.yml)在 push 和 PR 中执行检查。用户网站的生产构建见[用户网站](#用户网站)。

Lint 规则、全局变量与豁免范围见 [.oxlintrc.json](../.oxlintrc.json)。TypeScript 文件中交给类型系统负责的规则在该配置中关闭，修改规则时需结合两套类型检查判断覆盖范围。

格式设置与忽略范围见 [.oxfmtrc.json](../.oxfmtrc.json)。编辑器可通过 Oxc 扩展接入同一套 lint 与格式配置。

Babel 同步加载 ESM 配置依赖 Node 的 `require(esm)`。配置入口见 [babel.config.js](../babel.config.js) 与 [metro.config.js](../metro.config.js)。

[应用配置](../tsconfig.json)与[测试配置](../tsconfig.test.json)分开检查，避免应用依赖 Jest 或 Node 全局类型。TypeScript 负责检查，Metro/Babel 负责打包。第三方缺失类型的声明与兼容边界需对应实际版本接口，不能用无类型模块声明绕过检查。

测试入口与发现范围见 [jest.config.js](../jest.config.js)。`pnpm test` 通过 Node VM Modules 执行 ESM，Babel 根据调用方保留模块语法；Node 仍会打印实验性 VM Modules 提示。ESM mock 使用 `jest.unstable_mockModule` 后动态导入，隔离使用异步模块隔离，不能照搬 CJS 的 require/mock 提升时序。可参考[命令通道回归](../src/player/commands.test.ts)与[播放器渲染回归](../src/player/VideoPlayer.test.tsx)。测试位于对应源码旁。

单独 Metro 包写入 `.cache/metro/`；常规 Android 构建由 Gradle 插件管理打包，无需预先执行 `pnpm bundle:android`。

内存迁移后端、网络与原生 mock、直接调用组件方法的状态测试，都不能替代 SQLite、文件写入、React 渲染或设备验收。

设备验收分别记录构建、启动与业务结果，按[贡献指南](../CONTRIBUTING.md#文档维护)归档。

## 环境与配置来源

### Android 应用

准备 Node.js、pnpm、JDK 17 和 Android SDK。安装前核对工具链要求。

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

## 用户网站

站点的 [package.json](../website/package.json) 和 [锁文件](../website/pnpm-lock.yaml) 独立管理依赖。在仓库根目录执行以下命令启动本地预览。

```sh
cd website
pnpm install --frozen-lockfile
pnpm dev
```

访问终端显示的本地地址。用 `pnpm build` 检查生产构建并生成静态站点 `website/out/`。新增页面时同步更新 [页面导航](../website/pages/_meta.json)。

网站改动合入 `main` 后，由[组织主页仓库的发布工作流](https://github.com/open-rewind/open-rewind.github.io/actions/workflows/pages.yml)定时检查并发布，也可在该工作流页面手动触发。线上版本见[已部署的网站提交](https://open-rewind.github.io/website-revision.txt)。
