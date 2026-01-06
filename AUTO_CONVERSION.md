# 自动转换功能说明 / Auto Conversion Feature

## 功能概述 / Overview

插件支持全自动的货币转换，无论在什么场景下都能智能识别和转换页面中的金额。

The extension supports fully automatic currency conversion, intelligently recognizing and converting amounts on pages in any scenario.

## 支持的场景 / Supported Scenarios

### 1. 页面首次加载 / Initial Page Load
✅ 页面加载完成后自动扫描并转换
- 监听 `DOMContentLoaded` 事件
- 支持同步和异步加载的内容

### 2. 新标签页 / New Tab
✅ 打开新标签页时自动工作
- Content script 自动注入
- 立即初始化并扫描

### 3. 标签页切换 / Tab Switching
✅ 切换回标签页时重新扫描
- 监听 `visibilitychange` 事件
- 标签页变为可见时自动更新

### 4. 动态内容加载 / Dynamic Content
✅ 页面动态加载的内容自动转换
- 使用 `MutationObserver` 监听 DOM 变化
- 500ms 防抖延迟，避免频繁扫描
- 支持 AJAX、SPA 等动态内容

### 5. 扩展重载 / Extension Reload
✅ 扩展重载后无需刷新页面
- Background 通知所有标签页
- Content script 自动重新初始化

### 6. 设置变更 / Settings Change
✅ 修改设置后立即生效
- 监听 `chrome.storage.onChanged`
- 自动重新扫描和转换

## 技术实现 / Technical Implementation

### 初始化流程 / Initialization Flow

```
1. Content Script 加载
   ↓
2. 检查页面加载状态
   ↓
3. 加载用户设置和语言
   ↓
4. 获取汇率数据
   ↓
5. 扫描页面并转换
   ↓
6. 开始监听各种事件
```

### 事件监听 / Event Listeners

#### 1. 页面可见性监听
```typescript
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    scanAndConvert();
  }
});
```

**触发时机:**
- 切换到该标签页
- 最小化窗口后恢复
- 从其他应用切换回浏览器

#### 2. DOM 变化监听
```typescript
const observer = new MutationObserver((mutations) => {
  if (hasNewContent) {
    setTimeout(() => scanAndConvert(), 500);
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
  characterData: true
});
```

**触发时机:**
- 新元素添加到页面
- 元素被移除
- 文本内容改变
- AJAX 加载完成

#### 3. 设置变化监听
```typescript
chrome.storage.onChanged.addListener((changes) => {
  if (changes.settings) {
    updateSettings();
    scanAndConvert();
  }
});
```

**触发时机:**
- 修改本地货币
- 修改小数位数
- 启用/禁用转换
- 切换语言

### 性能优化 / Performance Optimization

#### 1. 防抖处理 (Debounce)
```typescript
clearTimeout(window.currencyConverterDebounce);
window.currencyConverterDebounce = setTimeout(() => {
  scanAndConvert();
}, 500);
```

**作用:**
- 避免频繁扫描
- 减少 CPU 使用
- 提高响应速度

#### 2. 处理中标志 (Processing Flag)
```typescript
if (isProcessing) return;
isProcessing = true;
// ... 扫描逻辑
isProcessing = false;
```

**作用:**
- 防止并发扫描
- 避免重复处理
- 保证数据一致性

#### 3. 智能节点过滤
```typescript
acceptNode: (node) => {
  // 跳过 script、style 标签
  // 跳过已有覆盖层的元素
  // 只处理有内容的文本节点
}
```

**作用:**
- 减少扫描范围
- 提高扫描速度
- 避免重复转换

## 使用场景示例 / Usage Examples

### 场景 1: 浏览电商网站
```
1. 打开 Amazon.com
2. 插件自动扫描价格 ($99.99)
3. 显示转换后的金额 (719.93 CNY)
4. 滚动页面加载更多商品
5. 新商品价格自动转换
```

### 场景 2: 阅读新闻文章
```
1. 打开新闻网站
2. 文章中的金额自动转换
3. 点击"加载更多评论"
4. 评论中的金额也自动转换
```

### 场景 3: 使用 SPA 应用
```
1. 打开 React/Vue 应用
2. 初始页面金额转换
3. 点击导航切换页面（无刷新）
4. 新页面内容自动转换
```

## 调试信息 / Debug Information

### 控制台日志 / Console Logs

```javascript
// 初始化
"Currency Converter Extension: Content script loaded"

// 扫描完成
"✓ Converted X currency amounts"

// 标签页切换
"Tab became visible, re-scanning..."

// DOM 变化
"DOM changed, re-scanning..."
```

## 常见问题 / FAQ

### Q1: 为什么有些动态内容没有转换？
**A:** 可能是以下原因：
- 内容在 iframe 中（需要单独注入）
- 内容是图片形式的文字
- 防抖延迟还未触发（等待 500ms）

### Q2: 切换标签页后为什么要重新扫描？
**A:** 因为：
- 页面可能在后台发生了变化
- 汇率可能已更新
- 确保显示最新的转换结果

### Q3: 会不会影响页面性能？
**A:** 不会，因为：
- 使用防抖延迟（500ms）
- 只扫描文本节点
- 跳过 script、style 等标签
- 有处理中标志防止并发

## 技术栈 / Tech Stack

- TypeScript
- Chrome Extension Manifest V3
- MutationObserver API
- Visibility API
- Chrome Storage API
- Chrome Runtime Messaging
