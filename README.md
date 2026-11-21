# 回听

<p align="center">
  <img src="android/app/src/main/res/mipmap-xhdpi/ic_launcher.png" alt="回听图标">
</p>

本项目以倒带 v3.5.0 Android 发布包为基础重建。应用逻辑已整理为 TypeScript/TSX 与 ESM 源码，保留自有 Android 原生能力，供二次开发使用。

应用支持本地音乐播放、队列、歌单、历史、歌词和本地评论分词，也提供网易云和 QQ 音乐搜索与账号入口。

上游仓库与源码来源见 [KusStar/rewind-apks](https://github.com/KusStar/rewind-apks)。

用户网站源自 [KusStar/rewind-docs](https://github.com/KusStar/rewind-docs)，提供[操作指南](https://open-rewind.github.io/tutorial/)和[常见问题](https://open-rewind.github.io/questions/)。[网站主页](https://open-rewind.github.io/)

[倒带公告牌](https://t.me/Rewind_News) · [倒带反馈群](https://t.me/Rewind_Group)

## 快速开始

先按[开发指南](docs/development.md#android-应用)准备 Node.js、pnpm、JDK 和 Android SDK。以下命令在仓库根目录执行。

启动模拟器，或连接已授权 USB 调试的设备。执行 `adb devices`，确认目标设备状态为 `device`。更新设备上已有的回听时，先核对[覆盖安装与签名](docs/development.md#覆盖安装与签名)。

在第一个终端安装依赖并启动 Metro。

```sh
pnpm install --frozen-lockfile
pnpm start
```

保持 Metro 运行，在第二个终端构建、安装并打开应用。

```sh
pnpm android --no-packager
```

## 参与开发

- 调试设备、打独立包或运行检查，见[开发与构建](docs/development.md)。
- 修改播放、搜索或数据迁移前，先查对应的[架构约束](docs/architecture.md)。
- 认领[待复核问题与续测](docs/tasks.md)，按[贡献指南](CONTRIBUTING.md)提交改动。

## 许可证与贡献

有权授权的原创贡献采用 `GPL-3.0-only`。从原发布包恢复的代码与资源仍有[上游授权待确认](THIRD_PARTY_NOTICES.md#上游代码与资源)。贡献、签署和分发要求见[贡献指南](CONTRIBUTING.md#贡献授权与版权)。
