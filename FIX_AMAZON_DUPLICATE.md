# 修复 Amazon 重复转换问题

## 问题描述
Amazon 的价格显示了两次转换标签，例如 `$2,495.00` 后面显示两个 `≈ 2,139.24 EUR`。

## 原始 HTML 结构
```html
<span class="a-price a-text-price">
  <span class="a-offscreen">$2,495.00</span>
  <span aria-hidden="true">$2,495.00</span>
</span>
```

## 转换后的错误结构
```html
<span class="a-price a-text-price">
  <span class="a-offscreen">$2,495.00</span>
  <span class="currency-converter-overlay">≈ 2,139.24 EUR</span>
  <span aria-hidden="true">$2,495.00</span>
  <span class="currency-converter-overlay">≈ 2,139.24 EUR</span>
</span>
```

## 根本原因
Amazon 使用两个 `<span>` 元素显示同一个价格：
1. `<span class="a-offscreen">` - 隐藏的，用于屏幕阅读器
2. `<span aria-hidden="true">` - 可见的，用于显示

这两个元素：
- 是兄弟关系（不是父子关系）
- 包含相同的价格文本
- 都被我们的选择器选中
- 在同一次 `forEach` 循环中处理

之前的去重逻辑只检查了父子关系，没有检查兄弟关系，导致两个元素都被处理。

## 解决方案

### 在 `findCurrencyElements()` 中添加兄弟元素去重
在元素选择阶段就过滤掉重复的兄弟元素：

```typescript
// 检查兄弟元素：如果有相同父元素的兄弟包含相同的价格文本，只保留第一个
if (!toRemove.has(element) && element.parentElement) {
  const siblings = elements.filter(other => 
    other !== element && 
    !toRemove.has(other) &&
    other.parentElement === element.parentElement
  );
  
  if (siblings.length > 0) {
    const elementPrice = element.textContent?.match(/[$¥￥€£₹₽₩]\s*[\d,]+\.?\d*/)?.[0];
    
    if (elementPrice) {
      siblings.forEach(sibling => {
        const siblingPrice = sibling.textContent?.match(/[$¥￥€£₹₽₩]\s*[\d,]+\.?\d*/)?.[0];
        
        // 如果兄弟元素包含相同的价格，移除后面的（保留第一个）
        if (siblingPrice === elementPrice) {
          const position = element.compareDocumentPosition(sibling);
          if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
            toRemove.add(sibling);
          }
        }
      });
    }
  }
}
```

### 去重逻辑
1. **父子关系去重**：如果父元素和子元素都包含价格，移除父元素
2. **兄弟关系去重**：如果兄弟元素包含相同的价格，只保留第一个（按 DOM 顺序）

### 使用 `compareDocumentPosition` API
```typescript
const position = element.compareDocumentPosition(sibling);
if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
  // sibling 在 element 后面，移除 sibling
}
```

## 修改的文件
- `src/content.ts` - `findCurrencyElements()` 函数

## 测试步骤

### 1. 重新加载扩展
1. 打开 `chrome://extensions/`
2. 找到 Currency Converter 扩展
3. 点击刷新按钮 🔄

### 2. 测试 Amazon
1. 访问 https://www.amazon.com/
2. 搜索任意商品（例如 "laptop"）
3. 检查商品列表中的价格
4. 确认：
   - ✅ 每个价格只显示一个转换标签
   - ✅ 没有重复的转换标签
   - ✅ 控制台显示 `Removing duplicate sibling with same price`

### 3. 检查控制台日志
打开浏览器控制台（F12），应该看到：
```
Removing duplicate sibling with same price "$2,495.00": SPAN
Deduplication: removed 15 elements (parents + duplicate siblings), kept 45 elements
```

### 4. 检查 HTML 结构
在浏览器开发者工具中检查价格元素，应该只有一个 `currency-converter-overlay`：
```html
<span class="a-price a-text-price">
  <span class="a-offscreen">$2,495.00</span>
  <span class="currency-converter-overlay">≈ 2,139.24 EUR</span>
  <span aria-hidden="true">$2,495.00</span>
</span>
```

## 预期结果
✅ Amazon 价格只显示一个转换标签
✅ 兄弟元素不会重复处理
✅ 父子元素不会重复处理
✅ 控制台显示去重日志
✅ 页面不会闪烁

## 技术细节

### 为什么在 `findCurrencyElements()` 中去重？
- 在元素选择阶段去重，避免后续处理重复元素
- 减少不必要的检测和转换操作
- 提高性能

### 为什么使用 `compareDocumentPosition`？
- 准确判断元素在 DOM 中的相对位置
- 确保保留第一个元素，移除后面的元素
- 标准 DOM API，兼容性好

### Amazon 特定的价格结构
Amazon 使用多个元素显示价格是为了：
- 可访问性：`a-offscreen` 用于屏幕阅读器
- 显示：`aria-hidden="true"` 用于视觉显示
- SEO：搜索引擎可以读取隐藏的价格

## 相关修复
- `DUPLICATE_OVERLAY_FIX.md` - 修复重复覆盖层问题
- `FIX_PURCHASE_COUNT.md` - 修复购买人数被误识别
- `TEST_DUPLICATE_FIX.md` - 测试指南
