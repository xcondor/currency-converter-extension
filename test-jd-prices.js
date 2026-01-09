// 测试京东价格格式
const testPrices = [
  '¥83.17',
  '¥219.9',
  '¥458.15',
  '¥2253.69',
  '¥11.6',
  '¥15.3',
  '¥47.90',
  '¥328.00',
  '¥1034.00',
];

const SYMBOL_PATTERN = /(?<![A-Z])([¥￥$€£₹₽₩]|C\$|A\$|HK\$|S\$|R\$|R)\s*(\d+(?:[,\s]\d{3})*(?:\.\d+)?)/gi;

console.log('=== 测试京东价格检测 ===\n');

testPrices.forEach(price => {
  SYMBOL_PATTERN.lastIndex = 0;
  const match = SYMBOL_PATTERN.exec(price);
  if (match) {
    console.log(`✅ "${price}" -> 匹配成功: ${match[1]} ${match[2]}`);
  } else {
    console.log(`❌ "${price}" -> 匹配失败`);
  }
});
