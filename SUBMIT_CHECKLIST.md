# Chrome Web Store 提交检查清单

## ✅ 提交前准备

### 1. 构建扩展
```bash
npm run build
```

### 2. 打包 ZIP 文件
```bash
cd dist
zip -r ../currency-converter-extension.zip .
cd ..
```

### 3. 验证文件
确保 `dist/` 目录包含：
- [ ] manifest.json
- [ ] background.js
- [ ] content.js
- [ ] popup.js
- [ ] popup.html
- [ ] popup.css
- [ ] icons/ 目录（icon16.png, icon48.png, icon128.png）

---

## 📝 表单填写内容

### 基本信息

**扩展名称：**
```
实时汇率转换器
```

**简短描述（132 字符以内）：**
```
自动识别网页货币金额并实时转换为本地货币。支持 160+ 种货币，智能识别，优雅设计，隐私保护。
```

**详细描述：**
复制 `STORE_DESCRIPTION.md` 中的"详细描述 - 中文版本"

**分类：**
- 主要：Shopping（购物）
- 次要：Productivity（生产力）

**语言：**
- 中文（简体）
- English

---

## 🖼️ 上传素材

### 必需素材

1. **扩展图标**（已在 manifest.json 中）
   - icon16.png ✅
   - icon48.png ✅
   - icon128.png ✅

2. **截图**（至少 1 张，最多 5 张）
   - `promo-images/screenshot-1-1280x800.png` ✅
   - `promo-images/screenshot-2-1280x800.png` ✅
   - `promo-images/screenshot-3-1280x800.png` ✅

3. **小型宣传图块**（440x280）
   - `promo-images/small-promo-tile-440x280.png` ✅

### 可选素材

4. **顶部宣传图块**（1400x560）
   - `promo-images/marquee-promo-tile-1400x560.png` ✅

---

## 🔐 权限说明

### Storage 权限
复制 `PERMISSION_JUSTIFICATION.md` 中的"需请求 storage 的理由 - 中文版本"

### SidePanel 权限
复制 `PERMISSION_JUSTIFICATION.md` 中的"需请求 sidePanel 的理由 - 中文版本"

### 主机权限（重要！）
复制 `PERMISSION_JUSTIFICATION.md` 中的"需请求主机权限的理由 - 中文版本（推荐）"

**关键点：**
- 强调这是通用工具，必须在所有网站运行
- 提到 Google Translate、Grammarly 等类似扩展
- 强调隐私保护和开源透明
- 提供 GitHub 链接

---

## 🌐 其他信息

**官方网站：**
```
https://github.com/xcondor/currency-converter-extension
```

**支持网站/邮箱：**
```
https://github.com/xcondor/currency-converter-extension/issues
```

**隐私政策：**
```
https://github.com/xcondor/currency-converter-extension#-privacy-policy
```

---

## ⚠️ 预期审核情况

### 正常情况
- 审核时间：1-3 个工作日
- 可能直接通过

### 深入审核（由于 <all_urls> 权限）
- 审核时间：1-2 周
- 可能需要额外说明

### 如果被拒绝

**常见原因：**
1. 权限说明不够详细
2. 隐私政策不清楚
3. <all_urls> 权限需要更多证明

**应对措施：**
1. 使用 `REVIEW_RESPONSE.md` 中的回复模板
2. 强调与知名扩展的相似性
3. 提供代码审计证明
4. 邀请审核团队查看 GitHub 源代码

---

## 📧 审核回复模板

如果收到关于 `<all_urls>` 权限的质疑，使用以下回复：

```
尊敬的 Chrome Web Store 审核团队：

感谢您的反馈。关于 <all_urls> 权限的使用，我想提供以下说明：

1. 扩展性质：
   本扩展是一个通用货币转换工具，类似于 Google Translate（翻译）、
   Grammarly（语法检查）等扩展，需要在用户访问的任何网站上运行。

2. 为什么必须使用 <all_urls>：
   - 用户可能在任何网站遇到货币金额（电商、新闻、社交媒体等）
   - 全球有数百万个网站可能包含货币信息，无法在 manifest 中穷举
   - 需要自动运行和监控动态内容，activeTab 无法满足需求

3. 隐私保护措施：
   - 只读取页面可见文本来检测货币符号
   - 所有处理都在本地完成，不上传任何数据
   - 不访问密码、表单、Cookie 等敏感信息
   - 代码完全开源，可在 GitHub 审计

4. 代码审计：
   GitHub: https://github.com/xcondor/currency-converter-extension
   欢迎审核团队查看源代码，验证我们的隐私承诺。

我们理解安全审核的重要性，愿意配合提供任何额外的说明或材料。

期待您的回复。

此致
敬礼
```

---

## 📊 提交后跟踪

### 状态检查
1. 登录 [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. 查看扩展状态
3. 检查是否有审核反馈

### 可能的状态
- ⏳ **审核中**：耐心等待
- ✅ **已发布**：恭喜！可以在商店搜索到
- ❌ **被拒绝**：查看拒绝原因，使用上述模板回复
- ⚠️ **需要更多信息**：及时回复审核团队的问题

---

## 🎉 发布后

### 更新 README
在 README.md 顶部添加 Chrome Web Store 徽章：

```markdown
[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/YOUR_EXTENSION_ID.svg)](https://chrome.google.com/webstore/detail/YOUR_EXTENSION_ID)
[![Chrome Web Store Users](https://img.shields.io/chrome-web-store/users/YOUR_EXTENSION_ID.svg)](https://chrome.google.com/webstore/detail/YOUR_EXTENSION_ID)
[![Chrome Web Store Rating](https://img.shields.io/chrome-web-store/rating/YOUR_EXTENSION_ID.svg)](https://chrome.google.com/webstore/detail/YOUR_EXTENSION_ID)
```

### 添加安装链接
在 README.md 的安装部分添加：

```markdown
### 方法一：从 Chrome Web Store 安装（推荐）

1. 访问 [Chrome Web Store](https://chrome.google.com/webstore/detail/YOUR_EXTENSION_ID)
2. 点击"添加至 Chrome"
3. 确认安装
```

### 宣传推广
- 在社交媒体分享
- 在相关论坛发布
- 收集用户反馈
- 持续改进功能

---

## 📞 需要帮助？

- **审核问题**：查看 `REVIEW_RESPONSE.md`
- **权限说明**：查看 `PERMISSION_JUSTIFICATION.md`
- **技术问题**：在 GitHub Issues 提问

---

**祝你发布顺利！** 🚀

记住：即使遇到深入审核，只要耐心说明和配合，最终都能通过。
