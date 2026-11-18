# 倒带 Android 项目约定

协作、提交和贡献授权遵循[贡献指南](CONTRIBUTING.md)。

## 事实来源与上下文入口

核实当前行为时，从[架构约束](docs/architecture.md)的对应主题定位实现与回归，检查断言和 mock 覆盖的边界。

## 工作边界

- 使用简体中文沟通和维护文档。工作前检查 Git 状态，保留已有改动，按任务范围采用简单实现。
- 遵守[架构约束](docs/architecture.md)与[开发指南](docs/development.md)，特别是播放归属、数据迁移、签名和构建要求。
- README 保留上游引用、源码来源、倒带公告牌和反馈群链接。不恢复下载安装地址，不提交 APK/AAB、发布元数据、提取转换工具或临时验证材料。
- 按可审查单元做本地提交，提交前检查暂存 diff。不自动 push、发布或重写历史。

## 文档工作流

- 新建或修改文档，以及涉及接口、行为、配置或设计前提的变更，使用 [doc-writing](.agents/skills/doc-writing/SKILL.md) 核对影响范围。技术事实按当前代码、配置及实际行为核验，同一事实集中维护并通过链接引用。
- 文档完稿后用 [prose-standard](.agents/skills/prose-standard/SKILL.md) 检查表达。正式技术文档另用 [trim-cot-leakage](.agents/skills/trim-cot-leakage/SKILL.md) 检查过程性叙述。

## 交付前检查

围绕本次行为、接口或设计变化检查影响范围。

- 按[开发指南](docs/development.md#检查与验收)选择验证，说明实际结果和未覆盖范围。遗留分歧须有证据与处理说明，重大分歧向用户确认。
- 检查最终 diff，确认改动聚焦，交付物可用，遗留问题有跟踪入口。
