// 简单的检测器测试
const SUPPORTED_CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'CAD', 'AUD', 'CHF', 'HKD', 'SGD', 'KRW', 'INR', 'RUB', 'BRL', 'MXN', 'ZAR'];
const CURRENCY_SYMBOL_MAP = {
  '$': 'USD',
  '€': 'EUR',
  '£': 'GBP',
  '￥': 'CNY',
  '₹': 'INR',
  '₽': 'RUB',
  '₩': 'KRW',
  'C$': 'CAD',
  'A$': 'AUD',
  'HK$': 'HKD',
  'S$': 'SGD',
  'R$': 'BRL',
  'R': 'ZAR'
};

const SYMBOL_PATTERN = /(?<![A-Z])([¥￥$€£₹₽₩]|C\$|A\$|HK\$|S\$|R\$|R)\s*(\d+(?:[,\s]\d{3})*(?:\.\d+)?)/gi;

function detectYenCurrency(text, matchIndex) {
  const contextStart = Math.max(0, matchIndex - 20);
  const contextEnd = Math.min(text.length, matchIndex + 50);
  const context = text.substring(contextStart, contextEnd);
  
  if (/[元人民币]|RMB|CNY/i.test(context)) {
    return 'CNY';
  }
  
  if (/[円]|日元|JPY/i.test(context)) {
    return 'JPY';
  }
  
  if (/[\u4e00-\u9fa5]/.test(context)) {
    return 'CNY';
  }
  
  return 'CNY';
}

function normalizeCurrencyCode(symbol, context, matchIndex) {
  const normalized = symbol.trim().toUpperCase();
  
  if (normalized === 'RMB') return 'CNY';
  if (normalized === '元' || normalized === '人民币') return 'CNY';
  
  if (symbol === '¥' && context !== undefined && matchIndex !== undefined) {
    return detectYenCurrency(context, matchIndex);
  }
  
  const mapped = CURRENCY_SYMBOL_MAP[symbol];
  if (mapped) return mapped;
  
  if (SUPPORTED_CURRENCIES.includes(normalized)) {
    return normalized;
  }
  
  return '';
}

// 测试
console.log('=== 测试货币检测 ===\n');

const tests = [
  { text: '$100', expected: 'USD' },
  { text: '¥100', expected: 'CNY' },
  { text: '€50', expected: 'EUR' },
  { text: '£75', expected: 'GBP' },
  { text: '价格 ¥100 元', expected: 'CNY' },
  { text: '¥1000円', expected: 'JPY' },
];

tests.forEach(test => {
  SYMBOL_PATTERN.lastIndex = 0;
  const match = SYMBOL_PATTERN.exec(test.text);
  if (match) {
    const symbol = match[1];
    const currency = normalizeCurrencyCode(symbol, test.text, match.index);
    const status = currency === test.expected ? '✅' : '❌';
    console.log(`${status} "${test.text}" -> ${currency} (expected: ${test.expected})`);
  } else {
    console.log(`❌ "${test.text}" -> NO MATCH`);
  }
});
