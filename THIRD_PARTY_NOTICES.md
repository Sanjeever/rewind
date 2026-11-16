# 第三方声明

本项目由倒带 v3.5.0 Android 发布包重建。项目的 `GPL-3.0-only` 声明适用于有权授权的原创贡献，第三方材料保留原有版权与许可证。各部分版权归相应权利人所有。

以下记录基于 2026-11-16 的仓库文件、已安装直接 JS 运行依赖的许可声明及相关 Android 依赖的 POM 与源码。它不覆盖全部传递依赖，也不构成整个 APK 已完成许可核查的结论。版本以 [package.json](package.json)、[锁文件](pnpm-lock.yaml)、[Android 依赖定义](android/app/build.gradle) 和实际构建解析结果为准。

## 上游代码与资源

| 材料                                                           | 来源与当前状态                                                                                                                                              |
| -------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 从原发布包恢复的应用代码及资源                                 | 上游为 [KusStar/rewind-apks](https://github.com/KusStar/rewind-apks)。核对时公开仓库未见明确允许恢复、修改及按 GPL 再分发的许可；需取得相关权利人的授权依据 |
| 应用图标、图片与动画                                           | 包括 `assets/`、`android/app/src/main/res/` 中沿用的材料。原发布包本身不能证明这些材料可以再许可，需逐项确认来源与适用许可                                  |
| `android/app/src/main/assets/fonts/MaterialCommunityIcons.ttf` | 与当前 `react-native-vector-icons` 包内同名字体内容不同，尚未确认版本、版权及许可证，不能套用 JS 包的 MIT 许可                                              |
| 网易云与 QQ 音乐标识                                           | `assets/images/netease.png`、`assets/images/qqmusic.png` 涉及第三方标识，需确认图片使用依据及适用的品牌规则；项目 GPL 声明不授予第三方商标权                |

上述授权与来源问题仍待解决。DCO 签署、本仓库的许可证文件和元数据不能替代上游授权，也不能追溯证明已有贡献已获许可。

## Gradle Wrapper 与 React Native 模板

`android/gradlew` 与 Gradle Wrapper 保留 Gradle 作者的 Apache-2.0 声明，完整正文见 [LICENSES/Apache-2.0.txt](LICENSES/Apache-2.0.txt)。Gradle 源码与版权资料见 [Gradle](https://github.com/gradle/gradle)。

`android/gradlew.bat` 还保留 React Native 模板的 Meta MIT 声明。其文件头所述根目录 MIT 许可证来自原模板，相关正文保留如下；本项目根目录 [LICENSE](LICENSE) 为 GPLv3，不替代该模板许可。来源见 [React Native](https://github.com/facebook/react-native)。

```text
MIT License

Copyright (c) Meta Platforms, Inc. and affiliates.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 依赖许可

依赖保持各自许可。核对时，直接 JS 运行依赖的 `package.json` 除下列项目外均声明 MIT；这不代表其中附带的字体、图片、原生依赖或其他第三方组件也采用 MIT。

| 直接 JS 运行依赖                                                                                                                                                     | 许可声明                              |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| [lottie-react-native](https://github.com/lottie-react-native/lottie-react-native)                                                                                    | Apache-2.0                            |
| [react-native-popup-menu](https://github.com/instea/react-native-popup-menu)、[react-native-touchable-scale](https://github.com/kohver/react-native-touchable-scale) | ISC                                   |
| [spark-md5](https://github.com/satazor/js-spark-md5)                                                                                                                 | `WTFPL OR MIT`；本项目选择按 MIT 使用 |

开发检查工具 [Oxlint 与 Oxfmt](https://github.com/oxc-project/oxc) 使用 MIT 许可，已核对安装包内的 `LICENSE`；两者作为开发依赖使用。

以下 Android 依赖已核对发布材料中的声明：

| Android 依赖                       | 许可与证据                                                                                                                                                                                                              |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| React Native、Hermes               | MIT；源码见 [React Native](https://github.com/facebook/react-native) 与 [Hermes](https://github.com/facebook/hermes)，仍需保留实际产物附带的第三方声明                                                                  |
| AndroidX Core SplashScreen、Media3 | Apache-2.0；对应版本 POM 声明，源码见 [AndroidX](https://android.googlesource.com/platform/frameworks/support/) 与 [Media3](https://github.com/androidx/media)                                                          |
| HanLP portable                     | Apache-2.0；对应版本 POM 声明，源码见 [HanLP](https://github.com/hankcs/HanLP/tree/1.x)。打包字典与数据仍需核实各自来源及许可                                                                                           |
| jaudiotagger                       | POM 声明 LGPL；[3.0.1 源码包](https://repo.maven.apache.org/maven2/net/jthink/jaudiotagger/3.0.1/jaudiotagger-3.0.1-sources.jar) 中 `AudioFileIO.java` 声明 LGPL-2.1-or-later。分发时需保留相关许可并满足适用的源码义务 |

安装后的 JS 包目录可查各自 `LICENSE`、`NOTICE` 与版权声明；Android 依赖需结合实际解析的 POM、JAR/AAR 和对应源码核查。分发 APK 前，收集实际包含组件的完整许可与声明，覆盖传递依赖和嵌入资源，并按各自许可证提供所需源码。本表不替代这些随附材料。分发方式见 [贡献指南](CONTRIBUTING.md#对外分发)。

## 许可证文本来源

- 根目录 [LICENSE](LICENSE) 原样采用 [GNU GPLv3 英文正文](https://www.gnu.org/licenses/gpl-3.0.txt)。正文末尾的应用示例包含“or later”，本项目的授权选择由 README、包元数据及适用源码声明明确为 `GPL-3.0-only`。
- [LICENSES/Apache-2.0.txt](LICENSES/Apache-2.0.txt) 原样采用 [Apache 官方正文](https://www.apache.org/licenses/LICENSE-2.0.txt)。
- [DCO](DCO) 采用 [Developer Certificate of Origin 1.1](https://developercertificate.org/)，保留原版权及文本。
