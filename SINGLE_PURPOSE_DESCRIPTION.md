# Chrome 应用商店 - 单一用途说明

## 📋 什么是"单一用途"？

Chrome 应用商店要求扩展程序必须有**足够具体且易于理解的单一用途**。这意味着：
- 扩展只做一件事情
- 功能描述清晰明确
- 不包含无关的功能

---

## ✅ 推荐填写内容

### 中文版本（简洁版）
```
自动检测网页中的货币金额并转换为用户的本地货币。
```

### 中文版本（详细版）
```
自动检测网页中的货币金额（如 $100、€50、¥1000）并实时转换为用户设置的本地货币，帮助用户快速了解商品价格、新闻数据等货币信息的实际价值。
```

### 英文版本（简洁版）
```
Automatically detect and convert currency amounts on web pages to user's local currency.
```

### 英文版本（详细版）
```
Automatically detect currency amounts (like $100, €50, ¥1000) on web pages and convert them in real-time to the user's preferred local currency, helping users quickly understand the actual value of prices, financial data, and other monetary information.
```

---

## 🎯 单一用途的核心要点

### 我们的扩展的单一用途是：
**货币转换** - Currency Conversion

### 具体功能包括：
1. ✅ 检测网页中的货币金额
2. ✅ 转换为用户的本地货币
3. ✅ 显示转换结果
4. ✅ 设置本地货币和转换选项

### 不包括的功能：
- ❌ 广告拦截
- ❌ 网页修改（除了显示转换结果）
- ❌ 数据收集
- ❌ 社交分享
- ❌ 其他无关功能

---

## 📝 填写建议

### 字符限制
- 通常限制在 **140-280 字符**
- 建议使用简洁版本（约 50-100 字符）

### 语言选择
- **中文用户**：使用中文版本
- **国际用户**：使用英文版本
- **混合市场**：优先使用英文版本

### 推荐方案

#### 方案 1：超简洁（推荐）
```
自动转换网页货币为本地货币
```
或
```
Automatically convert web page currencies to local currency
```

#### 方案 2：简洁明确
```
检测并转换网页中的货币金额为用户的本地货币
```
或
```
Detect and convert currency amounts on web pages to user's local currency
```

#### 方案 3：详细说明
```
自动检测网页中的货币符号（$、€、£、¥等）和金额，实时转换为用户设置的本地货币并显示在原价格旁边
```
或
```
Automatically detect currency symbols ($, €, £, ¥, etc.) and amounts on web pages, convert them in real-time to user's local currency and display next to original prices
```

---

## 🔍 审核要点

Chrome 应用商店审核团队会检查：

### ✅ 符合单一用途的标准
- 功能描述清晰
- 只做货币转换这一件事
- 所有功能都围绕货币转换展开

### ✅ 权限使用合理
- `storage`：存储用户设置和汇率缓存
- `sidePanel`：显示设置面板
- `<all_urls>`：在所有网站上检测货币

### ✅ 不包含误导性内容
- 不承诺无法实现的功能
- 不包含广告或推广内容
- 不收集用户数据

---

## 📋 完整表单填写示例

### 单一用途（Single Purpose）
```
自动检测网页中的货币金额并转换为用户的本地货币
```

### 权限说明（Permissions Justification）
参考 `PERMISSION_JUSTIFICATION.md` 文件中的内容：
1. storage 权限：存储用户设置和汇率缓存
2. sidePanel 权限：显示设置控制面板
3. <all_urls> 权限：在所有网站上检测和转换货币

---

## 🎨 与扩展名称和描述的一致性

### 扩展名称
```
Currency Converter - 货币转换器
```

### 简短描述（Short Description）
```
自动检测并转换网页中的货币金额为您的本地货币
Automatically detect and convert currency amounts to your local currency
```

### 详细描述（Detailed Description）
参考 `STORE_DESCRIPTION.md` 文件

### 单一用途（Single Purpose）
```
自动转换网页货币为本地货币
Automatically convert web page currencies to local currency
```

**关键**：确保这三个描述**一致且相互呼应**，都围绕"货币转换"这一核心功能。

---

## ⚠️ 常见错误

### ❌ 错误示例 1：过于宽泛
```
帮助用户浏览网页
Help users browse web pages
```
**问题**：太宽泛，不够具体

### ❌ 错误示例 2：包含多个用途
```
货币转换、价格比较、购物助手
Currency conversion, price comparison, shopping assistant
```
**问题**：包含多个不同的功能

### ❌ 错误示例 3：过于技术化
```
使用 ExchangeRate-API 获取实时汇率并通过 DOM 操作在网页上显示转换结果
Fetch real-time exchange rates via ExchangeRate-API and display conversion results through DOM manipulation
```
**问题**：过于技术化，用户难以理解

### ✅ 正确示例
```
自动转换网页货币为本地货币
Automatically convert web page currencies to local currency
```
**优点**：简洁、清晰、易懂

---

## 🚀 提交前检查清单

- [ ] 单一用途描述清晰明确
- [ ] 字符数在限制范围内（通常 140-280 字符）
- [ ] 与扩展名称和描述一致
- [ ] 只描述一个核心功能（货币转换）
- [ ] 语言通俗易懂，避免技术术语
- [ ] 没有包含无关功能
- [ ] 没有误导性内容

---

## 📞 需要帮助？

如果审核被拒，常见原因：

1. **单一用途不够明确**
   - 使用更简洁的描述
   - 去掉所有修饰词，只保留核心功能

2. **描述与实际功能不符**
   - 确保描述准确反映扩展功能
   - 不要夸大或遗漏重要功能

3. **包含多个用途**
   - 只描述货币转换这一个功能
   - 设置面板、缓存管理等都是辅助功能，不需要在单一用途中提及

---

## 🎯 最终推荐

### 中文版本（推荐）
```
自动检测并转换网页中的货币金额为用户的本地货币
```
**字符数**：26 字符

### 英文版本（推荐）
```
Automatically detect and convert currency amounts to user's local currency
```
**字符数**：78 字符

这两个版本：
- ✅ 简洁明确
- ✅ 易于理解
- ✅ 符合单一用途要求
- ✅ 与扩展功能一致

---

**最后更新**: 2026-01-09
**适用版本**: v1.0.2
