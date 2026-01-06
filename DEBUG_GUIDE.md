# 调试指南 / Debug Guide

## 如何调试货币转换问题 / How to Debug Currency Conversion Issues

### 1. 打开浏览器控制台 / Open Browser Console

在任何网页上按 `F12` 或右键点击 → "检查"

### 2. 查看初始化日志 / Check Initialization Logs

正常情况下应该看到以下日志：

```
Currency Converter Extension: Content script loaded
Currency Converter: Starting up...
- Document ready state: complete
- URL: https://example.com
Initializing currency converter...
Settings loaded: {enabled: true, baseCurrency: "CNY", ...}
Fetching exchange rates...
Rates loaded: 162 currencies
DOM observer started
Starting currency scan...
Found 245 text nodes to scan
✓ Converted 12 currency amounts
```

### 3. 常见问题诊断 / Common Issues Diagnosis

#### 问题 A: 没有看到任何日志
**可能原因:**
- Content script 未注入
- 页面是特殊页面（chrome://, file://, etc.）
- 扩展被禁用

**解决方法:**
```javascript
// 在控制台运行，检查扩展是否注入
console.log('Extension injected:', typeof chrome !== 'undefined' && chrome.runtime);
```

#### 问题 B: 看到 "Extension is disabled"
**原因:** 自动转换功能被关闭

**解决方法:**
1. 点击扩展图标打开侧边栏
2. 确认"自动转换"开关已打开

#### 问题 C: 看到 "No rates available"
**原因:** 汇率数据未加载

**解决方法:**
```javascript
// 在控制台运行，手动获取汇率
chrome.runtime.sendMessage({
  type: 'GET_RATES',
  payload: { baseCurrency: 'CNY' }
}, (response) => {
  console.log('Rates response:', response);
});
```

### 4. 手动触发扫描 / Manually Trigger Scan

```javascript
// 在控制台运行
// 通过可见性事件触发
document.dispatchEvent(new Event('visibilitychange'));
```

### 5. 检查扩展状态 / Check Extension State

```javascript
// 在控制台运行
chrome.storage.local.get(null, (data) => {
  console.log('=== Extension Storage ===');
  console.log('Settings:', data.settings);
  console.log('Language:', data.language);
  
  // 检查汇率缓存
  Object.keys(data).forEach(key => {
    if (key.startsWith('rateCache_')) {
      const cache = data[key];
      const age = Date.now() - cache.timestamp;
      const minutes = Math.floor(age / 60000);
      console.log(`${key}: ${minutes} minutes old`);
    }
  });
});
```

### 6. 查看 Service Worker 日志 / Check Service Worker Logs

1. 打开 `chrome://extensions/`
2. 找到"实时汇率转换器"
3. 点击"Service Worker"链接
4. 查看后台日志

### 7. 标签页切换调试 / Tab Switching Debug

当切换标签页时，应该看到：
```
Tab became visible, checking state...
- Initialized: true
- Enabled: true
- Has rates: true
Re-scanning page...
```

### 8. 清除所有数据重新开始 / Clear All Data and Restart

```javascript
// 在控制台运行
chrome.storage.local.clear(() => {
  console.log('Storage cleared');
  location.reload();
});
```

## 常见错误及解决方案 / Common Errors and Solutions

### Error: "Extension context invalidated"
**原因:** 扩展被重新加载
**解决:** 刷新页面或切换标签页

### Error: "Cannot read property 'sendMessage' of undefined"
**原因:** Chrome API 不可用
**解决:** 确认在正常网页（非 chrome:// 页面）

### Error: "Failed to fetch rates"
**原因:** 网络问题或 API 限制
**解决:** 检查网络连接，等待后重试

## 报告问题 / Report Issues

如果问题仍未解决，请提供以下信息：

1. **浏览器版本** - `chrome://version/`
2. **扩展版本** - 在 `chrome://extensions/` 查看
3. **问题页面 URL** - 遇到问题的网页地址
4. **控制台日志** - 完整的控制台输出
5. **扩展设置** - 当前的设置配置
6. **重现步骤** - 详细的操作步骤
