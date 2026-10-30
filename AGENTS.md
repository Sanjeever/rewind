# 倒带 Android 项目约定

- 使用简体中文沟通和维护文档。目标是可阅读、可修改、可从源码构建运行的工程。
- 开始工作先读取 `handoff.md`、本文件和 Git 状态，保留已有改动。基础分支为 `main`，不重写历史，不自动 push 或发布。
- 根目录四个 `app-*-release.apk` 和 `output-metadata.json` 是原始发布材料，保持内容与跟踪状态不变。
- `.recovery/raw/` 保存临时提取材料，`.recovery/decompiled/` 保存临时分析树，工具放在 `.recovery/tools/`。这些目录不提交。
- `recovery/` 保存可审查的依赖清单、证据索引和模块映射；`src/` 保存自有业务源码；`android/` 保存 Android 工程；`assets/` 保存应用资源。
- 依据包内实际证据确定 React Native、原生桥接、存储和资源关系。先恢复兼容运行基线，避免套用最新模板或增加新业务。
- 第三方源码树、依赖目录、构建输出、本地 SDK 配置、签名私钥和用户凭据不得提交。发现疑似凭据时避免在输出和文档中扩散。
- 使用 PowerShell，Node 包管理器优先 pnpm；必要 Python 操作使用 uv。工具配置优先项目本地目录，不改全局配置。
- 工程命令以 README 中已执行成功的记录为准。未验证命令标明状态，不把构建成功等同于运行成功。
- 对照原版检查真实页面、播放、歌单、歌词、登录、设置和持久化。外部服务和设备限制如实记录，不用假数据、假播放或静默吞错通过验收。
- 必须修改自有源码、重新构建并观察运行变化，验证源码到安装包链路。
- 按独立结果做小步本地 commit，格式为 Conventional Commits，描述使用简短中文。显式暂存本次文件，提交前检查暂存 diff 并执行相应验证。
- 随进展更新中文 README 的环境、依赖、安装构建命令、验证结果和已知限制，不预写成功结论。
- 当前已执行成功的分析命令为 `pnpm inventory`，分析依赖通过 `pnpm install` 安装并锁定。清单记录文件哈希和模块关系，尚不能代替源码构建或功能验证。
- 自有 JS 正常修改后运行 `pnpm bundle:android`，使用 `pnpm check:modules` 核对依赖与歌词解析。`restore-modules.cjs` 用于初次恢复，避免覆盖手工源码。
- `pnpm prepare:runtime` 使用 Java 17 准备本地兼容运行库。Android 构建使用 JDK 8、AGP 4.2.2、Wrapper 6.7.1、Platform 32 和 Build Tools 30.0.3。已验证命令为 `.\android\gradlew.bat -p android assembleDebug --console=plain`，本机环境设置见 README。
- 开发包名为 `com.kuss.rewind.dev`，保留原版 `com.kuss.rewind`。当前模拟器为 API 28 x86_64，序列号 `emulator-5556`。测试账号、音频与数据库快照保持本地，不提交。
- 兼容 Java 运行库必须排除 `com/modules/` 和 `com/kuss/rewind/` 自有类。资源稳定 ID 使用最终开发包名，并作为资源处理任务输入，避免增量构建使用过期 ID。
