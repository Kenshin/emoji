<p align="center"><img src="https://i.imgur.com/6ExcDl9.png"/></p>
<h1 align="center">+Emoji</h1>
<p align="center">一个基于 Chrome 简单、可靠、纯粹、中文语义化的 Emoji 扩展</p>

***

### 名字：
`+Emoji` _灵感来源于 `文字 + Emoji` 之意_

### 下载：
https://github.com/Kenshin/emoji/releases

### 截图:

**独立窗口**  
![image](https://user-images.githubusercontent.com/31840739/30678148-df47e6c4-9e55-11e7-80cc-984c6bf8ee5b.png)

**语义化**  
<img src="https://i.imgur.com/c4IhA0Y.gif" />

**Popup 窗口**  
![image](https://user-images.githubusercontent.com/31840739/30730829-7038822c-9f2f-11e7-966a-10655f8a1e7f.png)

**插入全部**  
<img src="https://i.imgur.com/QLgzf4B.gif" />

**通过关键字插入**  
<img src="https://i.imgur.com/vBtKQke.gif" />

### 功能：

- 使用了最基本的 emoji 集合，支持任何 App；  
_均不会出现乱码情况_

- 支持关键字（中/英文）查询匹配 emoji；  
  > 呼出关键字 <:: / ：：> <关键字 / 空格> <空格>  
  > 例如：
  > - `::gr　`   // 查询关键字 gr 为内容的 emoji
  > - `::　　`    // 查询全部 emoji
  > - `：：笑　` // 查询中文语义
  > - `：：　　`  // 查询全部 emoji

- 复制到剪切板并支持多个复制；

- 支持快捷键呼出；  
  _默认快捷键 <kbd>command / ctrl + Shift + Y</kbd>_

- 可作为独立窗口存在；

- 快捷键插入后，光标仍处于输入框中；

- 全部的 emoji 使用了 Google Android 7.0

### 下一步：

- [ ] 重构代码；

- [ ] 定制化；

### 附一段使用视频：

- [常规操作](https://i.imgur.com/XYTpirX.gif)

- [语义化插入](https://i.imgur.com/GCPgNrt.gif)

### 已知问题：

- iFrame 无法使用  `dropdown` 模式;

- 非标准 `<input> / <textarea>` 类标签无法使用快捷键 `::  ` 呼出；

- 当为 `window` 独立使用状态时，插入功能失效；

### 感谢：

> 希望有开源代码可以利用一下，结果找到了如下三个：

- https://github.com/Janson-Leung/Emoji-Extension-for-Chrome  

- https://github.com/locomojis/Chromoji

- https://github.com/dofy/apple-emoji-dict

> **`+Emoji` 是在 [Emoji-Extension-for-Chrome](https://github.com/Janson-Leung/Emoji-Extension-for-Chrome) 的基础上开发的；中文语义字典由 [apple-emoji-dict](https://github.com/dofy/apple-emoji-dict) 提供来源。** _（ +Emoji 正式版发布后，我会在显著位置注明上述开源地址及作者）_

### 简悦的诞生离不开它们：
- Emoji 来源于 [Google Android 7.0](https://github.com/googlei18n/noto-emoji)
- LOGO 来源于 [ShareIcon](https://www.shareicon.net/wink-interface-faces-emoji-ideogram-tongue-feelings-emoticons-smileys-798496)
- [Node.js](https://nodejs.org/) · [NPM](https://www.npmjs.com)
- [Webpack](https://webpack.github.io/)
- 咖啡 · 网易音乐 · Google Chrome · rMBP

### 许可：
[![license-badge]][license-link]

<!-- Link -->
[license-badge]:    https://img.shields.io/github/license/mashape/apistatus.svg
[license-link]:     https://opensource.org/licenses/MIT
