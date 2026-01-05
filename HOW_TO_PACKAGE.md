# 如何打包 Chrome 扩展 / How to Package Chrome Extension

## 打包 .crx 文件 / Package .crx File

### 方法 1: 使用 Chrome 浏览器打包（推荐）/ Method 1: Package with Chrome Browser (Recommended)

这是最简单和官方推荐的方法。

This is the easiest and officially recommended method.

#### 步骤 / Steps:

1. **构建项目 / Build Project**
   ```bash
   npm run build
   ```

2. **打开扩展管理页面 / Open Extensions Page**
   - 访问 `chrome://extensions/`
   - 启用"开发者模式"

3. **打包扩展 / Package Extension**
   - 点击"打包扩展程序"按钮
   - 在"扩展程序根目录"中选择 `dist` 目录
   - 如果是首次打包，"私钥文件"留空
   - 点击"打包扩展程序"

4. **获取文件 / Get Files**
   Chrome 会生成两个文件：
   - `dist.crx` - 扩展包文件
   - `dist.pem` - 私钥文件（**重要：妥善保管！**）

5. **重命名文件 / Rename File**
   ```bash
   mv dist.crx currency-converter.crx
   ```

6. **保存私钥 / Save Private Key**
   ```bash
   # 将私钥移到安全位置（不要提交到 Git）
   mv dist.pem currency-converter.pem
   ```

> **⚠️ 重要提示 / Important:**
> - `.pem` 私钥文件必须妥善保管
> - 更新扩展时需要使用相同的私钥
> - 不要将私钥提交到 Git 仓库
> - 建议备份到安全的地方

---

### 方法 2: 使用命令行工具 / Method 2: Using Command Line Tools

#### 使用 Chrome CLI（需要安装）

```bash
# 安装 chrome-cli（macOS）
brew install chrome-cli

# 打包扩展
chrome-cli pack dist/
```

#### 使用 crx3（Node.js 工具）

```bash
# 安装 crx3
npm install -g crx3

# 打包扩展
crx3 dist/ -o currency-converter.crx
```

---

## 更新已打包的扩展 / Update Packaged Extension

### 使用现有私钥 / Using Existing Private Key

1. **构建新版本 / Build New Version**
   ```bash
   npm run build
   ```

2. **使用私钥打包 / Package with Private Key**
   - 访问 `chrome://extensions/`
   - 点击"打包扩展程序"
   - 扩展程序根目录：选择 `dist`
   - 私钥文件：选择之前保存的 `.pem` 文件
   - 点击"打包扩展程序"

3. **重命名新文件 / Rename New File**
   ```bash
   mv dist.crx currency-converter.crx
   ```

> **注意 / Note:** 使用相同的私钥可以确保扩展 ID 不变，用户可以直接更新而不需要重新安装。

---

## 验证 .crx 文件 / Verify .crx File

### 检查文件 / Check File

```bash
# 查看文件大小
ls -lh currency-converter.crx

# 应该在 50KB - 500KB 之间
```

### 测试安装 / Test Installation

1. 打开新的 Chrome 窗口（隐身模式）
2. 访问 `chrome://extensions/`
3. 启用"开发者模式"
4. 将 `.crx` 文件拖拽到页面
5. 确认可以正常安装和使用

---

## 发布到 GitHub Releases / Publish to GitHub Releases

### 准备文件 / Prepare Files

```bash
# 确保文件存在
ls -lh currency-converter.crx

# 可选：创建 zip 包（包含源码）
cd dist
zip -r ../currency-converter-source.zip .
cd ..
```

### 创建 Release / Create Release

1. 访问 GitHub 仓库
2. 点击 "Releases" → "Create a new release"
3. 填写版本信息：
   - Tag: `v1.0.0`
   - Title: `v1.0.0 - Initial Release`
   - Description: 参考 CHANGELOG.md

4. **上传文件 / Upload Files:**
   - `currency-converter.crx` - 主要安装文件
   - `currency-converter-source.zip` - 源码包（可选）

5. 点击 "Publish release"

---

## 文件管理 / File Management

### 应该提交到 Git 的文件 / Files to Commit to Git

✅ 应该提交：
- `src/` - 源代码
- `public/` - 静态资源
- `package.json` - 依赖配置
- `README.md` - 文档
- 其他配置文件

❌ 不应该提交：
- `dist/` - 构建输出
- `*.crx` - 扩展包
- `*.pem` - 私钥文件
- `node_modules/` - 依赖包

### .gitignore 配置 / .gitignore Configuration

确保 `.gitignore` 包含：

```gitignore
# Build output
dist/

# Chrome extension packages
*.crx
*.pem
*.zip

# Dependencies
node_modules/
```

---

## 安全最佳实践 / Security Best Practices

### 私钥管理 / Private Key Management

1. **备份私钥 / Backup Private Key**
   ```bash
   # 备份到安全位置
   cp currency-converter.pem ~/secure-backup/
   ```

2. **加密存储 / Encrypted Storage**
   - 使用密码管理器
   - 使用加密的云存储
   - 不要存储在公共位置

3. **团队协作 / Team Collaboration**
   - 只有发布管理员持有私钥
   - 使用 CI/CD 自动化打包
   - 私钥存储在 GitHub Secrets

### API 密钥安全 / API Key Security

在发布前检查：

```bash
# 搜索可能的 API 密钥
grep -r "API_KEY" src/

# 确保没有硬编码的敏感信息
grep -r "password\|secret\|token" src/
```

---

## 自动化打包 / Automated Packaging

### 使用 npm 脚本 / Using npm Scripts

在 `package.json` 中添加：

```json
{
  "scripts": {
    "build": "webpack --mode production",
    "package": "npm run build && echo 'Please package manually in Chrome'",
    "release": "npm run build && npm test"
  }
}
```

### 使用 GitHub Actions / Using GitHub Actions

创建 `.github/workflows/release.yml`:

```yaml
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - run: zip -r currency-converter-source.zip dist/
      - uses: softprops/action-gh-release@v1
        with:
          files: currency-converter-source.zip
```

---

## 常见问题 / FAQ

### Q: 为什么需要私钥文件？

**A:** 私钥用于：
- 保持扩展 ID 不变
- 允许用户直接更新
- 验证扩展来源

### Q: 丢失私钥怎么办？

**A:** 如果丢失私钥：
- 无法更新现有扩展
- 需要创建新的扩展 ID
- 用户需要重新安装

### Q: .crx 文件可以直接分享吗？

**A:** 可以，但：
- 用户需要启用"开发者模式"
- Chrome 可能显示安全警告
- 建议通过 GitHub Releases 分发

### Q: 如何减小 .crx 文件大小？

**A:** 优化方法：
- 移除 source maps（生产构建）
- 压缩图片资源
- 移除未使用的依赖
- 使用 webpack 优化

---

## 检查清单 / Checklist

发布前检查：

- [ ] 代码已构建：`npm run build`
- [ ] 测试已通过：`npm test`
- [ ] 版本号已更新：`package.json` 和 `manifest.json`
- [ ] CHANGELOG 已更新
- [ ] .crx 文件已生成
- [ ] .crx 文件已测试安装
- [ ] 私钥已安全保存
- [ ] 准备好 Release 说明
- [ ] 文件已上传到 GitHub Releases

---

## 相关资源 / Related Resources

- [Chrome Extension 开发文档](https://developer.chrome.com/docs/extensions/)
- [打包和分发扩展](https://developer.chrome.com/docs/extensions/mv3/linux_hosting/)
- [GitHub Releases 文档](https://docs.github.com/en/repositories/releasing-projects-on-github)

---

完成打包后，你的 `currency-converter.crx` 文件就可以分发给用户了！

After packaging, your `currency-converter.crx` file is ready to distribute to users!
