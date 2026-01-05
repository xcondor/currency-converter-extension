# 使用说明 / Usage Guide

## 快速开始 / Quick Start

### 1. 安装扩展 / Install Extension

参见 [INSTALLATION.md](INSTALLATION.md)

### 2. 首次使用 / First Time Use

1. 点击浏览器工具栏中的扩展图标 💱
2. 侧边栏会从右侧滑出
3. 确认"自动转换"开关已打开（默认开启）
4. 选择你的本地货币（默认：CNY 人民币）

### 3. 浏览网页 / Browse Web Pages

打开任何包含货币金额的网页，扩展会自动：
- 识别货币金额
- 转换为你的本地货币
- 在原金额旁边显示绿色标签

## 功能详解 / Features

### 自动转换 / Auto Conversion

**开启状态：**
- 自动扫描页面中的货币金额
- 实时显示转换结果
- 支持动态加载的内容

**关闭状态：**
- 停止自动转换
- 移除所有转换标签
- 不影响页面原始内容

### 货币选择 / Currency Selection

支持的货币：
- 🇨🇳 人民币 (CNY)
- 🇺🇸 美元 (USD)
- 🇪🇺 欧元 (EUR)
- 🇬🇧 英镑 (GBP)
- 🇯🇵 日元 (JPY)
- 🇰🇷 韩元 (KRW)
- 🇭🇰 港币 (HKD)

### 小数位数 / Decimal Places

可设置 2-4 位小数：
- **2 位** - 适合大多数货币（推荐）
- **3 位** - 更精确的转换
- **4 位** - 最高精度

### 汇率显示 / Exchange Rate Display

启用"悬停时显示汇率信息"后：
- 鼠标悬停在转换金额上
- 显示详细汇率信息
- 格式：`1 USD = 7.2345 CNY`

### 语言切换 / Language Switch

点击右上角的语言按钮：
- 中文界面显示 "EN"
- 英文界面显示 "中文"
- 点击即可切换

## 使用场景 / Use Cases

### 场景 1: 在线购物 / Online Shopping

访问国外电商网站（如 Amazon, eBay）：
```
原价格: $99.99
显示: $99.99 ≈ 719.93 CNY
```

### 场景 2: 阅读新闻 / Reading News

阅读包含金额的新闻文章：
```
原文: The company raised €50 million
显示: The company raised €50 million ≈ 390.50 CNY
```

### 场景 3: 查看报价 / Checking Quotes

查看服务报价或产品价格：
```
原价: £30/month
显示: £30/month ≈ 270.15 CNY
```

### 场景 4: 社交媒体 / Social Media

浏览 Twitter, Reddit 等社交媒体：
```
原帖: Just bought a new phone for $799
显示: Just bought a new phone for $799 ≈ 5,752.27 CNY
```

## 高级功能 / Advanced Features

### 动态内容支持 / Dynamic Content

扩展自动处理：
- AJAX 加载的内容
- 无限滚动页面
- 单页应用 (SPA)
- 实时更新的价格

### 标签页切换 / Tab Switching

切换标签页时：
- 自动重新扫描页面
- 更新转换结果
- 确保显示最新汇率

### 缓存机制 / Caching

汇率数据缓存 1 小时：
- 减少 API 请求
- 提高响应速度
- 节省网络流量

## 快捷操作 / Quick Actions

### 清除缓存 / Clear Cache

点击"清除缓存"按钮：
- 删除所有缓存的汇率数据
- 下次访问时重新获取
- 用于强制更新汇率

### 查看状态 / Check Status

侧边栏显示：
- 汇率状态（最新/已过期）
- 最后更新时间
- 缓存状态

## 常见问题 / FAQ

### Q: 为什么有些金额没有转换？

**A:** 可能的原因：
1. 金额格式不被识别
2. 金额已经是目标货币
3. 页面使用了特殊格式

**解决方法：**
- 检查金额格式是否标准
- 查看控制台日志
- 参考 [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

### Q: 转换结果不准确？

**A:** 可能的原因：
1. 汇率缓存过期
2. API 数据延迟

**解决方法：**
- 点击"清除缓存"
- 等待自动更新（每小时）

### Q: 如何禁用特定网站？

**A:** 目前版本：
- 使用"自动转换"开关临时禁用
- 未来版本将支持网站白名单/黑名单

### Q: 支持哪些货币格式？

**A:** 支持的格式：
- 符号：`$`, `€`, `£`, `¥`, `￥`, `R`
- ISO 代码：`USD`, `EUR`, `GBP`, `CNY`, 等
- 中文：`元`, `人民币`
- 数字格式：`1,234.56` 或 `1 234.56`

### Q: 如何查看详细汇率？

**A:** 两种方法：
1. 启用"悬停时显示汇率信息"
2. 鼠标悬停在转换金额上

### Q: 扩展会影响页面性能吗？

**A:** 不会：
- 使用防抖延迟（500ms）
- 只扫描文本节点
- 跳过脚本和样式标签
- 智能缓存机制

## 最佳实践 / Best Practices

### 1. 选择合适的本地货币

根据你的主要使用场景选择：
- 日常购物 → 本国货币
- 国际贸易 → USD
- 欧洲业务 → EUR

### 2. 合理设置小数位数

根据货币特点设置：
- 大额货币（USD, EUR）→ 2 位
- 小额货币（JPY, KRW）→ 0 位
- 精确计算 → 4 位

### 3. 定期清除缓存

建议：
- 每周清除一次
- 汇率波动大时清除
- 发现数据异常时清除

### 4. 启用汇率显示

好处：
- 了解转换依据
- 验证结果准确性
- 学习汇率知识

## 键盘快捷键 / Keyboard Shortcuts

目前版本暂不支持键盘快捷键。

未来版本计划：
- `Alt+C` - 开关自动转换
- `Alt+R` - 刷新汇率
- `Alt+L` - 切换语言

## 更新日志 / Changelog

查看 [CHANGELOG.md](CHANGELOG.md) 了解最新更新。

## 反馈与支持 / Feedback & Support

遇到问题？
- 查看 [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- 查看 [DEBUG_GUIDE.md](DEBUG_GUIDE.md)
- 提交 [Issue](https://github.com/xcondor/currency-converter-extension/issues)

有建议？
- 提交 [Feature Request](https://github.com/xcondor/currency-converter-extension/issues/new)
- 参与 [Discussions](https://github.com/xcondor/currency-converter-extension/discussions)

## 相关文档 / Related Documentation

- [安装指南](INSTALLATION.md)
- [项目结构](PROJECT_STRUCTURE.md)
- [贡献指南](CONTRIBUTING.md)
- [UI 设计](UI_DESIGN.md)
- [多语言支持](LANGUAGE_SUPPORT.md)
