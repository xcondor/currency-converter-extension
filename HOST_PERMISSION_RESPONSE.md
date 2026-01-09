# Chrome 应用商店审核回复 - <all_urls> 权限说明

## 📋 审核问题
Chrome 应用商店要求说明为什么需要使用 `<all_urls>` 权限，而不是使用 `activeTab` 或指定特定网站。

---

## ✅ 回复内容（中文版）

### 为什么必须使用 <all_urls> 权限

尊敬的审核团队：

感谢您的审核意见。我理解 `<all_urls>` 权限需要特别说明。以下是本扩展必须使用此权限的详细理由：

#### 1. 扩展的核心功能
本扩展是一个**通用货币转换工具**，核心功能是：在用户访问的**任何网站**上自动检测货币金额并转换为用户的本地货币。

#### 2. 为什么不能使用 activeTab
`activeTab` 权限不适用于本扩展，原因如下：

**a) 需要自动运行**
- 用户期望打开任何网站时，货币自动转换，无需手动点击扩展图标
- `activeTab` 需要用户每次都点击扩展图标才能激活，这违背了"自动转换"的核心功能

**b) 需要持续监控**
- 现代网站使用 AJAX、SPA 等技术动态加载内容
- 扩展需要持续监控 DOM 变化，检测新加载的价格信息
- `activeTab` 只在用户点击时临时激活，无法持续监控

**c) 用户体验问题**
- 如果使用 `activeTab`，用户需要在每个网站、每次页面更新时都点击扩展图标
- 这会导致极差的用户体验，违背了"自动转换"的设计初衷

#### 3. 为什么不能指定特定网站
本扩展需要在**所有可能包含货币信息的网站**上工作，包括但不限于：

**电商网站**（数千个）
- 国际：Amazon, eBay, AliExpress, Etsy, Walmart, Target...
- 中国：淘宝, 京东, 拼多多, 天猫...
- 其他国家：Rakuten, Mercado Libre, Flipkart...

**新闻和媒体**（数万个）
- BBC, CNN, Reuters, Bloomberg, Financial Times...
- 各国本地新闻网站

**企业官网**（数百万个）
- 任何展示产品价格的企业网站
- B2B 平台、SaaS 服务定价页面

**其他场景**
- 社交媒体（Twitter, Facebook, Reddit）
- 论坛和博客
- 政府网站（税务、统计数据）
- 教育网站（学费、课程费用）

**无法预先列举所有网站**：
- 全球有数亿个网站可能包含货币信息
- 新网站每天都在创建
- 用户可能访问任何包含价格信息的网站

#### 4. 隐私和安全保证

**我们只读取页面可见文本**：
- ✅ 仅扫描页面文本查找货币符号（$, €, £, ¥）
- ❌ 不访问密码、表单、Cookie、LocalStorage
- ❌ 不访问用户输入的任何敏感信息
- ❌ 不修改页面内容（仅添加转换结果显示）

**所有处理都在本地完成**：
- ✅ 货币检测和转换都在用户浏览器本地完成
- ✅ 不上传任何网页内容或用户数据
- ✅ 唯一的外部请求：向 ExchangeRate-API 获取汇率（仅发送货币代码如 "CNY"）

**完全开源和可审计**：
- ✅ 代码完全开源：https://github.com/xcondor/currency-converter-extension
- ✅ 任何人都可以审计代码，验证我们的隐私承诺
- ✅ 不包含任何数据收集或跟踪代码

#### 5. 类似扩展的先例
以下知名扩展都使用 `<all_urls>` 权限提供通用功能：

- **Google Translate**: 在任何网站上翻译文本
- **Grammarly**: 在任何网站上检查语法
- **Dark Reader**: 在任何网站上应用暗色主题
- **Honey**: 在任何电商网站上查找优惠券
- **LastPass**: 在任何网站上管理密码

这些扩展都需要在用户访问的任何网站上自动工作，与本扩展的需求相同。

#### 6. 用户控制
用户可以完全控制扩展的行为：
- ✅ 可以随时在侧边栏中禁用扩展
- ✅ 可以在 Chrome 扩展管理页面中限制扩展访问特定网站
- ✅ 可以随时卸载扩展

#### 7. 最小权限原则
除了 `<all_urls>`，我们只请求了两个额外权限：
- `storage`: 存储用户设置和汇率缓存（本地存储）
- `sidePanel`: 显示设置面板

我们没有请求任何其他可能侵犯隐私的权限（如 `tabs`, `webRequest`, `cookies` 等）。

---

### 总结
本扩展的核心价值是**在任何网站上自动转换货币**，这是一个通用工具，类似于 Google Translate 或 Grammarly。使用 `activeTab` 或指定特定网站都无法实现这一核心功能。

我们承诺：
1. 只读取页面可见文本
2. 不收集任何用户数据
3. 所有处理都在本地完成
4. 代码完全开源可审计

希望审核团队能够理解本扩展的特殊需求，批准使用 `<all_urls>` 权限。

如有任何疑问，我随时准备提供更多信息或进行代码审计。

谢谢！

---

## ✅ 回复内容（英文版）

### Why <all_urls> Permission is Required

Dear Review Team,

Thank you for your review feedback. I understand that `<all_urls>` permission requires special justification. Here are the detailed reasons why this extension must use this permission:

#### 1. Core Functionality
This extension is a **universal currency converter** with the core function of: automatically detecting currency amounts on **any website** users visit and converting them to their local currency.

#### 2. Why activeTab Cannot Be Used
The `activeTab` permission is not suitable for this extension for the following reasons:

**a) Requires Automatic Execution**
- Users expect currency conversion to happen automatically when opening any website, without manually clicking the extension icon
- `activeTab` requires users to click the extension icon every time to activate, which contradicts the "automatic conversion" core functionality

**b) Requires Continuous Monitoring**
- Modern websites use AJAX, SPA, and other technologies to dynamically load content
- The extension needs to continuously monitor DOM changes to detect newly loaded price information
- `activeTab` only activates temporarily when users click, cannot continuously monitor

**c) User Experience Issues**
- If using `activeTab`, users would need to click the extension icon on every website, every page update
- This would result in extremely poor user experience, contradicting the "automatic conversion" design intent

#### 3. Why Specific Websites Cannot Be Specified
This extension needs to work on **all websites that may contain currency information**, including but not limited to:

**E-commerce Sites** (thousands)
- International: Amazon, eBay, AliExpress, Etsy, Walmart, Target...
- China: Taobao, JD, Pinduoduo, Tmall...
- Other countries: Rakuten, Mercado Libre, Flipkart...

**News and Media** (tens of thousands)
- BBC, CNN, Reuters, Bloomberg, Financial Times...
- Local news sites in various countries

**Corporate Websites** (millions)
- Any corporate website displaying product prices
- B2B platforms, SaaS service pricing pages

**Other Scenarios**
- Social media (Twitter, Facebook, Reddit)
- Forums and blogs
- Government websites (taxes, statistics)
- Educational websites (tuition, course fees)

**Cannot Enumerate All Websites**:
- Hundreds of millions of websites globally may contain currency information
- New websites are created every day
- Users may visit any website containing price information

#### 4. Privacy and Security Guarantees

**We Only Read Visible Page Text**:
- ✅ Only scan page text for currency symbols ($, €, £, ¥)
- ❌ Do not access passwords, forms, cookies, localStorage
- ❌ Do not access any sensitive information users input
- ❌ Do not modify page content (only add conversion result display)

**All Processing Done Locally**:
- ✅ Currency detection and conversion done locally in user's browser
- ✅ Do not upload any webpage content or user data
- ✅ Only external request: Fetch exchange rates from ExchangeRate-API (only send currency code like "CNY")

**Fully Open Source and Auditable**:
- ✅ Code fully open source: https://github.com/xcondor/currency-converter-extension
- ✅ Anyone can audit the code to verify our privacy commitments
- ✅ Contains no data collection or tracking code

#### 5. Precedent of Similar Extensions
The following well-known extensions all use `<all_urls>` permission to provide universal functionality:

- **Google Translate**: Translate text on any website
- **Grammarly**: Check grammar on any website
- **Dark Reader**: Apply dark theme on any website
- **Honey**: Find coupons on any e-commerce site
- **LastPass**: Manage passwords on any website

These extensions all need to work automatically on any website users visit, same as this extension's requirements.

#### 6. User Control
Users have full control over the extension's behavior:
- ✅ Can disable the extension anytime in the sidebar
- ✅ Can restrict extension access to specific sites in Chrome extension management
- ✅ Can uninstall the extension anytime

#### 7. Principle of Least Privilege
Besides `<all_urls>`, we only request two additional permissions:
- `storage`: Store user settings and exchange rate cache (local storage)
- `sidePanel`: Display settings panel

We do not request any other permissions that could invade privacy (such as `tabs`, `webRequest`, `cookies`, etc.).

---

### Summary
The core value of this extension is **automatically converting currencies on any website**, which is a universal tool, similar to Google Translate or Grammarly. Using `activeTab` or specifying specific websites cannot achieve this core functionality.

We commit to:
1. Only read visible page text
2. Not collect any user data
3. All processing done locally
4. Code fully open source and auditable

We hope the review team can understand this extension's special requirements and approve the use of `<all_urls>` permission.

If you have any questions, I am ready to provide more information or conduct code audits at any time.

Thank you!

---

## 📝 如何提交回复

### 方式 1：在审核反馈中回复
1. 登录 Chrome Web Store Developer Dashboard
2. 找到被推迟的扩展
3. 点击"回复审核"或"提供更多信息"
4. 复制粘贴上述中文或英文版本
5. 提交回复

### 方式 2：更新权限说明
1. 在扩展的"隐私实践"部分
2. 更新 `<all_urls>` 权限的说明
3. 使用上述内容的简化版本（参考 PERMISSION_JUSTIFICATION.md）

### 方式 3：添加隐私政策
1. 在 GitHub 仓库中添加 PRIVACY_POLICY.md
2. 在 Chrome Web Store 的"隐私政策"字段中填写 GitHub 链接
3. 确保隐私政策详细说明数据处理方式

---

## 📋 补充材料

### 1. 创建隐私政策页面
在 GitHub 仓库中创建 `PRIVACY_POLICY.md`，内容参考本文档末尾的模板。

### 2. 更新 README.md
在 README 中添加隐私和安全部分，说明：
- 不收集用户数据
- 所有处理都在本地完成
- 代码开源可审计

### 3. 准备代码审计
如果审核团队要求，准备提供：
- 关键代码文件的说明
- 数据流程图
- 权限使用的具体代码位置

---

## ⚠️ 注意事项

### 审核可能需要的额外信息
1. **隐私政策链接**：必须提供详细的隐私政策
2. **代码审计**：可能需要提供代码说明或演示
3. **使用场景**：提供具体的使用场景截图或视频

### 审核时间
- 使用 `<all_urls>` 的扩展通常需要 **深入审核**
- 审核时间可能需要 **1-2 周**
- 保持耐心，及时回复审核团队的问题

### 如果被拒绝
如果审核团队仍然拒绝，可以考虑：
1. 提供更详细的技术说明
2. 提供视频演示扩展如何工作
3. 邀请审核团队进行代码审计
4. 申诉并提供更多证据

---

## 📞 需要帮助？

如果审核过程中遇到问题：
1. 查看 Chrome Web Store 的详细拒绝原因
2. 根据反馈调整回复内容
3. 在 GitHub Issues 中寻求社区帮助
4. 参考其他成功使用 `<all_urls>` 的开源扩展

---

**最后更新**: 2026-01-09
**适用版本**: v1.0.2
