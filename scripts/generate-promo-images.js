#!/usr/bin/env node

/**
 * Generate Chrome Web Store promotional images
 * 
 * Requirements:
 * - Screenshots: 1-5 images, 1280x800 or 640x400, JPEG or 24-bit PNG
 * - Small promo tile: 440x280, JPEG or 24-bit PNG
 * - Marquee promo tile: 1400x560, JPEG or 24-bit PNG
 */

const { createCanvas, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

// 确保输出目录存在
const outputDir = path.join(__dirname, '..', 'promo-images');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 颜色配置 (shadcn/ui 风格)
const colors = {
  background: '#ffffff',
  foreground: '#09090b',
  primary: '#3b82f6',
  primaryLight: '#60a5fa',
  secondary: '#f1f5f9',
  border: '#e2e8f0',
  muted: '#64748b',
  success: '#10b981',
  gradient1: '#667eea',
  gradient2: '#764ba2',
  cardBg: '#ffffff',
  cardBorder: '#e2e8f0'
};

/**
 * 绘制渐变背景
 */
function drawGradientBackground(ctx, width, height) {
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, colors.gradient1);
  gradient.addColorStop(1, colors.gradient2);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

/**
 * 绘制圆角矩形
 */
function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/**
 * 绘制卡片
 */
function drawCard(ctx, x, y, width, height, radius = 12) {
  // 阴影
  ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
  ctx.shadowBlur = 20;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 4;
  
  // 卡片背景
  ctx.fillStyle = colors.cardBg;
  roundRect(ctx, x, y, width, height, radius);
  ctx.fill();
  
  // 边框
  ctx.strokeStyle = colors.cardBorder;
  ctx.lineWidth = 1;
  ctx.stroke();
  
  // 重置阴影
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
}

/**
 * 生成截图 1: 侧边栏界面展示 (1280x800)
 */
function generateScreenshot1() {
  const canvas = createCanvas(1280, 800);
  const ctx = canvas.getContext('2d');
  
  // 背景
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, 1280, 800);
  
  // 浏览器窗口模拟
  const browserX = 40;
  const browserY = 40;
  const browserWidth = 1200;
  const browserHeight = 720;
  
  // 浏览器外框
  ctx.fillStyle = '#ffffff';
  roundRect(ctx, browserX, browserY, browserWidth, browserHeight, 12);
  ctx.fill();
  ctx.strokeStyle = colors.border;
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // 浏览器标题栏
  ctx.fillStyle = '#f1f5f9';
  roundRect(ctx, browserX, browserY, browserWidth, 50, 12);
  ctx.fill();
  ctx.fillRect(browserX, browserY + 40, browserWidth, 10);
  
  // 浏览器控制按钮
  const buttonY = browserY + 20;
  ['#ef4444', '#f59e0b', '#10b981'].forEach((color, i) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(browserX + 20 + i * 25, buttonY, 8, 0, Math.PI * 2);
    ctx.fill();
  });
  
  // 地址栏
  ctx.fillStyle = '#ffffff';
  roundRect(ctx, browserX + 100, buttonY - 12, 400, 24, 6);
  ctx.fill();
  ctx.strokeStyle = colors.border;
  ctx.lineWidth = 1;
  ctx.stroke();
  
  ctx.fillStyle = colors.muted;
  ctx.font = '14px Arial';
  ctx.fillText('https://example.com', browserX + 115, buttonY + 5);
  
  // 主内容区域 (左侧)
  const contentX = browserX + 20;
  const contentY = browserY + 70;
  const contentWidth = 750;
  
  // 模拟网页内容
  ctx.fillStyle = colors.foreground;
  ctx.font = 'bold 32px Arial';
  ctx.fillText('Product Pricing', contentX, contentY + 40);
  
  ctx.font = '18px Arial';
  ctx.fillStyle = colors.muted;
  ctx.fillText('Premium Plan', contentX, contentY + 100);
  
  // 价格显示 (带转换效果)
  ctx.font = 'bold 48px Arial';
  ctx.fillStyle = colors.foreground;
  ctx.fillText('$99.99', contentX, contentY + 160);
  
  // 转换后的价格 (绿色高亮)
  ctx.fillStyle = colors.success;
  ctx.font = 'bold 36px Arial';
  ctx.fillText('≈ ¥699.93', contentX + 200, contentY + 160);
  
  // 更多价格示例
  const prices = [
    { original: '€49.99', converted: '≈ ¥389.93' },
    { original: '£79.99', converted: '≈ ¥729.91' }
  ];
  
  prices.forEach((price, i) => {
    const y = contentY + 240 + i * 80;
    ctx.fillStyle = colors.muted;
    ctx.font = '16px Arial';
    ctx.fillText(`Option ${i + 2}`, contentX, y);
    
    ctx.fillStyle = colors.foreground;
    ctx.font = 'bold 28px Arial';
    ctx.fillText(price.original, contentX, y + 40);
    
    ctx.fillStyle = colors.success;
    ctx.font = 'bold 24px Arial';
    ctx.fillText(price.converted, contentX + 150, y + 40);
  });
  
  // 侧边栏 (右侧)
  const sidebarX = browserX + 800;
  const sidebarY = browserY + 70;
  const sidebarWidth = 380;
  const sidebarHeight = 640;
  
  // 侧边栏背景
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(sidebarX, sidebarY, sidebarWidth, sidebarHeight);
  ctx.strokeStyle = colors.border;
  ctx.lineWidth = 1;
  ctx.strokeRect(sidebarX, sidebarY, sidebarWidth, sidebarHeight);
  
  // 侧边栏头部
  ctx.fillStyle = colors.foreground;
  ctx.font = 'bold 24px Arial';
  ctx.fillText('💱 汇率转换器', sidebarX + 20, sidebarY + 40);
  
  ctx.fillStyle = colors.muted;
  ctx.font = '14px Arial';
  ctx.fillText('实时货币转换助手', sidebarX + 20, sidebarY + 65);
  
  // 语言切换按钮
  ctx.fillStyle = colors.background;
  roundRect(ctx, sidebarX + 300, sidebarY + 20, 60, 32, 6);
  ctx.fill();
  ctx.strokeStyle = colors.border;
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = colors.foreground;
  ctx.font = '14px Arial';
  ctx.fillText('EN', sidebarX + 320, sidebarY + 42);
  
  // 功能控制卡片
  let cardY = sidebarY + 100;
  drawCard(ctx, sidebarX + 20, cardY, sidebarWidth - 40, 100, 8);
  
  ctx.fillStyle = colors.foreground;
  ctx.font = 'bold 16px Arial';
  ctx.fillText('功能控制', sidebarX + 35, cardY + 30);
  
  ctx.font = '14px Arial';
  ctx.fillText('自动转换', sidebarX + 35, cardY + 60);
  ctx.fillStyle = colors.muted;
  ctx.font = '12px Arial';
  ctx.fillText('开启后自动识别并转换页面货币', sidebarX + 35, cardY + 78);
  
  // 开关按钮 (开启状态)
  ctx.fillStyle = colors.primary;
  roundRect(ctx, sidebarX + 300, cardY + 50, 44, 24, 12);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(sidebarX + 330, cardY + 62, 10, 0, Math.PI * 2);
  ctx.fill();
  
  // 转换设置卡片
  cardY += 120;
  drawCard(ctx, sidebarX + 20, cardY, sidebarWidth - 40, 200, 8);
  
  ctx.fillStyle = colors.foreground;
  ctx.font = 'bold 16px Arial';
  ctx.fillText('转换设置', sidebarX + 35, cardY + 30);
  
  ctx.font = '14px Arial';
  ctx.fillText('本地货币', sidebarX + 35, cardY + 65);
  
  // 下拉选择框
  ctx.fillStyle = colors.background;
  roundRect(ctx, sidebarX + 35, cardY + 75, sidebarWidth - 90, 36, 6);
  ctx.fill();
  ctx.strokeStyle = colors.border;
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = colors.foreground;
  ctx.font = '14px Arial';
  ctx.fillText('🇨🇳 人民币 (CNY)', sidebarX + 50, cardY + 98);
  
  ctx.fillStyle = colors.foreground;
  ctx.font = '14px Arial';
  ctx.fillText('小数位数', sidebarX + 35, cardY + 135);
  
  // 输入框
  ctx.fillStyle = colors.background;
  roundRect(ctx, sidebarX + 35, cardY + 145, sidebarWidth - 90, 36, 6);
  ctx.fill();
  ctx.strokeStyle = colors.border;
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = colors.foreground;
  ctx.font = '14px Arial';
  ctx.fillText('2', sidebarX + 50, cardY + 168);
  
  // 汇率状态卡片
  cardY += 220;
  drawCard(ctx, sidebarX + 20, cardY, sidebarWidth - 40, 100, 8);
  
  ctx.fillStyle = colors.foreground;
  ctx.font = 'bold 16px Arial';
  ctx.fillText('汇率状态', sidebarX + 35, cardY + 30);
  
  ctx.fillStyle = colors.secondary;
  roundRect(ctx, sidebarX + 35, cardY + 45, sidebarWidth - 90, 40, 6);
  ctx.fill();
  
  ctx.font = '24px Arial';
  ctx.fillText('📊', sidebarX + 45, cardY + 73);
  
  ctx.fillStyle = colors.foreground;
  ctx.font = '14px Arial';
  ctx.fillText('汇率最新 (5 分钟前)', sidebarX + 80, cardY + 63);
  ctx.fillStyle = colors.muted;
  ctx.font = '12px Arial';
  ctx.fillText('汇率数据每小时更新', sidebarX + 80, cardY + 78);
  
  // 保存
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(outputDir, 'screenshot-1-1280x800.png'), buffer);
  console.log('✓ Generated screenshot-1-1280x800.png');
}

/**
 * 生成截图 2: 功能演示 (1280x800)
 */
function generateScreenshot2() {
  const canvas = createCanvas(1280, 800);
  const ctx = canvas.getContext('2d');
  
  // 渐变背景
  const gradient = ctx.createLinearGradient(0, 0, 1280, 800);
  gradient.addColorStop(0, '#667eea');
  gradient.addColorStop(1, '#764ba2');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1280, 800);
  
  // 标题
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 64px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('实时汇率转换器', 640, 120);
  
  ctx.font = '32px Arial';
  ctx.fillText('Real-time Currency Converter', 640, 170);
  
  // 功能特性卡片
  const features = [
    { icon: '🌍', title: '全球货币', desc: '支持 160+ 种货币' },
    { icon: '⚡', title: '实时转换', desc: '自动识别页面金额' },
    { icon: '🎨', title: '优雅设计', desc: 'shadcn/ui 风格' },
    { icon: '🌐', title: '多语言', desc: '中文 / English' }
  ];
  
  const cardWidth = 260;
  const cardHeight = 200;
  const startX = (1280 - (cardWidth * 4 + 60)) / 2;
  const cardY = 280;
  
  features.forEach((feature, i) => {
    const x = startX + i * (cardWidth + 20);
    
    // 卡片
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 10;
    
    ctx.fillStyle = '#ffffff';
    roundRect(ctx, x, cardY, cardWidth, cardHeight, 16);
    ctx.fill();
    
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    
    // 图标
    ctx.font = '64px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(feature.icon, x + cardWidth / 2, cardY + 90);
    
    // 标题
    ctx.fillStyle = colors.foreground;
    ctx.font = 'bold 24px Arial';
    ctx.fillText(feature.title, x + cardWidth / 2, cardY + 135);
    
    // 描述
    ctx.fillStyle = colors.muted;
    ctx.font = '16px Arial';
    ctx.fillText(feature.desc, x + cardWidth / 2, cardY + 165);
  });
  
  // 底部信息
  ctx.fillStyle = '#ffffff';
  ctx.font = '20px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('开源 · 免费 · 隐私保护', 640, 580);
  
  ctx.font = '16px Arial';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.fillText('数据由 ExchangeRate-API 提供', 640, 620);
  
  // 保存
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(outputDir, 'screenshot-2-1280x800.png'), buffer);
  console.log('✓ Generated screenshot-2-1280x800.png');
}

/**
 * 生成截图 3: 转换效果展示 (1280x800)
 */
function generateScreenshot3() {
  const canvas = createCanvas(1280, 800);
  const ctx = canvas.getContext('2d');
  
  // 背景
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, 1280, 800);
  
  // 标题
  ctx.fillStyle = colors.foreground;
  ctx.font = 'bold 48px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('智能货币识别与转换', 640, 100);
  
  ctx.fillStyle = colors.muted;
  ctx.font = '24px Arial';
  ctx.fillText('自动识别网页中的货币金额，实时转换为本地货币', 640, 145);
  
  // 转换示例
  const examples = [
    { before: '$99.99', after: '¥699.93', label: '美元 → 人民币' },
    { before: '€49.99', after: '¥389.93', label: '欧元 → 人民币' },
    { before: '£79.99', after: '¥729.91', label: '英镑 → 人民币' }
  ];
  
  const exampleY = 220;
  const exampleHeight = 150;
  const exampleSpacing = 30;
  
  examples.forEach((example, i) => {
    const y = exampleY + i * (exampleHeight + exampleSpacing);
    const centerX = 640;
    
    // 原始金额卡片
    const beforeX = centerX - 350;
    drawCard(ctx, beforeX, y, 280, exampleHeight, 12);
    
    ctx.fillStyle = colors.muted;
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('原始金额', beforeX + 140, y + 35);
    
    ctx.fillStyle = colors.foreground;
    ctx.font = 'bold 48px Arial';
    ctx.fillText(example.before, beforeX + 140, y + 95);
    
    // 箭头
    ctx.fillStyle = colors.primary;
    ctx.font = 'bold 48px Arial';
    ctx.fillText('→', centerX, y + 85);
    
    // 转换后金额卡片
    const afterX = centerX + 70;
    drawCard(ctx, afterX, y, 280, exampleHeight, 12);
    
    // 绿色渐变背景
    const cardGradient = ctx.createLinearGradient(afterX, y, afterX, y + exampleHeight);
    cardGradient.addColorStop(0, '#10b981');
    cardGradient.addColorStop(1, '#059669');
    ctx.fillStyle = cardGradient;
    roundRect(ctx, afterX, y, 280, exampleHeight, 12);
    ctx.fill();
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = '16px Arial';
    ctx.fillText('转换后', afterX + 140, y + 35);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px Arial';
    ctx.fillText(example.after, afterX + 140, y + 95);
    
    ctx.font = '14px Arial';
    ctx.fillText(example.label, afterX + 140, y + 125);
  });
  
  // 保存
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(outputDir, 'screenshot-3-1280x800.png'), buffer);
  console.log('✓ Generated screenshot-3-1280x800.png');
}

/**
 * 生成小型宣传图块 (440x280)
 */
function generateSmallPromoTile() {
  const canvas = createCanvas(440, 280);
  const ctx = canvas.getContext('2d');
  
  // 渐变背景
  const gradient = ctx.createLinearGradient(0, 0, 440, 280);
  gradient.addColorStop(0, colors.gradient1);
  gradient.addColorStop(1, colors.gradient2);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 440, 280);
  
  // 图标
  ctx.font = '72px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('💱', 220, 100);
  
  // 标题
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 32px Arial';
  ctx.fillText('汇率转换器', 220, 155);
  
  // 副标题
  ctx.font = '18px Arial';
  ctx.fillText('Currency Converter', 220, 185);
  
  // 描述
  ctx.font = '14px Arial';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.fillText('实时 · 智能 · 优雅', 220, 220);
  
  // 保存
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(outputDir, 'small-promo-tile-440x280.png'), buffer);
  console.log('✓ Generated small-promo-tile-440x280.png');
}

/**
 * 生成顶部宣传图块 (1400x560)
 */
function generateMarqueePromoTile() {
  const canvas = createCanvas(1400, 560);
  const ctx = canvas.getContext('2d');
  
  // 渐变背景
  const gradient = ctx.createLinearGradient(0, 0, 1400, 560);
  gradient.addColorStop(0, colors.gradient1);
  gradient.addColorStop(1, colors.gradient2);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1400, 560);
  
  // 左侧内容
  const leftX = 100;
  
  // 图标
  ctx.font = '120px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('💱', leftX, 180);
  
  // 标题
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 64px Arial';
  ctx.fillText('实时汇率转换器', leftX, 280);
  
  // 英文标题
  ctx.font = 'bold 36px Arial';
  ctx.fillText('Real-time Currency Converter', leftX, 330);
  
  // 描述
  ctx.font = '24px Arial';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.fillText('自动识别网页货币 · 实时转换 · 支持 160+ 种货币', leftX, 390);
  
  // 特性标签
  const tags = ['🌍 全球货币', '⚡ 实时转换', '🎨 优雅设计', '🌐 多语言'];
  ctx.font = '18px Arial';
  tags.forEach((tag, i) => {
    const tagX = leftX + i * 180;
    const tagY = 450;
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    roundRect(ctx, tagX, tagY, 160, 40, 8);
    ctx.fill();
    
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(tag, tagX + 80, tagY + 26);
  });
  
  // 右侧演示
  const demoX = 900;
  const demoY = 80;
  
  // 演示卡片
  ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 20;
  
  ctx.fillStyle = '#ffffff';
  roundRect(ctx, demoX, demoY, 400, 400, 20);
  ctx.fill();
  
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;
  
  // 演示内容
  ctx.fillStyle = colors.foreground;
  ctx.font = 'bold 28px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('转换示例', demoX + 30, demoY + 50);
  
  // 转换示例
  const demoExamples = [
    { from: '$99.99', to: '¥699.93' },
    { from: '€49.99', to: '¥389.93' },
    { from: '£79.99', to: '¥729.91' }
  ];
  
  demoExamples.forEach((ex, i) => {
    const y = demoY + 120 + i * 90;
    
    ctx.fillStyle = colors.muted;
    ctx.font = '20px Arial';
    ctx.fillText(ex.from, demoX + 40, y);
    
    ctx.fillStyle = colors.primary;
    ctx.font = 'bold 24px Arial';
    ctx.fillText('→', demoX + 160, y);
    
    // 绿色高亮
    ctx.fillStyle = colors.success;
    ctx.font = 'bold 28px Arial';
    ctx.fillText(ex.to, demoX + 220, y);
  });
  
  // 保存
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(outputDir, 'marquee-promo-tile-1400x560.png'), buffer);
  console.log('✓ Generated marquee-promo-tile-1400x560.png');
}

// 生成所有图片
console.log('Generating Chrome Web Store promotional images...\n');

try {
  generateScreenshot1();
  generateScreenshot2();
  generateScreenshot3();
  generateSmallPromoTile();
  generateMarqueePromoTile();
  
  console.log('\n✅ All promotional images generated successfully!');
  console.log(`📁 Output directory: ${outputDir}`);
  console.log('\nGenerated files:');
  console.log('  - screenshot-1-1280x800.png (侧边栏界面展示)');
  console.log('  - screenshot-2-1280x800.png (功能特性展示)');
  console.log('  - screenshot-3-1280x800.png (转换效果展示)');
  console.log('  - small-promo-tile-440x280.png (小型宣传图块)');
  console.log('  - marquee-promo-tile-1400x560.png (顶部宣传图块)');
} catch (error) {
  console.error('❌ Error generating images:', error);
  process.exit(1);
}
