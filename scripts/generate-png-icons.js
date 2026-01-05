// 使用 canvas 生成 PNG 图标
const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// 创建渐变背景的图标
function createIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // 绘制渐变背景
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#667eea');
  gradient.addColorStop(1, '#764ba2');

  // 绘制圆角矩形背景
  const radius = size * 0.22;
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.moveTo(radius, 0);
  ctx.lineTo(size - radius, 0);
  ctx.quadraticCurveTo(size, 0, size, radius);
  ctx.lineTo(size, size - radius);
  ctx.quadraticCurveTo(size, size, size - radius, size);
  ctx.lineTo(radius, size);
  ctx.quadraticCurveTo(0, size, 0, size - radius);
  ctx.lineTo(0, radius);
  ctx.quadraticCurveTo(0, 0, radius, 0);
  ctx.closePath();
  ctx.fill();

  // 绘制白色圆形背景
  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size * 0.35, 0, Math.PI * 2);
  ctx.fill();

  // 绘制 ¥ 符号
  ctx.fillStyle = '#667eea';
  ctx.font = `bold ${size * 0.5}px Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('¥', size / 2, size / 2);

  return canvas;
}

// 确保目录存在
const iconsDir = path.join(__dirname, '../public/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// 生成不同尺寸的 PNG 图标
const sizes = [16, 48, 128];

console.log('🎨 Generating PNG icons...\n');

sizes.forEach(size => {
  const canvas = createIcon(size);
  const buffer = canvas.toBuffer('image/png');
  const filename = path.join(iconsDir, `icon${size}.png`);
  
  fs.writeFileSync(filename, buffer);
  console.log(`✓ Generated ${filename} (${buffer.length} bytes)`);
});

console.log('\n✨ All PNG icons generated successfully!');
console.log('📌 Icons feature:');
console.log('   - Purple gradient background (#667eea → #764ba2)');
console.log('   - White circular base');
console.log('   - Purple ¥ symbol');
console.log('   - PNG format (Chrome compatible)');
