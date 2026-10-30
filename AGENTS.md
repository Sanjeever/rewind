# 倒带 Android 项目约定

- 使用简体中文沟通和维护文档。工作前检查 Git 状态，保留已有改动。
- 业务代码在 `src/`，Metro 图片在 `assets/`，Android 原生源码在 `android/app/src/main/kotlin/`，Android 图标、启动资源和字体在 `android/app/src/main/`。
- 使用 pnpm 11.5.2。React Native 0.88.1、React 19.3.0、CLI 20.2.0 固定精确版本。Node 满足 `^22.13.0 || ^24.3.0 || >=26.0.0`。
- Android 使用 JDK 17、Gradle Wrapper 9.4.1、AGP 9.2.1、Kotlin 2.2.10、NDK 27.1.12297006。保持新架构与 Hermes。工具版本变更先核对官方模板和实际依赖兼容性。
- 应用 ID 保持 `com.kuss.rewind.dev`，Java/Kotlin 包为 `com.kuss.rewind`，JS 注册名为 `rewind`。升级测试保持开发签名，不卸载、不清空数据，不通过改包名规避迁移。
- Windows、macOS 共用 `pnpm start`、`pnpm android`、`pnpm android:build`。使用标准 Metro、React Native Gradle 插件和自动链接。`scripts/android.cjs` 负责跨平台选择 Wrapper，不添加专用 JS 打包、数字模块映射或运行库注入。
- `standalone` 是使用本机开发签名、内置生产模式 JS 的验证构建。正式发布签名由本地配置提供，不把开发签名包称为正式发布。
- SDK 使用 `ANDROID_HOME` 或 `ANDROID_SDK_ROOT`，本机 `android/local.properties` 保持忽略。代码、文档和共享配置不写入本机路径。缓存、构建输出、私钥和凭据不提交。
- 播放器由 Media3 `PlaybackService` 持有。JS 队列保持单一来源，通知控制返回 JS 队列，Media3 播放状态事件更新界面。音频焦点由 Media3 处理，不把内部状态变化再次发成播放指令。文件扫描和公共媒体导出使用 MediaStore，删除其他应用创建的媒体须处理系统确认。
- 旧数据迁移原样复制 `RKStorage/catalystLocalStorage` 的包装值和索引，写入、读回成功后标记完成。保留旧数据库和外部 files 目录下的歌单，不把读取错误转成空数据。歌单保存使用串行写入与原子替换。
- 图片通过普通 `require('...png')` 引用。兼容 ZIP、旧 Java/JNI、自定义模块映射和专用打包脚本已移除，禁止重新引入。业务函数使用明确导入、普通类与 async/await，不恢复全局 Babel 辅助函数或异步状态机。
- 使用 `pnpm test` 检查数据迁移、设置合并、签名摘要和歌词解析。覆盖升级先保留同一应用 ID、开发签名和数据，再检查后续写入与重复启动。全新安装检查使用独立模拟器，不替代覆盖升级。
- `android/gradlew` 保持 LF 与 Git 可执行权限，`gradlew.bat` 使用 CRLF。构建入口不依赖 PowerShell、用户目录或固定盘符。
- 修改后执行相称的测试、打包或运行检查。构建通过、页面打开和完整功能通过分别表述；网络、账号、设备与宿主平台限制如实记录。
- README 保留上游引用、源码来源、倒带公告牌和反馈群链接。不恢复下载安装地址，不提交 APK/AAB、发布元数据、提取转换工具或临时验证材料。
- 分支使用 `main`。按可审查单元做小的本地 Conventional Commit，描述写简短中文。提交前检查暂存 diff，不自动 push、发布或重写历史。
