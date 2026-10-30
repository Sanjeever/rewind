# 倒带 Android 项目约定

- 使用简体中文沟通和维护文档。工作前检查 Git 状态，保留已有改动。
- 业务代码在 `src/`，原生工程在 `android/`，应用资源在 `assets/` 与 `android/app/src/main/res/`。构建脚本和必要模块映射在 `scripts/`。
- 使用 Node.js 和 pnpm。Windows、macOS 共用 `pnpm android:build`、`pnpm android:install`，Android 工程使用 JDK 8。环境要求见 README。
- SDK 通过 `ANDROID_HOME` 或 `ANDROID_SDK_ROOT` 配置。代码、文档和共享配置不写入本机绝对路径；本地工具配置、`.cache/`、构建输出、私钥与凭据不提交。
- 兼容运行库固定在 `vendor/`，由 Gradle 自动准备。应用安装包、发布元数据、APK 提取与转换工具不纳入项目。升级框架或依赖前先核对兼容性。
- 日常开发直接修改源码，Gradle 自动调用 Babel 打包。新增 JS、JSX 和 JSON 模块使用相对路径引用，保留 `scripts/module-map.json` 中现有模块与运行库入口。
- Java 运行库须排除 `com/modules/`、`com/kuss/rewind/` 和异常格式兼容类 `d/e/m/z0/a.class`，由工程源码编译。资源稳定 ID 随开发包名生成，避免破坏原生库中的资源引用。
- `android/gradlew` 保持 LF 换行和 Git 可执行权限，`gradlew.bat` 使用 CRLF。构建入口不依赖 PowerShell、用户目录或固定盘符。
- 修改后执行与改动相称的构建或运行检查。外部接口、账号和设备限制如实说明，不用替代数据宣称功能可用。
- 分支使用 `main`。本地提交采用 Conventional Commits，描述写简短中文；提交前检查暂存 diff，不自动 push、发布或重写历史。
