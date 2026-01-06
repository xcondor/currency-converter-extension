# Chrome Web Store 权限说明填写指南

## 📋 表单填写内容

根据你的截图，需要填写 3 个权限的理由说明（已删除不需要的 notifications 权限）。

---

### 1️⃣ 需请求 storage 的理由

**中文版本：**
```
本扩展需要 storage 权限来存储用户的个性化设置和汇率缓存数据：

1. 用户设置：本地货币选择（CNY/USD/EUR等）、小数位数（2-4位）、是否显示汇率信息、界面语言（中文/英文）
2. 汇率缓存：从 ExchangeRate-API 获取的汇率数据，本地缓存 1 小时以减少 API 请求次数
3. 所有数据仅存储在用户本地设备，不会上传到任何服务器
4. 用户可以随时通过侧边栏的"清除缓存"按钮删除缓存数据

隐私保护：不收集、不上传任何个人信息或浏览数据。
```

**英文版本：**
```
This extension requires storage permission to save user preferences and exchange rate cache:

1. User Settings: Local currency selection (CNY/USD/EUR, etc.), decimal places (2-4 digits), rate display options, interface language (Chinese/English)
2. Exchange Rate Cache: Data from ExchangeRate-API, cached locally for 1 hour to reduce API requests
3. All data is stored locally on user's device only, never uploaded to any server
4. Users can clear cache anytime via the "Clear Cache" button in the sidebar

Privacy: No collection or upload of personal information or browsing data.
```

**字符数：** 约 450 字符（中文）/ 500 字符（英文）

---

### 2️⃣ 需请求 sidePanel 的理由

**中文版本：**
```
本扩展需要 sidePanel 权限来显示设置控制面板，提供以下功能：

1. 功能控制：一键开启/关闭自动货币转换功能，实时生效无需刷新页面
2. 转换设置：选择本地货币（支持 160+ 种货币）、调整小数精度、配置显示选项
3. 汇率状态：查看汇率数据更新时间和缓存状态，确保数据时效性
4. 语言切换：在中文和英文界面之间切换
5. 缓存管理：清除本地缓存，强制刷新汇率数据

侧边栏提供了比传统 popup 更好的用户体验，用户可以在浏览网页的同时调整设置，无需关闭当前页面。
```

**英文版本：**
```
This extension requires sidePanel permission to display the settings control panel with the following features:

1. Function Control: Toggle auto-conversion on/off with instant effect, no page refresh needed
2. Conversion Settings: Select local currency (160+ currencies supported), adjust decimal precision, configure display options
3. Exchange Rate Status: View rate update time and cache status to ensure data freshness
4. Language Switch: Toggle between Chinese and English interface
5. Cache Management: Clear local cache and force refresh exchange rates

The sidebar provides better UX than traditional popup, allowing users to adjust settings while browsing without closing the current page.
```

**字符数：** 约 480 字符（中文）/ 620 字符（英文）

---

### 3️⃣ 需请求主机权限的理由

**中文版本：**
```
本扩展需要两类主机权限：

【权限 1】https://v6.exchangerate-api.com/*
• 用途：从 ExchangeRate-API 获取实时汇率数据
• 说明：这是唯一的外部 API 请求，用于获取 160+ 种货币的最新汇率信息
• 频率：每小时最多请求一次（使用本地缓存机制）
• 数据：仅请求公开的汇率数据，不发送任何用户信息

【权限 2】<all_urls> (content_scripts)
• 用途：在网页上检测和转换货币金额
• 说明：content script 需要访问网页 DOM 来识别货币符号（$、€、£、¥）和金额，并在原金额旁边显示转换结果
• 处理：所有货币检测和转换都在本地完成
• 隐私：不收集、不上传任何网页内容或用户数据

隐私承诺：扩展完全开源，代码可在 GitHub 审计。
```

**英文版本：**
```
This extension requires two types of host permissions:

【Permission 1】https://v6.exchangerate-api.com/*
• Purpose: Fetch real-time exchange rates from ExchangeRate-API
• Details: Only external API request for latest rates of 160+ currencies
• Frequency: Maximum once per hour (with local caching mechanism)
• Data: Only requests public exchange rate data, no user information sent

【Permission 2】<all_urls> (content_scripts)
• Purpose: Detect and convert currency amounts on web pages
• Details: Content script accesses page DOM to identify currency symbols ($, €, £, ¥) and amounts, displaying converted results next to original amounts
• Processing: All currency detection and conversion done locally
• Privacy: No collection or upload of page content or user data

Privacy Commitment: Extension is fully open source, code auditable on GitHub.
```

**字符数：** 约 580 字符（中文）/ 750 字符（英文）

---

## 📝 填写建议

### 语言选择
- 如果主要面向中国用户：使用**中文版本**
- 如果面向国际用户：使用**英文版本**
- 如果想覆盖更广：可以**中英文混合**（先中文后英文）

### 填写技巧
1. **清晰明确**：说明每个权限的具体用途
2. **强调隐私**：明确说明不收集用户数据
3. **用户利益**：解释权限如何改善用户体验
4. **透明度**：提到开源和可审计性

### 注意事项
⚠️ **重要提示**：
- 每个文本框限制 1000 字符
- 上述内容都在限制范围内
- 建议使用中文版本（更简洁）
- 如果需要中英文混合，注意字符数限制

---

## ✅ 检查清单

在提交前确认：

- [x] 已从 manifest.json 删除 `notifications` 权限
- [ ] 复制粘贴上述内容到对应的文本框
- [ ] 检查字符数是否在 1000 以内
- [ ] 确认所有权限说明都清晰易懂
- [ ] 强调了隐私保护和数据安全

---

## 🔄 如果审核被拒

常见拒绝原因和解决方法：

1. **权限说明不够详细**
   - 补充更具体的使用场景
   - 添加数据处理流程说明

2. **隐私政策不清楚**
   - 在 GitHub README 中添加详细的隐私政策
   - 在权限说明中引用隐私政策链接

3. **<all_urls> 权限过于宽泛**
   - 解释为什么需要访问所有网站（货币转换功能需要）
   - 强调不收集任何数据
   - 提供开源代码链接供审核

---

## 📞 需要帮助？

如果审核过程中遇到问题：
1. 查看 Chrome Web Store 的拒绝原因
2. 根据反馈调整权限说明
3. 在 GitHub Issues 中寻求社区帮助

---

**最后更新**: 2026-01-06
**适用版本**: v1.0.0
