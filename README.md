# 💱 实时汇率转换器 / Real-time Currency Converter

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Chrome](https://img.shields.io/badge/chrome-114%2B-brightgreen.svg)

一个智能的 Chrome 浏览器扩展，自动识别并转换网页中的货币金额。

An intelligent Chrome extension that automatically detects and converts currency amounts on web pages.

[English](#english) | [中文](#中文)

</div>

---

## 中文

### ✨ 功能特点

- 🌍 **自动识别** - 智能检测页面中的货币金额
- 💰 **实时转换** - 使用最新汇率自动转换
- 🎨 **美观显示** - 绿色金钱风格的转换标签
- 🔄 **动态更新** - 支持 AJAX 和 SPA 动态内容
- 🌐 **多语言** - 支持中英文界面切换
- ⚡ **高性能** - 智能缓存，防抖优化
- 🎯 **精准匹配** - 支持多种货币格式

### 🚀 支持的货币格式

- 符号格式：`$100`, `€50`, `£30`, `¥1000`, `￥500`
- ISO 代码：`100 USD`, `50 EUR`, `30 GBP`
- 中文格式：`100元`, `50人民币`
- 其他格式：`R 200` (南非兰特)

### 📦 安装

#### 方法 1: 从 GitHub Releases 下载（推荐）

1. 访问 [Releases 页面](https://github.com/xcondor/currency-converter-extension/releases)
2. 下载最新版本的 `currency-converter.crx` 文件
3. 打开 Chrome 浏览器，访问 `chrome://extensions/`
4. 启用"开发者模式"（右上角开关）
5. 将下载的 `.crx` 文件拖拽到扩展页面
6. 点击"添加扩展程序"确认安装

> **注意**: 如果直接拖拽 .crx 文件无法安装，请使用方法 2 从源码安装。

#### 方法 2: 从源码安装

1. 克隆仓库
```bash
git clone https://github.com/xcondor/currency-converter-extension.git
cd currency-converter-extension
```

2. 安装依赖
```bash
npm install
```

3. 构建项目
```bash
npm run build
```

4. 加载到 Chrome
   - 打开 `chrome://extensions/`
   - 启用"开发者模式"
   - 点击"加载已解压的扩展程序"
   - 选择 `dist` 目录

### 🎯 使用方法

1. **启用扩展** - 点击扩展图标打开侧边栏
2. **配置设置** - 选择本地货币和小数位数
3. **浏览网页** - 自动识别并转换货币金额
4. **查看汇率** - 悬停在转换金额上查看详细汇率

### ⚙️ 功能设置

- **自动转换** - 开启/关闭自动转换功能
- **本地货币** - 选择目标货币（CNY, USD, EUR, GBP, JPY, KRW, HKD）
- **小数位数** - 设置显示精度（2-4 位）
- **显示汇率** - 悬停时显示详细汇率信息
- **语言切换** - 中英文界面切换

### 🛠️ 开发

#### 项目结构

```
currency-converter-extension/
├── src/                    # 源代码
│   ├── background.ts       # Service Worker
│   ├── content.ts          # Content Script
│   ├── popup.ts            # 侧边栏 UI
│   ├── detector.ts         # 货币检测
│   ├── converter.ts        # 货币转换
│   ├── overlay.ts          # UI 覆盖层
│   ├── i18n.ts            # 国际化
│   └── types.ts           # 类型定义
├── public/                 # 静态资源
│   ├── manifest.json       # 扩展配置
│   ├── popup.html          # 侧边栏 HTML
│   ├── popup.css           # 样式文件
│   └── icons/             # 图标资源
├── tests/                  # 测试文件
│   ├── unit/              # 单元测试
│   └── property/          # 属性测试
└── scripts/               # 构建脚本
```

#### 可用命令

```bash
# 开发构建
npm run build

# 运行测试
npm test

# 生成图标
npm run generate-icons
```

#### 技术栈

- **TypeScript** - 类型安全的 JavaScript
- **Webpack** - 模块打包
- **Jest** - 单元测试
- **fast-check** - 属性测试
- **Chrome Extension Manifest V3** - 最新扩展标准

### 📊 API 说明

使用 [ExchangeRate-API](https://www.exchangerate-api.com/) 获取实时汇率数据。

- 免费额度：1500 次请求/月
- 更新频率：每小时
- 支持货币：162 种

### 🎨 设计特点

- **shadcn/ui 风格** - 现代简洁的设计系统
- **绿色金钱主题** - 直观的货币视觉效果
- **流畅动画** - 悬停放大和闪光效果
- **等宽字体** - 专业的数字显示

### 📝 文档

- [安装指南](INSTALLATION.md)
- [使用说明](USAGE.md)
- [打包指南](HOW_TO_PACKAGE.md)
- [更新日志](CHANGELOG.md)
- [故障排查](TROUBLESHOOTING.md)
- [调试指南](DEBUG_GUIDE.md)
- [自动转换](AUTO_CONVERSION.md)
- [UI 设计](UI_DESIGN.md)
- [多语言支持](LANGUAGE_SUPPORT.md)

### 🤝 贡献

欢迎贡献代码！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

### 🙏 致谢

- [ExchangeRate-API](https://www.exchangerate-api.com/) - 提供汇率数据
- [shadcn/ui](https://ui.shadcn.com/) - 设计灵感
- Chrome Extension 社区

---

## English

### ✨ Features

- 🌍 **Auto Detection** - Intelligently detects currency amounts on pages
- 💰 **Real-time Conversion** - Converts using latest exchange rates
- 🎨 **Beautiful Display** - Green money-style conversion badges
- 🔄 **Dynamic Updates** - Supports AJAX and SPA dynamic content
- 🌐 **Multi-language** - Chinese and English interface
- ⚡ **High Performance** - Smart caching and debouncing
- 🎯 **Accurate Matching** - Supports multiple currency formats

### 🚀 Supported Currency Formats

- Symbol format: `$100`, `€50`, `£30`, `¥1000`, `￥500`
- ISO codes: `100 USD`, `50 EUR`, `30 GBP`
- Chinese format: `100元`, `50人民币`
- Other formats: `R 200` (South African Rand)

### 📦 Installation

#### Method 1: Download from GitHub Releases (Recommended)

1. Visit the [Releases page](https://github.com/xcondor/currency-converter-extension/releases)
2. Download the latest `currency-converter.crx` file
3. Open Chrome browser and go to `chrome://extensions/`
4. Enable "Developer mode" (toggle in top-right corner)
5. Drag and drop the downloaded `.crx` file onto the extensions page
6. Click "Add extension" to confirm installation

> **Note**: If dragging the .crx file doesn't work, please use Method 2 to install from source.

#### Method 2: Install from Source

1. Clone the repository
```bash
git clone https://github.com/xcondor/currency-converter-extension.git
cd currency-converter-extension
```

2. Install dependencies
```bash
npm install
```

3. Build the project
```bash
npm run build
```

4. Load into Chrome
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` directory

### 🎯 Usage

1. **Enable Extension** - Click extension icon to open sidebar
2. **Configure Settings** - Select base currency and decimal places
3. **Browse Web** - Automatically detects and converts currency amounts
4. **View Rates** - Hover over converted amounts to see detailed rates

### ⚙️ Settings

- **Auto Convert** - Enable/disable automatic conversion
- **Base Currency** - Select target currency (CNY, USD, EUR, GBP, JPY, KRW, HKD)
- **Decimal Places** - Set display precision (2-4 digits)
- **Show Rate** - Display detailed rate information on hover
- **Language** - Switch between Chinese and English

### 🛠️ Development

#### Project Structure

```
currency-converter-extension/
├── src/                    # Source code
│   ├── background.ts       # Service Worker
│   ├── content.ts          # Content Script
│   ├── popup.ts            # Sidebar UI
│   ├── detector.ts         # Currency detection
│   ├── converter.ts        # Currency conversion
│   ├── overlay.ts          # UI overlay
│   ├── i18n.ts            # Internationalization
│   └── types.ts           # Type definitions
├── public/                 # Static assets
│   ├── manifest.json       # Extension config
│   ├── popup.html          # Sidebar HTML
│   ├── popup.css           # Styles
│   └── icons/             # Icon assets
├── tests/                  # Test files
│   ├── unit/              # Unit tests
│   └── property/          # Property tests
└── scripts/               # Build scripts
```

#### Available Commands

```bash
# Development build
npm run build

# Run tests
npm test

# Generate icons
npm run generate-icons
```

#### Tech Stack

- **TypeScript** - Type-safe JavaScript
- **Webpack** - Module bundler
- **Jest** - Unit testing
- **fast-check** - Property-based testing
- **Chrome Extension Manifest V3** - Latest extension standard

### 📊 API

Uses [ExchangeRate-API](https://www.exchangerate-api.com/) for real-time exchange rate data.

- Free tier: 1500 requests/month
- Update frequency: Hourly
- Supported currencies: 162

### 🎨 Design

- **shadcn/ui Style** - Modern and clean design system
- **Green Money Theme** - Intuitive currency visual effects
- **Smooth Animations** - Hover scaling and shine effects
- **Monospace Font** - Professional number display

### 📝 Documentation

- [Installation Guide](INSTALLATION.md)
- [Usage Guide](USAGE.md)
- [Changelog](CHANGELOG.md)
- [Troubleshooting](TROUBLESHOOTING.md)
- [Debug Guide](DEBUG_GUIDE.md)
- [Auto Conversion](AUTO_CONVERSION.md)
- [UI Design](UI_DESIGN.md)
- [Language Support](LANGUAGE_SUPPORT.md)

### 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### 🙏 Acknowledgments

- [ExchangeRate-API](https://www.exchangerate-api.com/) - Exchange rate data
- [shadcn/ui](https://ui.shadcn.com/) - Design inspiration
- Chrome Extension community

---

<div align="center">

Made with ❤️ by [Your Name]

⭐ Star this repo if you find it helpful!

</div>
