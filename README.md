<p align="center"><img src="https://i.imgur.com/6ExcDl9.png"/></p>
<h1 align="center">+Emoji</h1>
<p align="center">一个简单、可靠、纯粹、中文语义化的 Emoji 扩展</p>

***

### 名字：
`+Emoji` _灵感来源于 `文字 + Emoji` 之意_

### 下载：
[Chrome 应用商店](https://chrome.google.com/webstore/detail/+emoji/kieghamlkoahkbimidmahcjpikacoclm) · [Firefox 附加组件](https://addons.mozilla.org/zh-CN/developers/addon/emoji_cn/edit) · [更多版本](http://ksria.com/emoji/)

### 功能：

- 使用了最基本的 Emoji 集合，支持任何 App；  
_均不会出现乱码情况_

- 支持 `中文语义`并具有多种插入模式：

  1. **[单选插入模式](https://github.com/Kenshin/emoji/wiki#单选插入模式)**  
  _通过触发条件以及关键字会显示相关的 Emoji，适合全键盘操作；触发条件默认为 [:: | ：：] [关键字 | 空格] [空格]_

      例如：
      * `::gr　`   // 查询关键字 gr 为内容的 Emoji
      * `::　　`    // 查询全部 Emoji
      * `：：笑　` // 查询中文语义
      * `：：　　`  // 查询全部 Emoji

  2. **[多选插入模式](https://github.com/Kenshin/emoji/wiki#多选插入模式)**  
  _通过 `右键菜单` 进入，显示全部的 Emoji，可跟随光标插入，适合鼠标操作；_

  3. **[直接插入模式](https://github.com/Kenshin/emoji/wiki#直接插入模式)**  
  _当明确知道 Emoji 的名称，或通过关键字查找的结果唯一的话，则直接将 Emoji 插入到触发器中；_

- 复制到剪切板并支持多个复制；

- 支持快捷键呼出；  
  > 默认快捷键 <kbd>command / ctrl + Shift + Y</kbd>

- 可作为独立窗口存在；

- 个性化定制，包括：可定义触发条件、插入规则，黑名单（支持 [minimatch](https://github.com/isaacs/minimatch) 模糊匹配）等；

### 截图：

**独立窗口**  
<img src="https://i.imgur.com/aYRpQvC.png" width="500" />

**Popup 窗口**  
<img src="https://i.imgur.com/v7SUppd.png" width="500" />

**选项**  
<img src="https://i.imgur.com/B5W0xNm.png" width="500" />

**中文语义化**  
<img src="http://ksria.com/emoji/assets/images/chinese.gif" />

### 附一段使用视频：

- [常规操作](https://i.imgur.com/XYTpirX.gif)

- [语义化插入](https://i.imgur.com/GCPgNrt.gif)

### 投票：
`+Emoji` 是一个免费并开源的项目，如果觉得不错，请帮忙好评 [Chrome 应用商店](https://chrome.google.com/webstore/detail/%2Bemoji/kieghamlkoahkbimidmahcjpikacoclm/reviews) · [Firefox 附加组件](https://addons.mozilla.org/zh-CN/firefox/addon/emoji_cn/reviews/) ，你的认可是对我最大的鼓励 😀 。

### 已知问题：

- iFrame 无法使用 `插入模式`；

- 非标准 `<input> / <textarea>` 类标签无法使用快捷键 `::  ` 呼出 `插入模式`；

### 下一步：
- [ ] 导入/导出配置；  
- [ ] 同步配置文件；  

### 相关链接：
* [更新日志](https://github.com/Kenshin/emoji/blob/master/CHANGELOG.md)
* [帮助中心](https://github.com/kenshin/emoji/wiki)
* [反馈](https://github.com/kenshin/emoji/issues)
* [联系](http://kenshin.wang) · [邮件](kenshin@ksria.com) · [微博](http://weibo.com/23784148) 

### 感谢：

- https://github.com/Janson-Leung/Emoji-Extension-for-Chrome  

- https://github.com/locomojis/Chromoji

- https://github.com/dofy/apple-emoji-dict

> **`+Emoji` 使用了 [Emoji-Extension-for-Chrome](https://github.com/Janson-Leung/Emoji-Extension-for-Chrome) 部分代码；中文语义字典由 [apple-emoji-dict](https://github.com/dofy/apple-emoji-dict) 提供来源。**

### +Emoji的诞生离不开它们：
- Emoji 来源于 [Google Android 7.0](https://github.com/googlei18n/noto-emoji)
- LOGO 来源于 [ShareIcon](https://www.shareicon.net/wink-interface-faces-emoji-ideogram-tongue-feelings-emoticons-smileys-798496)
- [Node.js](https://nodejs.org/) · [NPM](https://www.npmjs.com)
- [Webpack](https://webpack.github.io/)
- [ES6](http://es6-features.org/) · [Babel](https://babeljs.io)
- [PostCSS](http://postcss.org/) · [cssnext](http://cssnext.io/)
- [jQuery](https://jquery.com/) · [Velocity.js](http://velocityjs.org/) · [minimatch](https://github.com/isaacs/minimatch)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Sketch](https://www.sketchapp.com/) · [Pixelmator](http://www.pixelma
- 咖啡 · 网易音乐 · Google Chrome · rMBP

### 请杯咖啡：
如果你找不到适合的 Emoji 扩展，并觉得 +Emoji 还不错的话，请我喝杯咖啡也是件惬意的事情 😁 😘 👍
![支付](http://ksria.qiniudn.com/zhifu_m.png)

### 许可：
[![license-badge]][license-link]

<!-- Link -->
[license-badge]:    https://img.shields.io/github/license/mashape/apistatus.svg
[license-link]:     https://opensource.org/licenses/MIT
