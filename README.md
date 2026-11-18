# 倒带

<p align="center">
  <img src="android/app/src/main/res/mipmap-xhdpi/ic_launcher.png" alt="倒带图标">
</p>

本项目以倒带 v3.5.0 Android 发布包为基础重建。应用逻辑已整理为 TypeScript/TSX 与 ESM 源码，保留自有 Android 原生能力，供二次开发使用。

应用支持本地音乐播放、队列、歌单、历史、歌词和本地评论分词，也提供网易云和 QQ 音乐搜索与账号入口。

上游仓库与源码来源：[KusStar/rewind-apks](https://github.com/KusStar/rewind-apks)

用户网站由本仓库维护，入口见[网站主页](https://open-rewind.github.io/)、[操作指南](https://open-rewind.github.io/tutorial/)和[常见问题](https://open-rewind.github.io/questions/)。站点源自 [KusStar/rewind-docs](https://github.com/KusStar/rewind-docs)。

[倒带公告牌](https://t.me/Rewind_News) · [倒带反馈群](https://t.me/Rewind_Group)

## 快速开始

在仓库根目录操作。准备 JDK 17 和 Android SDK，将 SDK 的 `platform-tools` 加入 `PATH`。Node.js 和 pnpm 版本见 [package.json](package.json)，SDK 组件版本见 [Android 构建配置](android/build.gradle)。

启动模拟器，或连接已授权 USB 调试的设备。执行 `adb devices`，确认目标设备状态为 `device`。设备已有倒带且需要保留数据时，先核对[覆盖安装与签名](docs/development.md#覆盖安装与签名)。

在第一个终端安装依赖并启动 Metro：

```sh
pnpm install --frozen-lockfile
pnpm start
```

保持 Metro 运行，在第二个终端进入同一目录：

```sh
pnpm android --no-packager
```

安装成功后，设备会打开倒带并从 Metro 加载界面。

## 参与开发

- 调试设备、打独立包或运行检查，见[开发与构建](docs/development.md)。
- 修改播放、搜索或数据迁移前，先查对应的[架构约束](docs/architecture.md)。
- 认领[待复核问题与续测](docs/tasks.md)，按[贡献指南](CONTRIBUTING.md)提交改动。

## 许可证与贡献

本项目对有权授权的原创贡献采用 GNU General Public License v3.0 only（`GPL-3.0-only`），详见 [LICENSE](LICENSE)。项目由 `open-rewind` 组织维护，各部分版权归相应权利人所有。

从原发布包恢复的代码与资源，其再许可依据仍待确认；本声明不授予这些材料尚未取得的权利。第三方材料保留原有许可，已核实来源与待确认项见 [第三方声明](THIRD_PARTY_NOTICES.md)。整个衍生项目的对外分发仍需先解决上游授权。

提交贡献前请阅读 [贡献指南](CONTRIBUTING.md)。
