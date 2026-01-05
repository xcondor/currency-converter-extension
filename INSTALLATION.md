# 安装指南 / Installation Guide

## 安装方法 / Installation Methods

### 方法 1: 从 GitHub Releases 下载（推荐）/ Method 1: Download from GitHub Releases (Recommended)

这是最简单的安装方法，适合普通用户。

This is the easiest installation method, suitable for regular users.

#### 步骤 / Steps:

1. **下载扩展 / Download Extension**
   - 访问 [Releases 页面](https://github.com/xcondor/currency-converter-extension/releases)
   - 下载最新版本的 `currency-converter.crx` 文件

2. **打开扩展管理页面 / Open Extensions Page**
   - 在 Chrome 地址栏输入：`chrome://extensions/`
   - 或者：菜单 → 更多工具 → 扩展程序

3. **启用开发者模式 / Enable Developer Mode**
   - 打开右上角的"开发者模式"开关

4. **安装扩展 / Install Extension**
   - 将下载的 `currency-converter.crx` 文件拖拽到扩展页面
   - 点击"添加扩展程序"确认安装

5. **完成 / Done!**
   - 扩展图标会出现在浏览器工具栏
   - 点击图标打开侧边栏开始使用

> **注意 / Note**: 
> - 如果拖拽 .crx 文件无法安装，Chrome 可能阻止了外部扩展
> - 请使用方法 2 从源码安装

---

### 方法 2: 从源码安装（开发者）/ Method 2: Install from Source (Developers)

适合开发者或需要自定义的用户。

Suitable for developers or users who need customization.

#### 前置要求 / Prerequisites

- Node.js 18+ 
- npm 或 yarn
- Git

#### 步骤 / Steps:

1. **克隆仓库 / Clone Repository**
   ```bash
   git clone https://github.com/xcondor/currency-converter-extension.git
   cd currency-converter-extension
   ```

2. **安装依赖 / Install Dependencies**
   ```bash
   npm install
   ```

3. **构建项目 / Build Project**
   ```bash
   npm run build
   ```
   
   构建成功后，`dist/` 目录会包含所有必要文件。

4. **加载到 Chrome / Load into Chrome**
   - 打开 `chrome://extensions/`
   - 启用"开发者模式"（右上角开关）
   - 点击"加载已解压的扩展程序"
   - 选择项目的 `dist` 目录

5. **验证安装 / Verify Installation**
   - 扩展图标应该出现在工具栏
   - 图标为紫色渐变背景，带白色圆形和 ¥ 符号

---

## 验证安装 / Verify Installation

### 检查扩展是否正常工作 / Check if Extension Works

1. **查看图标 / Check Icon**
   - 工具栏应该显示扩展图标
   - 图标：紫色渐变 + 白色圆形 + ¥ 符号

2. **打开侧边栏 / Open Sidebar**
   - 点击扩展图标
   - 侧边栏应该从右侧滑出
   - 显示"汇率转换器"界面

3. **测试转换 / Test Conversion**
   - 访问包含货币金额的网页（如 Amazon.com）
   - 确认"自动转换"开关已打开
   - 应该看到绿色的转换标签出现在金额旁边

### 常见问题 / Common Issues

#### 问题 1: 图标不显示 / Icon Not Showing

**解决方法 / Solution:**
- 检查 `dist/icons/` 目录是否包含 PNG 图标
- 重新构建：`npm run build`
- 重新加载扩展

#### 问题 2: 无法加载扩展 / Cannot Load Extension

**解决方法 / Solution:**
- 确认已启用"开发者模式"
- 检查 `dist/` 目录是否存在
- 查看控制台错误信息

#### 问题 3: .crx 文件无法安装 / Cannot Install .crx File

**原因 / Reason:**
Chrome 可能阻止外部扩展安装

**解决方法 / Solution:**
- 使用方法 2 从源码安装
- 或者在企业/教育版 Chrome 中配置策略

#### 问题 4: 扩展已安装但不工作 / Extension Installed but Not Working

**检查清单 / Checklist:**
- [ ] 确认"自动转换"开关已打开
- [ ] 检查网络连接（需要获取汇率）
- [ ] 查看浏览器控制台是否有错误
- [ ] 尝试刷新页面

---

## 更新扩展 / Update Extension

### 从 GitHub Releases 更新 / Update from GitHub Releases

1. 下载新版本的 `.crx` 文件
2. 在 `chrome://extensions/` 中移除旧版本
3. 按照安装步骤重新安装

### 从源码更新 / Update from Source

```bash
# 拉取最新代码
git pull origin main

# 重新安装依赖（如有更新）
npm install

# 重新构建
npm run build

# 在 chrome://extensions/ 中点击"重新加载"按钮
```

---

## 卸载扩展 / Uninstall Extension

1. 打开 `chrome://extensions/`
2. 找到"实时汇率转换器"
3. 点击"移除"按钮
4. 确认卸载

---

## 系统要求 / System Requirements

### 浏览器 / Browser
- Chrome 114+
- Edge 114+ (基于 Chromium)
- 其他基于 Chromium 的浏览器

### 操作系统 / Operating System
- ✅ Windows 10/11
- ✅ macOS 10.15+
- ✅ Linux (Ubuntu, Fedora, etc.)

### 网络 / Network
- 需要互联网连接以获取汇率数据
- API: ExchangeRate-API
- 免费额度：1500 次请求/月

---

## 开发者选项 / Developer Options

### 开发模式构建 / Development Build

```bash
# 开发模式（带 source maps）
npm run dev

# 监听文件变化自动重新构建
npm run dev -- --watch
```

### 运行测试 / Run Tests

```bash
# 运行所有测试
npm test

# 监听模式
npm run test:watch

# 查看覆盖率
npm run test:coverage
```

### 生成图标 / Generate Icons

```bash
npm run generate-icons
```

---

## 获取帮助 / Get Help

如果遇到问题：

- 查看 [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- 查看 [DEBUG_GUIDE.md](DEBUG_GUIDE.md)
- 提交 [Issue](https://github.com/xcondor/currency-converter-extension/issues)

---

## 下一步 / Next Steps

安装完成后：

1. 阅读 [USAGE.md](USAGE.md) 了解如何使用
2. 配置你的首选设置
3. 开始浏览包含货币的网页
4. 享受自动转换功能！

Happy converting! 💱
