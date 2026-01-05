import fc from 'fast-check';
import { detectCurrency, normalizeCurrencyCode, parseAmount } from '../../src/detector';
import { SUPPORTED_CURRENCIES, CURRENCY_SYMBOL_MAP } from '../../src/config';

// 测试配置
const testConfig = {
  numRuns: 100,
  verbose: false
};

// 生成器：货币金额数据
const currencyAmountArbitrary = fc.record({
  amount: fc.double({ min: 0.01, max: 1000000, noNaN: true, noDefaultInfinity: true }),
  currency: fc.constantFrom(...SUPPORTED_CURRENCIES),
  format: fc.constantFrom('symbol', 'iso-after', 'iso-before')
});

// 辅助函数：格式化货币文本
function formatCurrencyText(data: { amount: number; currency: string; format: string }): string {
  const amountStr = data.amount.toFixed(2);
  
  switch (data.format) {
    case 'symbol': {
      // 查找货币符号
      const symbol = Object.keys(CURRENCY_SYMBOL_MAP).find(
        key => CURRENCY_SYMBOL_MAP[key] === data.currency
      );
      return symbol ? `${symbol}${amountStr}` : `${data.currency} ${amountStr}`;
    }
    case 'iso-after':
      return `${amountStr} ${data.currency}`;
    case 'iso-before':
      return `${data.currency} ${amountStr}`;
    default:
      return `${amountStr} ${data.currency}`;
  }
}

describe('Property Tests - Currency Detection', () => {
  // Feature: currency-converter-extension, Property 1: 货币检测完整性
  test('Property 1: Currency detection completeness', () => {
    fc.assert(
      fc.property(currencyAmountArbitrary, (data) => {
        const text = formatCurrencyText(data);
        const results = detectCurrency(text);
        
        // 应该至少检测到一个结果
        expect(results.length).toBeGreaterThan(0);
        
        // 检测到的金额应该匹配（允许小的浮点误差）
        expect(results[0].amount).toBeCloseTo(data.amount, 2);
        
        // 检测到的货币应该匹配
        expect(results[0].currency).toBe(data.currency);
        
        // 置信度应该在合理范围内
        expect(results[0].confidence).toBeGreaterThan(0);
        expect(results[0].confidence).toBeLessThanOrEqual(1);
      }),
      testConfig
    );
  });
});


describe('Property Tests - Number Format Normalization', () => {
  // 生成器：不同格式的数字字符串
  const numberFormatArbitrary = fc.record({
    value: fc.double({ min: 0.01, max: 1000000, noNaN: true, noDefaultInfinity: true }),
    format: fc.constantFrom('comma', 'space', 'plain', 'decimal')
  });

  // 辅助函数：格式化数字
  function formatNumber(data: { value: number; format: string }): string {
    const rounded = Math.round(data.value * 100) / 100; // 保留2位小数
    const intPart = Math.floor(rounded);
    const decPart = Math.round((rounded - intPart) * 100);
    
    let formatted = intPart.toString();
    
    switch (data.format) {
      case 'comma':
        // 1,234,567.89
        formatted = intPart.toLocaleString('en-US');
        break;
      case 'space':
        // 1 234 567.89
        formatted = intPart.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
        break;
      case 'plain':
      case 'decimal':
        // 1234567.89
        formatted = intPart.toString();
        break;
    }
    
    if (decPart > 0) {
      const decStr = decPart.toString().padStart(2, '0');
      return `${formatted}.${decStr}`;
    }
    
    return formatted;
  }

  // Feature: currency-converter-extension, Property 3: 数字格式标准化
  test('Property 3: Number format normalization', () => {
    fc.assert(
      fc.property(numberFormatArbitrary, (data) => {
        const formattedNumber = formatNumber(data);
        const parsed = parseAmount(formattedNumber);
        
        // 解析后的数字应该接近原始值
        expect(parsed).toBeCloseTo(data.value, 2);
        
        // 解析结果应该是有效数字
        expect(isFinite(parsed)).toBe(true);
        expect(parsed).toBeGreaterThanOrEqual(0);
      }),
      testConfig
    );
  });
});
