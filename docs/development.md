# 开发与构建

本文说明环境准备、开发命令、构建类型和验证方式。版本与脚本定义以仓库配置为准，设计取舍见[架构约束](architecture.md)，已验证范围见[验证记录](validation.md)。

## 环境与配置来源

准备 Node.js、pnpm、JDK 17 和 Android SDK。安装依赖前按下表确认工具链，避免在文档维护第二份版本清单。

| 内容 | 事实来源 |
| --- | --- |
| Node 范围、pnpm、JS 依赖与命令 | [package.json](../package.json)；依赖解析见 [pnpm-lock.yaml](../pnpm-lock.yaml) |
| Android SDK、Build Tools、NDK、Kotlin 与最低设备 API | [android/build.gradle](../android/build.gradle)；依赖模块也可能要求额外 Build Tools |
| Gradle Wrapper | [Wrapper 配置](../android/gradle/wrapper/gradle-wrapper.properties) |
| AGP 与 Gradle 插件的 JDK 要求 | 固定版本的 `@react-native/gradle-plugin`，安装后可查其 `gradle/libs.versions.toml` 与构建文件 |
| ABI、新架构、Hermes 与 Gradle 参数 | [android/gradle.properties](../android/gradle.properties) |
| 应用标识、版本、构建类型与签名 | [android/app/build.gradle](../android/app/build.gradle)；JS 注册名见 [index.js](../index.js) |
| 权限声明与运行时申请 | [AndroidManifest.xml](../android/app/src/main/AndroidManifest.xml)、[权限入口](../src/native/permissions.js) |

设置 `JAVA_HOME` 指向所需 JDK，优先用 `ANDROID_HOME` 指向本机 SDK，并将 SDK 的 `platform-tools` 加入 `PATH`。使用 `ANDROID_SDK_ROOT` 时也须保证 `adb` 在 `PATH` 中，因为 React Native CLI 通过 `ANDROID_HOME` 或 `PATH` 定位它。Gradle 还支持本地 `android/local.properties`，该文件保持忽略，不提交机器路径。

pnpm 使用严格依赖布局。根开发依赖中的 Gradle 插件、Codegen 和 Hermes 编译器供构建工具定位，不能按业务 JS 是否导入来判断是否多余。Kotlin 需满足原生依赖的编译器要求，AsyncStorage 的 KSP 匹配逻辑由依赖管理。

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

Debug 使用 Metro。应用内开发菜单支持刷新，首页菜单图标长按也可打开开发菜单。Windows、macOS 使用相同 pnpm 入口，[Android 脚本](../scripts/android.cjs)选择对应 Gradle Wrapper。单独构建与安装 Debug：

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
pnpm test
pnpm bundle:android
```

测试使用 Jest 与 React Native preset，发现规则、转换和 mock 配置见 [jest.config.cjs](../jest.config.cjs)。回归测试靠近对应源码，按变更概念查[实现与回归入口](architecture.md#按概念查实现与回归)，不维护固定的测试数量或文件清单。

单独 Metro 包写入 `.cache/metro/`；常规 Android 构建由 Gradle 插件管理打包，无需预先执行 `pnpm bundle:android`。

选择能验证本次变化的检查：业务逻辑使用相关回归；依赖、原生或构建变更按影响验证打包和设备运行；纯文档变更核对事实、链接和 diff。内存迁移后端、网络与原生 mock、直接调用组件方法的状态测试，都不能替代 SQLite、文件写入、React 渲染或设备验收。

构建通过、页面打开与业务通过分别表述。全新安装、覆盖升级、模拟器、实体机和真实账号分别记录环境、日期、操作结果及未覆盖范围。新的验收证据或已知问题状态变化写入[验证记录](validation.md)，保留旧记录的历史含义；不因文档整理而把历史结果算作本轮验证。
