# Handoff: 倒带源码整理与现代 TypeScript、ESM 工程建设

## 1. 任务摘要

在保留现有 Android 应用行为、界面和用户数据的基础上，完成质量检查入口、Unicode 字符串整理、可读源码恢复、现代 TypeScript 与 ESM 迁移，以及已确认问题的修复和验证。

本任务已获执行授权。按模块持续推进全部范围，过程中做小的本地 commit。交付目标覆盖应用源码、测试、工程配置和自有脚本，不能以工具安装成功或少量核心模块迁移完成作为整项完成。

## 2. 背景

项目基于倒带 v3.5.0 Android 发布包重建，已经完成标准 React Native 工程迁移，并整理了部分播放、歌曲身份、搜索与存储逻辑。大量其他文件仍保留编译产物结构，缺少统一 lint、format 和类型检查。

2026-10-31 交接前检查，工作分支为 `main`，HEAD 为 `dc6bfc9`，生成本文件前工作区干净。接手时重新确认实际状态。

该基线中，`src` 有 263 个 `.js`、18 个 `.cjs`，其中 16 个是测试文件；187 个 `.js` 保留 `Object.defineProperty(exports, "__esModule", …)`，165 个直接引用 Babel helper。特征数量用于定位整理范围，不代表相同数量的缺陷。含 `\u` 转义的 JS/CJS 文件共 38 个，三个中文语言表大量使用转义，英文表也有可见标点转义。

前序只读评估实际执行过 `pnpm test --runInBand`，16 个测试文件、47 项测试通过。这是旧基线证据，接手后应重新建立基线。前序评估没有重跑 Android 构建、联网或设备验收。

## 3. 目标与范围

### 目标

1. 建立 ESLint、Prettier、TypeScript 类型检查及统一检查命令，并配置仓库内自动检查。
2. 将语言表及其他源码中的 CJK、可见标点等无必要字符转义还原成 UTF-8 可读文字，保持运行时字符串值一致。
3. 按模块恢复人可维护的源码，使用明确命名、正常控制流、ESM 导入导出和 TS/TSX，建立真实类型契约。
4. 应用业务、页面、组件、语言表和测试迁移至 TypeScript。工程配置与 Node 脚本使用工具正式支持的 ESM 格式；允许必要的 ESM `.js`/`.mjs`，不要求为文件后缀强加配置加载器。
5. 消除项目自有 CJS，包括业务 `.cjs`、全部 `.test.cjs`、`babel.config.cjs`、`jest.config.cjs`、`scripts/android.cjs`，以及现有 `.js` 中的 CommonJS 模块声明与依赖加载。`package.json` 明确声明 `type: module`。
6. 修复已确认的搜索状态、异步生命周期、React 状态修改及旧服务错误处理问题，补充有价值的回归和必要设备验证。
7. 每个可审查单元验证后单独提交，使用简短中文 Conventional Commit，不 push、发布或重写历史。

### 不包含

- 新增产品功能、音乐来源、iOS 支持、UI 重设计、全量改函数组件或更换状态管理方案。
- 无需求支持的架构重写、框架及业务依赖全面升级、引入自定义编译链或测试加载器。
- 改变歌曲持久化格式、数据库结构、存储键、文件路径、应用标识或签名。
- 用新服务恢复评论分词，或绕过第三方服务的授权、认证和风控。
- 承诺外部服务必然恢复；既有在线失败需要调查与真实证据，无法解决时保留准确状态。
- 改写第三方 npm 包、生成的构建产物或 Android Gradle Wrapper 来追求形式上的全仓 ESM。

## 4. 技术上下文

- 工程面向 Android，使用 React Native、React、新架构、Hermes、标准 Metro、React Native Gradle 插件和自动链接。具体版本与环境要求查 `package.json`、锁文件和 Android 配置，不凭交接文件固定版本安装。
- 包管理器使用 pnpm，依赖使用精确版本。JDK、SDK、ABI、构建与签名要求查 `docs/development.md`。
- JS 管业务队列与选曲，Kotlin Media3 服务管理当前音频、媒体会话与音频焦点。播放指令和原生状态通知分开，迟到请求不能恢复旧歌曲。
- 标准 JS 注册入口是 `index.js`。可以保留为最小 ESM 引导入口，实际应用实现迁入 TS/TSX；调整入口需同步 Metro、CLI、打包脚本和 Gradle 调用方。
- 原始歌曲、展示歌曲和多来源身份已有区分。展示结构保留 `source`，旧接口和持久化仍使用原始歌曲。
- 启动先校验歌单并迁移旧 `RKStorage`，迁移保留包装值、索引和未知键。歌单写入串行并原子替换。不可用空数据掩盖读取或校验失败。
- 当前 Jest 使用 RN preset、Babel 转换和模块 mock；许多组件测试直接实例化类并替换 `setState`，不是 React 渲染测试。
- `docs/architecture.md` 当前“沿用 JavaScript 与类组件”是此前工程迁移边界。本任务已授权 TS 与 ESM 迁移，需要同步更新语言和模块系统约束；保留类组件及其他有效架构约束。
- 事实来源依次按相关可执行实现、明确设计约束和验收边界判断，阅读根目录 `AGENTS.md`，不要把文档中的已知失败改成默认支持行为。

## 5. 当前实现分析

下表路径是交接基线，迁移时同步引用、测试发现规则和文档链接。

| 文件或模块 | 现状与处理重点 |
| --- | --- |
| `package.json`、`pnpm-lock.yaml` | 缺少 lint、format、typecheck；未声明 ESM；Android 命令引用 CJS 脚本 |
| `babel.config.cjs`、`jest.config.cjs`、`metro.config.js` | 当前使用 CommonJS；Jest 只发现 `src/**/*.test.cjs`；Metro 通过 `__dirname` 排除 `.cache` |
| `scripts/android.cjs` | 跨平台 Wrapper 启动器，依赖 `__dirname`、`require`，迁移需保留 Windows 分支和退出码 |
| `src/locales/{zh_CN,zh_TW,zh_HK,en_US}.js`、`src/locales/index.js` | 语言表使用 `module.exports`，入口保留 Babel 包装，大量字符不可直接阅读 |
| `src/services/trackFields.js`、`trackInfo.js`、`providers.js` | 已有多来源身份、字段和展示转换，应作为类型契约入口 |
| `src/events/Emitter.js`、`names.js`、`index.js`、`src/player/commands.js` | 事件、播放命令和 payload 目前没有类型约束 |
| `src/App.js`、`src/player/{queue,playOrder,PlayerController,PlayerView}.js` | 已整理部分核心逻辑，保留已有边界与竞态回归，逐步补齐类型 |
| `src/modules/SongSearchResults.js`、`SearchSuggestions.js`、`src/screens/SearchPage.js` | 已有请求失效、来源切换、空状态和错误处理，可作为其他搜索模块的行为参照 |
| `src/modules/{PlaylistSearchResults,AlbumSearchResults,ArtistSearchResults,VideoSearchResults}.js` | 保留编译结构和旧生命周期；逐一检查来源切换、分页、空结果、失败和卸载 |
| `src/screens/Playlist.js`、`src/screens/home/` | 混合可读代码与长构造表达式，涉及在线歌单和账号调用 |
| `src/player/VideoPlayer.js` | 多处直接修改 `this.state` 对象后 `setState`，需独立修复与验证 |
| `src/services/{netease,qqmusic}/` | 新旧请求路径混合；保留外部错误并审查参数、账号与响应契约 |
| `src/screens/{NeteaseLogin,QQMusicLogin,UserManager}.js`、`src/storage/users.js` | 登录、账号与歌单持久化边界，不能以 mock 证明真实账号可用 |
| `src/storage/migrate.cjs`、`src/settings/merge.cjs` | 可读但仍为 CJS；迁移至 TS/ESM，保持数据与默认值合并语义 |
| `src/storage/{index,playlistFiles,paths,users}.js` | 迁移、串行写入、原子替换、账号和路径兼容 |
| `src/native/`、`android/app/src/main/kotlin/com/kuss/rewind/` | JS 桥接需要明确类型；Kotlin 作为真实接口依据 |
| `src/bootstrap/globals.js`、`src/services/logger.js`、`src/native/toast.js` | 全局 `toast`、`log` 隐式依赖应整理为明确导入，并核对初始化顺序 |
| `src/navigation/index.js`、`src/utils/universalNavigator.js` | 导航路径与参数需要类型契约 |
| `src/**/*.test.cjs` | 全部迁移到 TS/ESM；调整 mock、导入时机和隔离方式，保留原断言 |
| `README.md`、`docs/{development,architecture,validation}.md` | 同步命令、文件链接、设计变化及新验收证据，各自保持原职责 |

已确认或需要复核的具体问题：

- `PlaylistSearchResults.js` 的 `render` 在数据为空时始终显示加载动画；请求回调直接追加到当前状态，缺少与歌曲搜索相同的请求失效规则。先补真实空结果、来源切换与迟到响应回归，再修复。
- `VideoPlayer.js` 的 `_onLoadStart`、`_onLoad`、`_onProgress` 等直接修改 state，需改为正确状态更新并检查相关计时和卸载行为。
- `qqmusic/index.js` 的 `disslist`、`subscribe_playlist` 仍有空 catch；`CachePage.js` 也有空 catch。逐条区分业务失败与可选操作，让调用方正确接收、显示或处理错误，避免机械删除后产生未处理拒绝。
- `qqmusic/index.js` 的 `profile` 请求硬编码包含账号、会话字段的 Cookie。查清其用途和现有登录 Cookie 路径，移除无依据的固定身份假设，验证当前账号传递；不要复制凭据到文档、测试或日志。
- `docs/validation.md` 记录网易云音源 `-460`/`-110`、QQ 模拟器搜索 `2001`、真实账号与同步未验收。以上是已记录状态，接手时需复核，不能直接归因为环境或宣称修复。

## 6. 实现方案

### 阶段一：质量检查与 ESM 工具链

1. 重新检查 Git、版本、安装状态与现有测试基线。查阅所选固定版本工具的官方文档，确认 RN preset、Node、ESLint、TypeScript、Jest 与 ESM 的组合支持。
2. 在 `package.json` 添加 `type: module`，配置 `lint`、`lint:fix`、`format`、`format:check`、`typecheck`、`check`。`check` 串行执行 lint、格式检查、类型检查与测试，任一失败返回非零；检查命令不自动修改文件。
3. 新增 ESM ESLint flat config `eslint.config.js`、`.prettierrc.json`、`.prettierignore`、`tsconfig.json`。新增 `.github/workflows/check.yml`，在 push/PR 执行冻结锁文件安装与 `pnpm check`，使用兼容项目要求的固定工具版本，不执行自动修复或发布。
4. 将 Babel、Jest 配置迁到工具正式支持的 ESM 文件，如 `babel.config.js`、`jest.config.js` 或 `.mjs`；`metro.config.js` 使用 ESM。删除被替换的 CJS 配置，同步所有定位与调用方式。遇到兼容问题先查实际版本和官方支持，不直接留下 CJS 例外或自制加载器。
5. 将 `scripts/android.cjs` 替换为 `scripts/android.mjs`，通过标准 ESM 路径 API 定位 Android 目录，保留 Windows/macOS Wrapper 参数和退出码，更新全部 pnpm 命令与文档。
6. 检查工具配置能被真实命令加载，尤其 Node ESM 下的路径处理、pnpm 严格依赖解析、Babel 同步调用与 Jest RN preset。纯配置解析成功不足以证明 Metro、测试和 Android 可用。
7. lint 覆盖最终自有 JS/TS、配置、脚本与测试，区分 RN、Node 和测试环境。Prettier 排除生成物、资源、锁文件及 Wrapper 等不适用内容，不改变 Wrapper 换行和权限。
8. 可按迁移阶段增量收紧，但必须明确暂存债务并在任务结束前清除；不得靠整目录忽略、关闭关键规则或空的 typecheck 伪造通过。全仓格式调整分批单独提交，避免夹带行为修改。

### 阶段二：Unicode 与语言表

1. 优先整理 `src/locales/`，随后处理其他业务源码的相同转义。将 `ABOUT: '\u95dc\u65bc'` 还原为 `ABOUT: '關於'`，中文、日文、韩文及可见符号按实际内容处理。
2. 只改变源码表示，保留 key、运行时字符串值、空格、换行、标点、简繁体和地区用词。翻译纠错另列，不夹在等价转换中。
3. 保留必要的引号、反斜杠、控制字符和不可见字符转义。区分 JS 字符串、正则、嵌套脚本及字面量 `\\uXXXX`；不能全仓按文本无差别替换。
4. 必需批量转换时使用成熟 JS 语法工具，避免手写 JS 解析器；临时转换与对比工具放临时目录，不加入项目。运行前说明范围。
5. 对语言表逐 key 比较转换前后的运行时值；对其他受影响字符串做对应语法和等价核对。核对各语言 key 集合，发现既有缺项单独确认处理，不随意补造翻译。
6. 语言表迁为 TS/ESM，以一个现有语言表导出键类型，并检查其他语言实现相同 key、值类型为 string；保持既有语言选择和回退语义。格式化、语言表模块迁移和文字表示变化尽量分开提交，便于核对。

### 阶段三：按模块恢复源码并迁移 TS

建议顺序如下，每批同时处理直接调用方、测试和失效文档链接：

1. `src/services/trackFields.ts`、`trackInfo.ts`、`providers.ts` 及邻近类型：定义来源、来源内歌曲、展示结构、歌曲身份及时间单位。原始歌曲使用与真实字段对应的联合类型与收窄，保留原始 `source`。
2. `src/events/`、`src/player/{commands,queue,playOrder}.ts`：定义事件到 payload 映射、播放命令联合、队列状态与状态提交回调，避免以任意字符串和任意对象穿透。
3. `src/storage/`、`src/settings/`：包括 `migrate.cjs -> migrate.ts`、`merge.cjs -> merge.ts`；定义存储后端、设置、账号与迁移输入输出。类型整理不改变序列化结果、路径、默认值和数据迁移时序。
4. `src/native/`：对照 Kotlin 声明实际桥接方法、Promise、回调、事件 payload、错误和时间单位。现有桥接结构足够时不额外重建 TurboModule 架构。
5. `src/player/`、`src/App.tsx`：保留队列归属、指令/通知分离、请求失效和视图属性边界；继续类组件写法。清理编译包装和隐式全局，使用正常方法、JSX、async/await 与明确导入。
6. `src/services/`、`src/modules/`、`src/screens/`：逐一整理搜索、歌单、账号、登录及其余业务，随后完成通用组件、工具、主题、导航和弹层。模块命名依据真实职责，不猜测不可确认的原始变量名。
7. `src/**/*.test.cjs -> *.test.ts` 或 `*.test.tsx`：采用 ESM 导入导出，使用目标 Jest ESM 模式支持的 mock 与导入时机，保留已有行为断言。更新测试匹配、TS/TSX 转换与类型检查；不得重新引入自写加载器或以删除测试获得兼容。

TypeScript 配置采用与 RN 官方方案兼容的现代 ESM、模块解析和 JSX 设置，启用 `strict` 与 `noEmit`。按工具使用场景区分 bundler 与 Node 解析规则，不能照抄一套后用断言掩盖解析错误。迁移期可临时使用 `allowJs`，最终自有应用和测试的完整迁移不能依赖关闭 JS 检查而遗漏大量业务。

限制 `any`、宽泛索引签名和不安全断言。外部不可信输入先用 `unknown`，在真实边界收窄或校验；保留现有库自带类型，缺类型的第三方库补最小准确声明，不允许 `declare module '*'` 或无类型模块声明绕过检查。只为当前需要的边界建立类型，不创建万能类型层或新服务抽象。

模块依赖统一 ESM。第三方包内部实现及构建器生成物不属于本项目 CJS 清理范围。Metro 对静态资源的 `require('...png')` 属于资源定位，不能与 CommonJS 业务模块加载混淆；按 RN/Metro 支持方式处理资源，并保留可打包的静态引用。不得仅全局搜索 `require` 后机械替换。

### 阶段四：行为修复、回归与设备验证

行为修复在对应模块整理前后单独提交，可与阶段三交错推进；不能把已知缺陷当作必须保留的等价语义。

1. 为其他搜索结果类型验证并修复加载、空结果、失败、重试、分页重复请求、同词来源切换、迟到响应和卸载；保持原有操作可发现性，错误时有必要反馈。
2. 修复视频组件原地修改 state，验证播放、暂停、进度、拖动、全屏与卸载清理等受影响路径；依据问题补有维护价值的回归。
3. 完成受影响旧服务错误与账号边界，复核调用方，保证错误不会伪装为成功、空数据或永不结束的加载。不增加无依据的默认值、吞错、静默备用或无限重试。
4. 保留现有 47 项基线行为断言，并增加上述缺陷回归。涉及真实渲染或生命周期的问题补有针对性的渲染验证，不能全部用手动替换 `setState` 代替。
5. 在工具和设备可用时执行 Metro、Debug、standalone、模拟器独立运行与覆盖升级。安装前核对目标设备和签名，不卸载或清数据。全新安装使用单独模拟器或独立测试环境。
6. 按实际可用条件验收本地播放、系统媒体操作、后台/前台、搜索多种状态、账号与歌单。设备、账号或网络阻塞不妨碍继续其他独立工作；无法覆盖的项明确记录，不能标记通过。使用现有授权和本机环境，不改全局工具配置或将用户数据置于风险中。
7. 在线请求按 `docs/validation.md` 的已知失败复核；mock 回归只证明客户端行为，不能作为真实账号或在线音源验收。

### 接口、数据库与文档变化

- 内部 JS 接口显式类型化与 ESM 化，必要时调整调用签名并同步全部调用方。UI 行为和对原生的运行时契约保持，明确缺陷修复单独说明。
- 无数据库结构、存储路径、歌曲持久化或应用标识变更计划。发现确实需要改变时，先说明证据与兼容方案，不顺手实施。
- `docs/development.md` 更新命令、ESM/TS 工具链和测试方式；`docs/architecture.md` 更新语言与模块系统选择及迁移后入口；`docs/validation.md` 添加有日期和环境边界的新证据。README 保持入口职责及原有上游链接。

## 7. 文件影响范围

### 修改

- `package.json`、`pnpm-lock.yaml`、`metro.config.js`，以及 Babel/Jest 配置的替代文件。
- `src/` 全部自有应用和测试模块，按上述模块顺序迁移与整理；迁移完成后删除被替换文件并同步扩展名引用。
- `index.js`、Android 命令调用方与 `scripts/` 的必要关联部分。
- `README.md`、`docs/development.md`、`docs/architecture.md`、`docs/validation.md` 中因本次变化失效的内容。

### 新增

- `eslint.config.js`、`.prettierrc.json`、`.prettierignore`、`tsconfig.json`、`.github/workflows/check.yml`。
- `scripts/android.mjs`、ESM Babel/Jest 配置，替代对应 CJS。
- 对应 TS/TSX 模块、靠近领域的必要类型与缺陷回归测试；精准的第三方模块声明仅在确有缺失时新增。

具体配置后缀按正式工具支持确定，避免留下同时生效的新旧配置。除交付必须文件外，不新增迁移台账、长期转换工具或重复文档。

### 避免修改

- 与已确认问题无关的 Kotlin 原生逻辑、资源、权限和原生依赖版本。
- Android 应用标识、签名、存储路径、SDK/ABI、Hermes/新架构选择和 Wrapper 行为。
- 第三方包源码、锁文件中无关依赖、生成物、原有产品交互和文案内容。
- 用户级提示词、技能文件及与本项目无关的本机配置。

## 8. 约束条件

- 遵守根目录 `AGENTS.md` 和已有架构约束，使用简体中文沟通和维护文档。
- 本任务明确授权现代 TypeScript 与 ESM，不能用旧架构文档的 JavaScript 描述拒绝迁移。自有模块、测试、脚本和工具配置不保留 CJS；若确有工具支持阻塞，先调查并尝试正式支持方案，再报告具体事实，不自行降低目标。
- 保留现有应用行为、数据、签名、路径、默认值及媒体生命周期；缺陷修复需说明具体变化并验证。
- 新增开发依赖限于质量工具、准确类型、测试和必要配置支持。必要的工具升级先核对官方兼容性，使用精确版本；不借机升级全部业务依赖。
- 不建立新状态管理、网络框架、统一服务层、编译器或万能类型抽象。不按固定行数拆文件，依据实际职责处理。
- 不在源码、提交、日志或验收文档放凭据、APK/AAB、机器绝对路径、设备截图、测试音频或临时转换材料。
- 小的 commit 以可审查语义为单位。格式化、Unicode 等价还原、源码/类型迁移和行为修复分开；同一原子变更所需配置、调用方和测试可同一提交。
- 在 `main` 上本地提交。每次提交前检查当前 diff、暂存 diff 和对应验证；不暂存用户无关改动，不使用 `git add .` 盲目收集文件，不提交已知破损的中间状态。
- Conventional Commit 示例：`chore(tooling): 建立代码质量检查`、`refactor(locales): 还原可读字符`、`refactor(player): 迁移播放契约至 TypeScript`、`fix(search): 正确结束空歌单搜索`。实际标题按最终变更编写，不把上述阶段硬塞成四个大提交。
- 无需逐个 commit 请求许可，完成一个可用单元后继续后续范围。阶段完成不等于整项完成；遇到外部阻塞时先完成其他独立工作。

## 9. 验收标准

### 源码与工程

- [ ] 自有应用业务、页面、组件、语言表及测试完成 TS/TSX 迁移；剩余 JS/MJS 仅为必要 ESM 入口、配置或 Node 脚本。
- [ ] 项目声明 ESM，自有业务、测试、配置和脚本不存在 `.cjs` 或 CommonJS 模块加载/导出残留；第三方实现与 Metro 资源识别调用单独判断。
- [ ] 自有源码无手工 Babel 互操作 helper、`exports.__esModule` 包装、编译参数展开和长构造表达式等遗留；清理依据真实代码，避免匹配计数替代审查。
- [ ] 歌曲、来源、队列、命令、事件、设置、导航和原生接口具有准确类型，严格类型检查覆盖实际业务与测试，无宽泛跳过措施。
- [ ] CJK 和可见符号可直接阅读搜索，必要转义保留；语言表逐 key 值等价，语言选择与回退保持。
- [ ] `pnpm lint`、`pnpm format:check`、`pnpm typecheck`、`pnpm test --runInBand` 和统一 `pnpm check` 通过。
- [ ] 冻结锁文件安装可复现；自动检查配置实际调用相同检查，退出码正确。未实际在托管 CI 执行时如实说明，不能把本地通过算作远端运行结果。
- [ ] 测试在目标 ESM 工具链下真实运行，发现规则覆盖全部迁移后的测试，原 47 项行为断言保留并有必要新回归。

### 行为与设备

- [ ] 搜索空结果、错误、重试、分页、来源切换与迟到响应相关问题修复，并由对应回归验证。
- [ ] 视频组件不原地修改 React state，受影响的视频交互与清理已验证。
- [ ] 受影响旧服务和账号调用不吞错、伪造成功或使用无依据固定会话，错误反馈符合现有界面约定。
- [ ] `pnpm bundle:android`、`pnpm android:build`、`pnpm android:build:standalone` 在可用环境通过，验证 TS/ESM 工具链实际参与构建。
- [ ] 在可用模拟器或设备查看实际页面并完成受影响业务验证；独立运行、系统媒体控制、后台/前台分别记录结果。
- [ ] 覆盖升级保留设置、账号包装值、歌单、历史、队列和进度，未卸载或清数据；必要的全新安装使用独立环境。
- [ ] 真实在线与账号检查使用实际结果，外部阻塞、未覆盖项目和失败原因均有明确记录。未覆盖项保持未通过状态。

### 交付

- [ ] 开发命令、架构说明、源码/测试链接和配置一致，新验收证据写入现有验证记录，历史证据保持原边界。
- [ ] 已按小的可审查单元完成本地中文 Conventional Commits，最终报告各提交、验证结果、剩余阻塞与未覆盖范围。
- [ ] 已复核最终 diff 和工作区，无临时工具、凭据、机器路径或构建产物混入提交。

## 10. Agent 注意事项

- 不把 `package.json` 加上 `type: module` 当作 ESM 迁移完成。Node 配置加载、Jest mock 时序、RN preset 转换与 Metro/Gradle 加载链都需实际验证。
- 原有 Jest 测试大量使用 `jest.doMock`、`jest.isolateModules` 与 `require`。ESM 静态导入会改变求值和 mock 时机；按目标版本正式能力迁移，不机械替换，也不降低隔离和断言。
- JSX、React 事件、组件 ref、类组件 props/state、RN 样式与原生回调应使用对应版本准确类型，避免 `any` 使迁移只剩后缀变化。
- 旧数据含索引、包装值和未知键。运行时保留数据比把所有旧值强转成新领域模型更重要，不能按新接口重写旧数据。
- Unicode 整理必须比较值，尤其是可见标点、代理项、嵌套 JS 和反斜杠文本；保持简繁体与地区翻译差异。
- 本地开发签名不等于原发布包签名；覆盖验收只能使用签名兼容基线，不能承诺覆盖原 APK。
- 模拟器、实体机、真实账号、干净安装与覆盖升级分别记录。不能从测试通过推导在线可用，也不能从构建通过推导业务通过。
- 工具、账号或设备真实阻塞时说明具体事实，继续独立可做事项。最终区分已完成改动、已验证结果和未验收部分，不用含糊的“全部完成”。
- 接手后先根据当前仓库复核本文件路径和基线，再给出简短执行顺序并开始实现；无需重新讨论已确定的 TS、ESM、Unicode 和小步提交方向。
