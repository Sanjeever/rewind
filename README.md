# 倒带 rewind

倒带 Android 项目，原版发布版本为 3.5.0，包名 `com.kuss.rewind`。

## 工程恢复进度

当前完成仓库检查和项目约定，源码工程尚未建立。后续依次核对发布材料、模块与依赖、重建 Android 工程，再执行构建与运行验证。交接目标见 [handoff.md](handoff.md)，开发约定见 [AGENTS.md](AGENTS.md)。

| 项目 | 当前状态 |
| --- | --- |
| 原始发布材料 | 四个 APK 与 output-metadata.json 保持跟踪，禁止修改 |
| JavaScript 与原生依赖 | 待核对，RN 0.56.1 为已有线索 |
| 源码与 Android 工程 | 待建立 |
| 构建、安装、实际运行 | 尚未验证 |
| 播放、歌单、歌词、登录、设置与持久化 | 尚未验证 |

## 当前环境

2026-10-30 在 Windows / PowerShell 中确认 Node.js 22.17.0、pnpm 11.5.2、OpenJDK 17.0.12。当前 PATH 中有 Gradle 9.2.1，但未确认与本项目兼容。Android SDK 与运行设备仍待检查。项目将使用经过验证的 Gradle Wrapper。

依赖安装、构建和运行命令将在工程建立并实际执行后补充。当前没有可用的源码构建命令。临时提取、分析材料和工具放在被忽略的 `.recovery/`，项目本地 SDK 路径与开发签名不提交。

恢复构建使用本地开发签名，并以独立测试环境或开发包名运行。原版安装与数据兼容性尚未验证。远端服务可用性和账号相关功能待实测。

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

