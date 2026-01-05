# GitHub 开源发布检查清单 / GitHub Open Source Release Checklist

## 发布前检查 / Pre-release Checklist

### 📝 文档 / Documentation
- [x] README.md - 完整的项目说明
- [x] LICENSE - MIT 许可证
- [x] CONTRIBUTING.md - 贡献指南
- [x] INSTALLATION.md - 安装指南
- [x] USAGE.md - 使用说明
- [x] CHANGELOG.md - 更新日志
- [x] PROJECT_STRUCTURE.md - 项目结构
- [x] TROUBLESHOOTING.md - 故障排查
- [x] DEBUG_GUIDE.md - 调试指南

### 🔧 配置文件 / Configuration Files
- [x] .gitignore - Git 忽略文件
- [x] package.json - NPM 配置（包含仓库信息）
- [x] tsconfig.json - TypeScript 配置
- [x] webpack.config.js - Webpack 配置
- [x] jest.config.js - Jest 配置

### 🚀 CI/CD
- [x] .github/workflows/ci.yml - GitHub Actions 工作流

### 🧹 清理 / Cleanup
- [x] 删除 node_modules/
- [x] 删除 dist/
- [x] 删除 .DS_Store
- [x] 删除 yarn.lock（使用 npm）
- [x] 删除临时文件
- [x] 删除 .kiro/ 目录
- [x] 删除测试页面

### ✅ 代码质量 / Code Quality
- [ ] 所有测试通过
- [ ] 代码已格式化
- [ ] 无 TypeScript 错误
- [ ] 无 console.log（除调试用）

### 📦 构建 / Build
- [ ] 运行 `npm run build` 成功
- [ ] dist/ 目录包含所有必要文件
- [ ] 扩展在 Chrome 中正常加载
- [ ] 所有功能正常工作
- [ ] 已打包 .crx 文件（用于 Release）
- [ ] .crx 文件可以正常安装

### 🔐 安全 / Security
- [ ] 移除所有 API 密钥
- [ ] 移除敏感信息
- [ ] 检查依赖安全性

### 📋 元数据 / Metadata
- [ ] 更新 package.json 中的作者信息
- [ ] 更新 package.json 中的仓库 URL
- [ ] 更新 README.md 中的 GitHub 链接
- [ ] 添加项目描述和标签

## 发布步骤 / Release Steps

### 1. 最终测试 / Final Testing

```bash
# 安装依赖
npm install

# 运行测试
npm test

# 构建项目
npm run build

# 检查构建输出
ls -la dist/
```

### 2. 创建 Git 仓库 / Create Git Repository

```bash
# 初始化 Git
git init

# 添加所有文件
git add .

# 首次提交
git commit -m "Initial commit: Real-time Currency Converter Extension v1.0.0"
```

### 3. 创建 GitHub 仓库 / Create GitHub Repository

1. 访问 https://github.com/new
2. 填写仓库信息：
   - 名称：`currency-converter-extension`
   - 描述：`A Chrome extension that automatically detects and converts currency amounts on web pages`
   - 公开仓库
   - 不要初始化 README（已有）

### 4. 推送到 GitHub / Push to GitHub

```bash
# 添加远程仓库
git remote add origin https://github.com/xcondor/currency-converter-extension.git

# 推送代码
git branch -M main
git push -u origin main
```

### 5. 创建 Release / Create Release

1. 访问仓库的 Releases 页面
2. 点击 "Create a new release"
3. 填写信息：
   - Tag: `v1.0.0`
   - Title: `v1.0.0 - Initial Release`
   - 描述：参考 CHANGELOG.md
4. 上传 `currency-converter-extension.zip`
5. 发布

### 6. 添加 Topics / Add Topics

在仓库设置中添加标签：
- `chrome-extension`
- `currency-converter`
- `exchange-rate`
- `typescript`
- `manifest-v3`
- `i18n`
- `real-time`

### 7. 配置仓库 / Configure Repository

- [ ] 启用 Issues
- [ ] 启用 Discussions
- [ ] 添加项目描述
- [ ] 添加网站链接（如有）
- [ ] 设置默认分支为 main

### 8. 社区文件 / Community Files

GitHub 会自动识别：
- [ ] LICENSE
- [ ] CONTRIBUTING.md
- [ ] CODE_OF_CONDUCT.md（可选）
- [ ] SECURITY.md（可选）

## 发布后 / Post-release

### 📢 宣传 / Promotion

- [ ] 在 Chrome Web Store 发布（如果适用）
- [ ] 在社交媒体分享
- [ ] 在相关论坛发布
- [ ] 写博客文章介绍

### 📊 监控 / Monitoring

- [ ] 监控 Issues
- [ ] 回复用户反馈
- [ ] 收集功能建议
- [ ] 跟踪使用统计

### 🔄 维护 / Maintenance

- [ ] 定期更新依赖
- [ ] 修复报告的 Bug
- [ ] 添加新功能
- [ ] 更新文档

## 注意事项 / Notes

### 必须修改的内容 / Must Change

在发布前，请替换以下占位符：

1. **package.json**
   ```json
   "author": "Your Name <your.email@example.com>"
   "url": "https://github.com/xcondor/currency-converter-extension.git"
   ```

2. **README.md**
   ```markdown
   [GitHub 链接]
   Made with ❤️ by [Your Name]
   ```

3. **所有文档中的 GitHub URL**
   - 替换 `xcondor` 为你的 GitHub 用户名

### API 密钥 / API Keys

⚠️ **重要提示：**

当前代码中包含 ExchangeRate-API 密钥：
```typescript
// src/config.ts
export const API_CONFIG = {
  API_KEY: '63b85a6ebcfdfb4181267653',
  // ...
};
```

**建议：**
1. 使用环境变量
2. 让用户自己申请 API 密钥
3. 在文档中说明如何获取

### 版本号 / Version Numbers

遵循语义化版本：
- `1.0.0` - 首次发布
- `1.0.1` - Bug 修复
- `1.1.0` - 新功能
- `2.0.0` - 重大更新

## 完成！/ Done!

当所有检查项都完成后，你的项目就可以发布到 GitHub 了！

祝你的开源项目成功！🎉

Good luck with your open source project! 🎉
