# 倒带 rewind

本项目以倒带 v3.5.0 Android 发布包为基础重建。应用逻辑已整理为 TypeScript/TSX 与 ESM 源码，保留自有 Android 原生能力，供二次开发使用。

应用包含本地音乐播放、队列、歌单、历史、歌词，以及网易云和 QQ 音乐搜索与账号入口。标准 React Native 工程迁移已落地，在线听歌仍未完成可用性验收，已知失败与检查范围见[验证记录](docs/validation.md)。

上游仓库与源码来源：[KusStar/rewind-apks](https://github.com/KusStar/rewind-apks)

[倒带公告牌](https://t.me/Rewind_News) · [倒带反馈群](https://t.me/Rewind_Group)

## 快速开始

按[开发指南](docs/development.md#环境与配置来源)准备 Node.js、pnpm、JDK 和 Android SDK，再执行：

```sh
pnpm install --frozen-lockfile
pnpm start
```

保持 Metro 运行，连接已授权 USB 调试的 Android 设备或启动模拟器，在另一终端执行：

```sh
pnpm android --no-packager
```

脱离 Metro 的构建、签名与覆盖安装、单元测试和设备验收见[开发指南](docs/development.md)。

## 项目结构

| 代码位置                                                               | 职责                                 |
| ---------------------------------------------------------------------- | ------------------------------------ |
| `src/screens/`、`src/components/`、`src/modules/`、`src/navigation/`   | 页面、业务组件与导航                 |
| `src/player/`、`src/services/`、`src/storage/`                         | 播放业务、音乐服务与持久化           |
| `src/native/`、`android/app/src/main/kotlin/`                          | JS 原生接口与 Android 实现           |
| `assets/`、`android/app/src/main/res/`、`android/app/src/main/assets/` | Metro 图片与动画、Android 资源和字体 |

## 开发文档

- [开发与构建](docs/development.md)：配置来源、运行命令、构建类型、签名与检查方式。
- [架构与兼容约束](docs/architecture.md)：设计原因、播放边界、数据保护与相关代码入口。
- [验证记录与未解决问题](docs/validation.md)：历史验收证据、未覆盖范围与在线失败。
- [Coding Agent 工作约定](AGENTS.md)：事实来源、变更影响分析与完成标准。
