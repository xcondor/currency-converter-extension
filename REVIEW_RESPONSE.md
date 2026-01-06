# Chrome Web Store 审核回复 - <all_urls> 权限说明

## 📝 针对"所有网站权限"的详细说明

### 为什么必须使用 <all_urls> 权限

**扩展核心功能：**
本扩展是一个**通用货币转换工具**，需要在用户访问的任何网站上自动检测和转换货币金额。

**无法使用 activeTab 的原因：**
1. **自动化需求**：扩展需要在页面加载时自动运行，无需用户每次点击
2. **持续监控**：需要监控动态内容更新（AJAX、SPA），不是一次性操作
3. **用户体验**：用户期望打开任何网站都能自动转换货币，而不是每次手动触发

**无法指定特定网站的原因：**
1. **使用场景广泛**：用户可能在任何网站遇到货币金额
   - 电商平台：Amazon、eBay、淘宝、京东、Shopee 等数千个网站
   - 新闻媒体：BBC、CNN、路透社、各国本地新闻网站
   - 社交媒体：Twitter、Reddit、Facebook、微博等
   - 论坛博客：Medium、WordPress、各类技术论坛
   - 企业官网：全球数百万企业网站的产品定价页面

2. **无法穷举**：全球有数亿个网站可能包含货币信息，无法在 manifest 中列出

3. **用户自由**：用户应该能在任何网站使用货币转换功能，不应受限于预设列表

**类似扩展的先例：**
- Google Translate（翻译扩展）- 需要 <all_urls>
- Grammarly（语法检查）- 需要 <all_urls>
- AdBlock（广告拦截）- 需要 <all_urls>
- Dark Reader（深色模式）- 需要 <all_urls>

这些扩展都需要在所有网站上运行，因为它们提供的是通用功能。

---

## 🔒 隐私和安全保证

### 我们如何保护用户隐私

**1. 最小化数据访问**
```javascript
// 我们只读取页面的文本内容来检测货币
// 不访问：密码、表单数据、Cookie、LocalStorage
const textContent = document.body.innerText;
const currencies = detectCurrencies(textContent);
```

**2. 零数据上传**
- ✅ 所有货币检测和转换都在本地完成
- ✅ 不向任何服务器发送网页内容
- ✅ 不收集用户浏览历史
- ✅ 不追踪用户行为

**3. 唯一的外部请求**
- 仅向 `https://v6.exchangerate-api.com/*` 请求汇率数据
- 请求内容：货币代码（如 "CNY"）
- 不包含：用户信息、网页内容、浏览历史

**4. 开源透明**
- GitHub 仓库：https://github.com/xcondor/currency-converter-extension
- 所有代码公开可审计
- 用户和安全研究人员可以验证我们的隐私承诺

**5. 本地存储**
- 使用 Chrome Storage API 仅存储：
  - 用户设置（货币选择、小数位数等）
  - 汇率缓存（公开数据，1 小时有效期）
- 不存储任何网页内容或个人信息

---

## 📊 代码审计证明

### 关键代码片段说明

**1. 货币检测（detector.ts）**
```typescript
// 只检测货币模式，不收集其他数据
export function detectCurrencies(text: string): CurrencyMatch[] {
  const patterns = [
    /\$\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/g,  // $99.99
    /€\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/g,   // €49.99
    // ... 其他货币模式
  ];
  // 返回匹配的货币信息，不保存原始文本
}
```

**2. 内容脚本（content.ts）**
```typescript
// 只在页面上添加转换结果，不读取敏感信息
async function scanAndConvert() {
  const text = document.body.innerText; // 只读取可见文本
  const matches = detectCurrencies(text);
  // 转换并显示结果，不发送到服务器
}
```

**3. 汇率请求（rateProvider.ts）**
```typescript
// 唯一的外部请求
async function fetchRates(baseCurrency: string) {
  const url = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${baseCurrency}`;
  // 只发送货币代码，不包含任何用户数据
  return fetch(url);
}
```

---

## 📋 更新后的权限说明

### 需请求主机权限的理由（更详细版本）

**中文版本：**
```
本扩展是一个通用货币转换工具，必须使用 <all_urls> 权限才能实现核心功能。

【为什么需要 <all_urls>】
1. 功能定位：在用户访问的任何网站上自动检测和转换货币金额
2. 使用场景：电商购物、新闻阅读、社交媒体、企业官网等数百万个网站
3. 无法穷举：无法预先列出所有可能包含货币信息的网站
4. 用户期望：用户希望在任何网站都能使用货币转换功能

【为什么不能使用 activeTab】
1. 需要页面加载时自动运行，而非每次手动触发
2. 需要持续监控动态内容更新（AJAX、SPA）
3. 用户体验要求自动化，不应频繁点击扩展图标

【隐私和安全保证】
✅ 只读取页面可见文本来检测货币符号（$、€、£、¥）
✅ 所有检测和转换都在本地完成，不上传任何数据
✅ 不访问密码、表单、Cookie、LocalStorage 等敏感信息
✅ 唯一外部请求：向 ExchangeRate-API 获取汇率（仅发送货币代码）
✅ 完全开源：代码可在 GitHub 审计验证

【类似扩展先例】
Google Translate、Grammarly、AdBlock、Dark Reader 等知名扩展都使用 <all_urls> 权限，因为它们提供通用功能。

【代码审计】
GitHub: https://github.com/xcondor/currency-converter-extension
欢迎审核团队查看源代码，验证我们的隐私承诺。
```

**英文版本：**
```
This extension is a universal currency converter that requires <all_urls> permission to function properly.

【Why <all_urls> is Required】
1. Core Function: Automatically detect and convert currency amounts on any website users visit
2. Use Cases: E-commerce, news sites, social media, corporate websites - millions of sites worldwide
3. Cannot Enumerate: Impossible to list all websites that may contain currency information
4. User Expectation: Users expect currency conversion to work on any website

【Why activeTab Cannot Be Used】
1. Must run automatically on page load, not require manual trigger each time
2. Must continuously monitor dynamic content updates (AJAX, SPA)
3. User experience requires automation, not frequent extension icon clicks

【Privacy and Security Guarantees】
✅ Only reads visible page text to detect currency symbols ($, €, £, ¥)
✅ All detection and conversion done locally, no data uploaded
✅ Does not access passwords, forms, cookies, localStorage, or sensitive data
✅ Only external request: Fetch exchange rates from ExchangeRate-API (only sends currency code)
✅ Fully open source: Code auditable on GitHub

【Similar Extension Precedents】
Google Translate, Grammarly, AdBlock, Dark Reader all use <all_urls> permission because they provide universal functionality.

【Code Audit】
GitHub: https://github.com/xcondor/currency-converter-extension
Review team welcome to inspect source code and verify our privacy commitments.
```

---

## 🎯 审核策略建议

### 提交时的注意事项

1. **在权限说明中强调**：
   - 这是通用工具，必须在所有网站运行
   - 提供类似扩展的先例
   - 强调隐私保护措施
   - 提供 GitHub 链接供审核

2. **准备补充材料**：
   - 录制演示视频，展示在不同网站的使用场景
   - 准备详细的隐私政策文档
   - 列出代码中的关键隐私保护措施

3. **如果被拒绝**：
   - 礼貌回复审核团队
   - 提供更详细的技术说明
   - 强调与 Google Translate 等扩展的相似性
   - 邀请审核团队查看开源代码

---

## 📧 审核回复模板

如果审核被拒，可以使用以下回复：

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

## ✅ 行动清单

- [ ] 使用更详细的权限说明（见上文）
- [ ] 在 GitHub README 中添加详细的隐私政策
- [ ] 准备演示视频（展示在不同网站的使用）
- [ ] 提交扩展并等待审核
- [ ] 如被拒绝，使用上述模板礼貌回复
- [ ] 必要时提供代码审计报告

---

**重要提示**：
- 深入审核可能需要 1-2 周时间，请耐心等待
- 保持礼貌和专业的沟通态度
- 强调与知名扩展的相似性
- 提供充分的技术证明和隐私保证

---

**最后更新**: 2026-01-06
