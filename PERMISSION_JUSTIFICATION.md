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

**中文版本（推荐 - 更详细）：**
```
本扩展是通用货币转换工具，必须使用 <all_urls> 权限才能实现核心功能。

【为什么需要 <all_urls>】
本扩展需要在用户访问的任何网站上自动检测和转换货币金额。使用场景包括：电商购物（Amazon、eBay、淘宝等）、新闻阅读（BBC、CNN等）、社交媒体、企业官网等数百万个网站。由于无法预先列出所有可能包含货币信息的网站，必须使用 <all_urls> 权限。

【为什么不能使用 activeTab】
扩展需要在页面加载时自动运行并持续监控动态内容更新（AJAX、SPA），而非每次手动触发。用户期望打开任何网站都能自动转换货币，而不是频繁点击扩展图标。

【隐私和安全保证】
✅ 只读取页面可见文本来检测货币符号（$、€、£、¥），不访问密码、表单、Cookie等敏感信息
✅ 所有检测和转换都在本地完成，不上传任何网页内容或用户数据
✅ 唯一外部请求：向 ExchangeRate-API 获取汇率数据（仅发送货币代码如"CNY"）
✅ 完全开源：代码可在 GitHub 审计验证

【类似扩展】
Google Translate、Grammarly、Dark Reader 等知名扩展都使用 <all_urls> 权限提供通用功能。

GitHub: https://github.com/xcondor/currency-converter-extension
```

**英文版本（推荐 - 更详细）：**
```
This extension is a universal currency converter that requires <all_urls> permission to function properly.

【Why <all_urls> is Required】
This extension automatically detects and converts currency amounts on any website users visit, including e-commerce (Amazon, eBay, Taobao), news sites (BBC, CNN), social media, and corporate websites - millions of sites worldwide. It's impossible to enumerate all websites that may contain currency information, making <all_urls> permission necessary.

【Why activeTab Cannot Be Used】
The extension must run automatically on page load and continuously monitor dynamic content updates (AJAX, SPA), not require manual trigger each time. Users expect currency conversion to work automatically on any website without frequent extension icon clicks.

【Privacy and Security Guarantees】
✅ Only reads visible page text to detect currency symbols ($, €, £, ¥), does not access passwords, forms, cookies, or sensitive data
✅ All detection and conversion done locally, no webpage content or user data uploaded
✅ Only external request: Fetch exchange rates from ExchangeRate-API (only sends currency code like "CNY")
✅ Fully open source: Code auditable on GitHub

【Similar Extensions】
Google Translate, Grammarly, Dark Reader all use <all_urls> permission to provide universal functionality.

GitHub: https://github.com/xcondor/currency-converter-extension
```

**字符数：** 约 950 字符（中文）/ 1000 字符（英文）

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
