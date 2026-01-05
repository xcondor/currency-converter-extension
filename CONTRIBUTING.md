# 贡献指南 / Contributing Guide

感谢你考虑为本项目做出贡献！

Thank you for considering contributing to this project!

## 中文

### 如何贡献

#### 报告 Bug

如果你发现了 bug，请创建一个 issue 并包含以下信息：

1. **问题描述** - 清晰简洁地描述问题
2. **重现步骤** - 详细的重现步骤
3. **预期行为** - 你期望发生什么
4. **实际行为** - 实际发生了什么
5. **环境信息**
   - Chrome 版本
   - 操作系统
   - 扩展版本
6. **截图** - 如果适用，添加截图
7. **控制台日志** - 相关的错误日志

#### 提出新功能

如果你有新功能的想法：

1. 先检查是否已有相关 issue
2. 创建一个 feature request issue
3. 详细描述功能和使用场景
4. 说明为什么这个功能有用

#### 提交代码

1. **Fork 仓库**
   ```bash
   git clone https://github.com/xcondor/currency-converter-extension.git
   ```

2. **创建分支**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **编写代码**
   - 遵循现有代码风格
   - 添加必要的注释
   - 确保代码通过测试

4. **运行测试**
   ```bash
   npm test
   ```

5. **提交更改**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

6. **推送到 GitHub**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **创建 Pull Request**
   - 清晰描述你的更改
   - 引用相关的 issue
   - 等待代码审查

### 代码规范

#### TypeScript 风格

- 使用 TypeScript 严格模式
- 为所有函数添加类型注解
- 使用接口定义数据结构
- 避免使用 `any` 类型

```typescript
// ✅ 好的示例
function convert(amount: number, from: string, to: string): ConversionResult {
  // ...
}

// ❌ 不好的示例
function convert(amount, from, to) {
  // ...
}
```

#### 命名规范

- 变量和函数：camelCase
- 类和接口：PascalCase
- 常量：UPPER_SNAKE_CASE
- 文件名：kebab-case

```typescript
// 变量和函数
const baseCurrency = 'CNY';
function convertCurrency() {}

// 类和接口
class RateProvider {}
interface ConversionResult {}

// 常量
const API_BASE_URL = 'https://api.example.com';

// 文件名
rate-provider.ts
currency-converter.ts
```

#### 注释规范

- 为复杂逻辑添加注释
- 使用 JSDoc 注释公共 API
- 中英文注释都可以

```typescript
/**
 * 转换货币金额
 * Convert currency amount
 * 
 * @param amount - 金额 / Amount
 * @param from - 源货币 / Source currency
 * @param to - 目标货币 / Target currency
 * @returns 转换结果 / Conversion result
 */
function convert(amount: number, from: string, to: string): ConversionResult {
  // 实现逻辑
}
```

### 提交信息规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

- `feat:` - 新功能
- `fix:` - Bug 修复
- `docs:` - 文档更新
- `style:` - 代码格式（不影响功能）
- `refactor:` - 重构
- `test:` - 测试相关
- `chore:` - 构建/工具相关

示例：
```
feat: add support for cryptocurrency conversion
fix: resolve currency detection issue on dynamic pages
docs: update installation guide
style: format code with prettier
refactor: simplify rate caching logic
test: add unit tests for detector module
chore: update dependencies
```

### 测试要求

- 为新功能添加单元测试
- 确保所有测试通过
- 测试覆盖率不低于 80%

```bash
# 运行所有测试
npm test

# 运行特定测试
npm test -- detector.test.ts

# 查看覆盖率
npm test -- --coverage
```

### 文档要求

- 更新相关文档
- 添加必要的代码注释
- 更新 CHANGELOG.md

### Pull Request 检查清单

在提交 PR 前，请确认：

- [ ] 代码遵循项目风格
- [ ] 添加了必要的测试
- [ ] 所有测试通过
- [ ] 更新了相关文档
- [ ] 提交信息符合规范
- [ ] 没有合并冲突
- [ ] 代码已经过自我审查

---

## English

### How to Contribute

#### Reporting Bugs

If you find a bug, please create an issue with:

1. **Description** - Clear and concise description
2. **Steps to Reproduce** - Detailed reproduction steps
3. **Expected Behavior** - What you expected to happen
4. **Actual Behavior** - What actually happened
5. **Environment**
   - Chrome version
   - Operating system
   - Extension version
6. **Screenshots** - If applicable
7. **Console Logs** - Relevant error logs

#### Suggesting Features

If you have an idea for a new feature:

1. Check if there's already a related issue
2. Create a feature request issue
3. Describe the feature and use cases in detail
4. Explain why this feature would be useful

#### Submitting Code

1. **Fork the repository**
   ```bash
   git clone https://github.com/xcondor/currency-converter-extension.git
   ```

2. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Write code**
   - Follow existing code style
   - Add necessary comments
   - Ensure code passes tests

4. **Run tests**
   ```bash
   npm test
   ```

5. **Commit changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

6. **Push to GitHub**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create Pull Request**
   - Clearly describe your changes
   - Reference related issues
   - Wait for code review

### Code Style

#### TypeScript Style

- Use TypeScript strict mode
- Add type annotations to all functions
- Use interfaces for data structures
- Avoid using `any` type

```typescript
// ✅ Good
function convert(amount: number, from: string, to: string): ConversionResult {
  // ...
}

// ❌ Bad
function convert(amount, from, to) {
  // ...
}
```

#### Naming Conventions

- Variables and functions: camelCase
- Classes and interfaces: PascalCase
- Constants: UPPER_SNAKE_CASE
- File names: kebab-case

```typescript
// Variables and functions
const baseCurrency = 'CNY';
function convertCurrency() {}

// Classes and interfaces
class RateProvider {}
interface ConversionResult {}

// Constants
const API_BASE_URL = 'https://api.example.com';

// File names
rate-provider.ts
currency-converter.ts
```

#### Comment Guidelines

- Add comments for complex logic
- Use JSDoc for public APIs
- Comments can be in English or Chinese

```typescript
/**
 * Convert currency amount
 * 
 * @param amount - Amount to convert
 * @param from - Source currency
 * @param to - Target currency
 * @returns Conversion result
 */
function convert(amount: number, from: string, to: string): ConversionResult {
  // Implementation
}
```

### Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation update
- `style:` - Code formatting (no functional change)
- `refactor:` - Code refactoring
- `test:` - Test related
- `chore:` - Build/tooling related

Examples:
```
feat: add support for cryptocurrency conversion
fix: resolve currency detection issue on dynamic pages
docs: update installation guide
style: format code with prettier
refactor: simplify rate caching logic
test: add unit tests for detector module
chore: update dependencies
```

### Testing Requirements

- Add unit tests for new features
- Ensure all tests pass
- Maintain test coverage above 80%

```bash
# Run all tests
npm test

# Run specific test
npm test -- detector.test.ts

# Check coverage
npm test -- --coverage
```

### Documentation Requirements

- Update relevant documentation
- Add necessary code comments
- Update CHANGELOG.md

### Pull Request Checklist

Before submitting a PR, ensure:

- [ ] Code follows project style
- [ ] Added necessary tests
- [ ] All tests pass
- [ ] Updated relevant documentation
- [ ] Commit messages follow convention
- [ ] No merge conflicts
- [ ] Code has been self-reviewed

---

## 行为准则 / Code of Conduct

### 我们的承诺 / Our Pledge

为了营造一个开放和友好的环境，我们承诺让每个人都能参与到项目中来，无论其经验水平、性别、性别认同和表达、性取向、残疾、外貌、体型、种族、民族、年龄、宗教或国籍。

In the interest of fostering an open and welcoming environment, we pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### 我们的标准 / Our Standards

积极行为的例子包括：

Examples of positive behavior include:

- 使用友好和包容的语言 / Using welcoming and inclusive language
- 尊重不同的观点和经验 / Respecting differing viewpoints and experiences
- 优雅地接受建设性批评 / Gracefully accepting constructive criticism
- 关注对社区最有利的事情 / Focusing on what is best for the community
- 对其他社区成员表示同理心 / Showing empathy towards other community members

---

## 问题？/ Questions?

如有任何问题，请：

If you have any questions:

- 创建一个 issue / Create an issue
- 发送邮件 / Send an email
- 加入讨论 / Join the discussion

感谢你的贡献！🎉

Thank you for your contribution! 🎉
