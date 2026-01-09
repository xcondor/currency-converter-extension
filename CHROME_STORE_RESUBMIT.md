# Chrome Web Store 重新提交指南

## 问题总结

**拒绝原因**：请求但未使用 `notifications` 权限

**违规行为参考 ID**：Purple Potassium

## 已修复的问题

### ✅ 移除未使用的权限

**修改文件**：`currency-converter/manifest.json`

**修改前**：
```json
"permissions": [
  "storage",
  "notifications",  ← 未使用，已移除
  "sidePanel"
]
```

**修改后**：
```json
"permissions": [
  "storage",
  "sidePanel"
]
```

### ✅ 更新版本号

- 从 `1.0.0` → `1.0.1`

## 当前使用的权限说明

### 1. `storage`
**用途**：存储用户设置和汇率缓存
- 保存用户的本地货币设置
- 保存小数位数设置
- 缓存汇率数据（1小时）
- 保存语言偏好

**代码位置**：
- `src/background.ts` - 汇率缓存
- `src/popup.ts` - 设置保存
- `src/content.ts` - 读取设置

### 2. `sidePanel`
**用途**：显示侧边栏设置面板
- 用户点击插件图标时打开侧边栏
- 在侧边栏中配置货币转换设置

**代码位置**：
- `public/popup.html` - 侧边栏界面
- `src/popup.ts` - 侧边栏逻辑

### 3. `host_permissions: ["https://v6.exchangerate-api.com/*"]`
**用途**：获取实时汇率数据
- 从 ExchangeRate-API 获取最新汇率
- 每小时更新一次

**代码位置**：
- `src/background.ts` - `fetchFromAPI()` 函数

## 重新打包步骤

### 1. 确认修改
```bash
# 检查 manifest.json
cat currency-converter/manifest.json | grep permissions -A 3
```

应该看到：
```json
"permissions": [
  "storage",
  "sidePanel"
],
```

### 2. 重新构建
```bash
npm run build
```

### 3. 复制文件到 currency-converter
```bash
cp dist/background.js dist/content.js dist/popup.js currency-converter/
```

### 4. 使用 Chrome 打包
1. 打开 `chrome://extensions/`
2. 启用"开发者模式"
3. 点击"打包扩展程序"
4. 选择 `currency-converter` 文件夹
5. 生成新的 `.crx` 文件

### 5. 创建 ZIP 文件
```bash
cd currency-converter
zip -r ../currency-converter-v1.0.1.zip .
cd ..
```

## 提交到 Chrome Web Store
通
### 1. 登录开发者控制台
https://chrome.google.com/webstore/devconsole

### 2. 找到你的扩展
产品 ID：`neomfejkmmmabibmgafebeichnllmkba`

### 3. 上传新版本
- 点击"上传新版本"
- 上传 `currency-converter-v1.0.1.zip`
- 填写更新说明

### 4. 更新说明（建议）

**中文**：
```
版本 1.0.1 更新内容：

修复：
- 移除了未使用的 notifications 权限
- 优化了权限使用，仅保留必需的权限

改进：
- 优化了货币检测算法
- 改进了转换标签的显示效果
- 修复了部分网站金额无法识别的问题
```

**英文**：
```
Version 1.0.1 Updates:

Fixes:
- Removed unused notifications permission
- Optimized permission usage to only include necessary permissions

Improvements:
- Improved currency detection algorithm
- Enhanced conversion badge display
- Fixed issues with currency detection on some websites
```

## 权限使用证明

如果审核团队要求提供权限使用证明，可以提供以下说明：

### storage 权限
**截图位置**：设置面板
**说明**：用于保存用户的货币偏好设置和缓存汇率数据

### sidePanel 权限
**截图位置**：点击插件图标后的侧边栏
**说明**：用于显示设置面板，让用户配置转换选项

### host_permissions
**说明**：用于从 ExchangeRate-API 获取实时汇率数据
**API 文档**：https://www.exchangerate-api.com/docs/overview

## 检查清单

提交前请确认：

- [ ] `currency-converter/manifest.json` 中没有 `notifications` 权限
- [ ] 版本号已更新为 `1.0.1`
- [ ] 所有文件已重新构建
- [ ] 在本地 Chrome 中测试过新版本
- [ ] 所有功能正常工作
- [ ] 创建了新的 ZIP 文件
- [ ] 准备好更新说明

## 预期审核时间

- 首次审核：1-3 个工作日
- 重新审核：通常更快，1-2 个工作日

## 如果再次被拒

1. 仔细阅读拒绝原因
2. 检查是否还有其他未使用的权限
3. 确保所有权限都有明确的使用场景
4. 可以在审核反馈中解释每个权限的用途

## 联系方式

如果有疑问，可以通过以下方式联系 Chrome Web Store 支持：
- 开发者控制台中的"支持"选项
- Chrome Web Store 开发者论坛

---

祝你审核顺利！🎉
