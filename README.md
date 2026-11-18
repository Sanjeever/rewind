# 倒带 rewind

本项目以倒带 v3.5.0 Android 发布包为基础重建。应用逻辑已整理为 TypeScript/TSX 与 ESM 源码，保留自有 Android 原生能力，供二次开发使用。

应用包含本地音乐播放、队列、歌单、历史、歌词，以及网易云和 QQ 音乐搜索与账号入口。在线音源按当前会话申请，主来源失败后会尝试匹配备用来源，具体边界见[歌曲与搜索约束](docs/architecture.md#歌曲与搜索边界)。评论分词在 Android 本地执行。各平台与账号的验收范围见[验证概况](docs/validation.md)。

上游仓库与源码来源：[KusStar/rewind-apks](https://github.com/KusStar/rewind-apks)

用户网站由本仓库维护，入口见[网站主页](website/pages/index.mdx)、[操作指南](website/pages/tutorial.mdx)和[常见问题](website/pages/questions.mdx)。站点源自 [KusStar/rewind-docs](https://github.com/KusStar/rewind-docs)。

[倒带公告牌](https://t.me/Rewind_News) · [倒带反馈群](https://t.me/Rewind_Group)

## 快速开始

先按[环境与配置来源](docs/development.md#环境与配置来源)准备工具链，再按[日常开发](docs/development.md#日常开发)安装依赖、启动 Metro 并运行 Android 应用。

脱离 Metro 运行见[独立构建](docs/development.md#独立构建)，已有安装的数据保留要求见[覆盖安装与签名](docs/development.md#覆盖安装与签名)。

## 项目结构

| 代码位置                                                               | 职责                                 |
| ---------------------------------------------------------------------- | ------------------------------------ |
| `src/screens/`、`src/navigation/`                                      | 路由页面与导航                       |
| `src/features/`                                                        | 按业务归置的组件与辅助逻辑           |
| `src/components/`                                                      | 跨业务复用的通用 UI                  |
| `src/player/`、`src/services/`、`src/storage/`                         | 播放业务、音乐服务与持久化           |
| `src/native/`、`android/app/src/main/kotlin/`                          | JS 原生接口与 Android 实现           |
| `assets/`、`android/app/src/main/res/`、`android/app/src/main/assets/` | Metro 图片与动画、Android 资源和字体 |

## 开发文档

- [贡献指南](CONTRIBUTING.md)：任务协作、提交评审与文档维护。
- [开发与构建](docs/development.md)：配置来源、运行命令、构建类型、签名与检查方式。
- [架构与兼容约束](docs/architecture.md)：设计原因、播放边界、数据保护与相关代码入口。
- [验证概况](docs/validation.md)：最近验证证据与在线接口观察。
- [问题与续测](docs/tasks.md)：待处理事项与完成条件。
- [Coding Agent 工作约定](AGENTS.md)：任务上下文与执行要求。

## 许可证与贡献

本项目对有权授权的原创贡献采用 GNU General Public License v3.0 only（`GPL-3.0-only`），详见 [LICENSE](LICENSE)。项目由 `open-rewind` 组织维护，各部分版权归相应权利人所有。

从原发布包恢复的代码与资源，其再许可依据仍待确认；本声明不授予这些材料尚未取得的权利。第三方材料保留原有许可，已核实来源与待确认项见 [第三方声明](THIRD_PARTY_NOTICES.md)。整个衍生项目的对外分发仍需先解决上游授权。

提交贡献前请阅读 [贡献指南](CONTRIBUTING.md)。
