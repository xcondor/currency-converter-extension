# 修复悬停显示汇率功能（第二版 - 解决 overflow:hidden 问题）

## 问题描述

### 第一版问题
用户将鼠标悬停在转换标签上时，没有显示详细的汇率信息。

### 第二版问题
添加了 tooltip 后，部分汇率信息被某些 `overflow: hidden` 属性的父元素挡住了。

## 根本原因

### 第一版
`insertOverlayAfterElement` 函数只添加了简单的悬停效果，但没有创建 tooltip。

### 第二版（overflow:hidden 问题）
Tooltip 使用 `position: absolute` 并作为覆盖层的子元素，当父元素有 `overflow: hidden` 时，tooltip 会被裁剪。

**CSS 层叠上下文问题**：
```html
<div style="overflow: hidden">  <!-- 父元素 -->
  <span>$100</span>
  <span class="currency-converter-overlay">  <!-- 覆盖层 -->
    ≈ 85.73 EUR
    <div class="tooltip" style="position: absolute">  <!-- 被裁剪！ -->
      1 USD = 0.8573 EUR
    </div>
  </span>
</div>
```

## 解决方案（第二版）

### 1. 将 Tooltip 添加到 document.body
不将 tooltip 作为覆盖层的子元素，而是直接添加到 `document.body`：

```typescript
tooltip.textContent = rateText;
document.body.appendChild(tooltip); // 添加到 body，避免被父元素裁剪
```

### 2. 使用 position: fixed
使用 `position: fixed` 而不是 `absolute`，相对于视口定位：

```typescript
tooltip.style.cssText = `
  position: fixed;  /* 相对于视口，不受父元素影响 */
  /* ... */
  z-index: 2147483647;  /* 最大 z-index，确保在最上层 */
`;
```

### 3. 动态计算位置
使用 `getBoundingClientRect()` 动态计算 tooltip 位置：

```typescript
const updateTooltipPosition = () => {
  const rect = overlayElement.getBoundingClientRect();
  const tooltipRect = tooltip.getBoundingClientRect();
  
  // 计算位置：在覆盖层上方居中
  let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
  let top = rect.top - tooltipRect.height - 8;
  
  // 防止超出屏幕
  if (left < 10) left = 10;
  if (left + tooltipRect.width > window.innerWidth - 10) {
    left = window.innerWidth - tooltipRect.width - 10;
  }
  if (top < 10) {
    top = rect.bottom + 8; // 显示在下方
  }
  
  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${top}px`;
};
```

### 4. 监听滚动和窗口大小变化
当页面滚动或窗口大小改变时，更新 tooltip 位置：

```typescript
window.addEventListener('scroll', updatePositionOnScroll, { passive: true });
window.addEventListener('resize', updatePositionOnScroll, { passive: true });
```

### 5. 清理 Tooltip
使用 `MutationObserver` 监听覆盖层被移除，同时移除 tooltip：

```typescript
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.removedNodes.forEach((node) => {
      if (node === overlayElement) {
        tooltip.remove();
        window.removeEventListener('scroll', updatePositionOnScroll);
        window.removeEventListener('resize', updatePositionOnScroll);
        observer.disconnect();
      }
    });
  });
});
```

## 修改的文件
- `src/content.ts` - `insertOverlayAfterElement()` 函数

## 测试步骤

### 1. 重新加载扩展
1. 打开 `chrome://extensions/`
2. 找到 Currency Converter 扩展
3. 点击刷新按钮 🔄

### 2. 测试悬停显示
1. 访问任意包含价格的网站（如 Amazon.com）
2. 找到一个转换标签（绿色的 `≈ X.XX EUR`）
3. 将鼠标悬停在转换标签上
4. 确认：
   - ✅ 显示一个黑色的 tooltip
   - ✅ Tooltip 显示汇率信息（例如 `1 USD = 0.8573 EUR`）
   - ✅ Tooltip 位于转换标签上方
   - ✅ 移开鼠标后 tooltip 消失

### 3. 测试不同汇率
测试不同的货币对，确认汇率显示正确：

**汇率 >= 1 的情况**：
- `$100` → `≈ 724.50 CNY`
- 悬停显示：`1 USD = 7.2450 CNY`

**汇率 < 1 的情况**：
- `¥100` → `≈ 13.81 USD`
- 悬停显示：`1 USD = 7.2450 CNY`（显示倒数）

### 4. 检查样式
确认 tooltip 样式正确：
- ✅ 黑色半透明背景
- ✅ 白色文字
- ✅ 圆角边框
- ✅ 阴影效果
- ✅ 平滑的淡入淡出动画

## 预期结果
✅ 悬停在转换标签上显示 tooltip
✅ Tooltip 显示详细的汇率信息
✅ 汇率格式化为易读的形式
✅ 平滑的动画效果
✅ 鼠标移开后 tooltip 消失

## 用户体验改进
- **信息透明**：用户可以看到具体的汇率
- **易于理解**：汇率格式化为易读的形式
- **不干扰浏览**：tooltip 只在悬停时显示
- **视觉美观**：黑色半透明背景，与页面融合

## 技术细节

### Tooltip 定位
使用 `position: absolute` 和 `transform` 实现居中定位：
```css
position: absolute;
bottom: 100%;           /* 位于父元素上方 */
left: 50%;              /* 水平居中 */
transform: translateX(-50%) translateY(-8px); /* 精确居中并上移 8px */
```

### 防止 Tooltip 干扰
使用 `pointer-events: none` 防止 tooltip 干扰鼠标事件：
```css
pointer-events: none;   /* 鼠标事件穿透 tooltip */
```

### 动画效果
使用 CSS `transition` 实现平滑的淡入淡出：
```css
opacity: 0;             /* 初始隐藏 */
transition: opacity 0.2s ease; /* 0.2 秒淡入淡出 */
```

### 汇率精度
显示 4 位小数，确保精度：
```typescript
result.rate.toFixed(4)  // 例如：0.8573
```

## 相关功能
- 转换标签样式
- 悬停效果
- 汇率计算

## 未来改进
可以考虑添加更多信息到 tooltip：
- 汇率更新时间
- 汇率来源（ExchangeRate-API）
- 原始金额和转换后金额

---

**最后更新**: 2026-01-09
**适用版本**: v1.0.2
