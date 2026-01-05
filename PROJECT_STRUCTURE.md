# 项目结构 / Project Structure

```
currency-converter-extension/
│
├── src/                          # 源代码 / Source code
│   ├── background.ts             # Service Worker 后台服务
│   ├── content.ts                # Content Script 内容脚本
│   ├── popup.ts                  # 侧边栏 UI 逻辑
│   ├── detector.ts               # 货币检测模块
│   ├── converter.ts              # 货币转换模块
│   ├── overlay.ts                # UI 覆盖层模块
│   ├── rateProvider.ts           # 汇率数据提供器
│   ├── settingsManager.ts        # 设置管理器
│   ├── i18n.ts                   # 国际化模块
│   ├── config.ts                 # 配置文件
│   └── types.ts                  # TypeScript 类型定义
│
├── public/                       # 静态资源 / Static assets
│   ├── manifest.json             # Chrome 扩展配置文件
│   ├── popup.html                # 侧边栏 HTML
│   ├── popup.css                 # 侧边栏样式
│   └── icons/                    # 图标资源
│       ├── icon16.svg            # 16x16 图标
│       ├── icon48.svg            # 48x48 图标
│       └── icon128.svg           # 128x128 图标
│
├── tests/                        # 测试文件 / Test files
│   ├── unit/                     # 单元测试
│   │   ├── detector.test.ts      # 检测器测试
│   │   ├── converter.test.ts     # 转换器测试
│   │   └── ...
│   ├── property/                 # 属性测试
│   │   └── detection.property.test.ts
│   └── setup.ts                  # 测试配置
│
├── scripts/                      # 构建脚本 / Build scripts
│   └── generate-icons.js         # 图标生成脚本
│
├── dist/                         # 构建输出 / Build output (gitignored)
│   ├── background.js
│   ├── content.js
│   ├── popup.js
│   ├── popup.html
│   ├── popup.css
│   ├── manifest.json
│   └── icons/
│
├── docs/                         # 文档 / Documentation
│   ├── README.md                 # 项目说明
│   ├── INSTALLATION.md           # 安装指南
│   ├── USAGE.md                  # 使用说明
│   ├── CHANGELOG.md              # 更新日志
│   ├── TROUBLESHOOTING.md        # 故障排查
│   ├── DEBUG_GUIDE.md            # 调试指南
│   ├── AUTO_CONVERSION.md        # 自动转换说明
│   ├── UI_DESIGN.md              # UI 设计说明
│   ├── LANGUAGE_SUPPORT.md       # 多语言支持
│   ├── OVERLAY_DESIGN.md         # 覆盖层设计
│   └── CONTRIBUTING.md           # 贡献指南
│
├── .gitignore                    # Git 忽略文件
├── package.json                  # NPM 配置
├── package-lock.json             # NPM 锁文件
├── tsconfig.json                 # TypeScript 配置
├── webpack.config.js             # Webpack 配置
├── jest.config.js                # Jest 配置
└── LICENSE                       # MIT 许可证
```

## 核心模块说明 / Core Modules

### background.ts
- Service Worker 后台服务
- 处理扩展安装和更新事件
- 管理消息通信
- 控制侧边栏打开

### content.ts
- 注入到网页的内容脚本
- 扫描页面中的货币金额
- 监听 DOM 变化和标签页切换
- 显示转换结果

### detector.ts
- 货币检测引擎
- 支持多种货币格式
- 使用正则表达式匹配
- 返回检测结果

### converter.ts
- 货币转换逻辑
- 计算汇率转换
- 格式化显示结果
- 处理精度设置

### overlay.ts
- UI 覆盖层组件
- 创建转换标签
- 处理悬停效果
- 显示闪光动画

### rateProvider.ts
- 汇率数据提供器
- 从 API 获取汇率
- 缓存管理（1小时）
- 错误处理

### settingsManager.ts
- 设置管理器
- 保存和加载设置
- 清除缓存
- 默认值管理

### i18n.ts
- 国际化模块
- 中英文翻译
- 语言切换
- 文本获取

### popup.ts
- 侧边栏 UI 逻辑
- 设置表单处理
- 自动保存
- 状态更新

## 构建流程 / Build Process

1. **TypeScript 编译** - 将 .ts 文件编译为 .js
2. **Webpack 打包** - 打包模块和依赖
3. **资源复制** - 复制静态文件到 dist/
4. **代码压缩** - 生产模式下压缩代码

## 测试策略 / Testing Strategy

- **单元测试** - 测试独立模块功能
- **属性测试** - 测试边界情况和随机输入
- **集成测试** - 测试模块间交互
- **手动测试** - 在真实浏览器中测试

## 开发工作流 / Development Workflow

1. 修改源代码
2. 运行 `npm run build`
3. 在 Chrome 中重新加载扩展
4. 测试功能
5. 运行 `npm test` 确保测试通过
6. 提交代码
