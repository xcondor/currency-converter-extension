import { detectCurrency, normalizeCurrencyCode, parseAmount } from '../../src/detector';

describe('Currency Detector - Unit Tests', () => {
  describe('detectCurrency', () => {
    test('should detect USD with dollar sign', () => {
      const text = 'Price: $99.99';
      const results = detectCurrency(text);
      
      expect(results).toHaveLength(1);
      expect(results[0].amount).toBe(99.99);
      expect(results[0].currency).toBe('USD');
    });

    test('should detect EUR with euro sign', () => {
      const text = 'Cost: €50.00';
      const results = detectCurrency(text);
      
      expect(results).toHaveLength(1);
      expect(results[0].amount).toBe(50.00);
      expect(results[0].currency).toBe('EUR');
    });

    test('should detect GBP with pound sign', () => {
      const text = 'Price: £25.50';
      const results = detectCurrency(text);
      
      expect(results).toHaveLength(1);
      expect(results[0].amount).toBe(25.50);
      expect(results[0].currency).toBe('GBP');
    });

    test('should detect CNY with yuan sign', () => {
      const text = '价格：￥100';
      const results = detectCurrency(text);
      
      expect(results).toHaveLength(1);
      expect(results[0].amount).toBe(100);
      expect(results[0].currency).toBe('CNY');
    });

    test('should detect ISO code after amount', () => {
      const text = 'Total: 1000 USD';
      const results = detectCurrency(text);
      
      expect(results).toHaveLength(1);
      expect(results[0].amount).toBe(1000);
      expect(results[0].currency).toBe('USD');
    });

    test('should detect ISO code before amount', () => {
      const text = 'Price: EUR 250.00';
      const results = detectCurrency(text);
      
      expect(results).toHaveLength(1);
      expect(results[0].amount).toBe(250.00);
      expect(results[0].currency).toBe('EUR');
    });

    test('should detect Chinese currency format with 元', () => {
      const text = '价格：100元';
      const results = detectCurrency(text);
      
      expect(results).toHaveLength(1);
      expect(results[0].amount).toBe(100);
      expect(results[0].currency).toBe('CNY');
    });

    test('should detect Chinese currency format with 人民币', () => {
      const text = '总计：500人民币';
      const results = detectCurrency(text);
      
      expect(results).toHaveLength(1);
      expect(results[0].amount).toBe(500);
      expect(results[0].currency).toBe('CNY');
    });

    test('should detect multiple currencies in text', () => {
      const text = 'USD price: $100, EUR price: €85';
      const results = detectCurrency(text);
      
      expect(results.length).toBeGreaterThanOrEqual(2);
    });

    test('should handle empty input', () => {
      const results = detectCurrency('');
      expect(results).toEqual([]);
    });

    test('should handle text without currency', () => {
      const text = 'This is just plain text with numbers 123 but no currency';
      const results = detectCurrency(text);
      expect(results).toEqual([]);
    });

    test('should handle comma-separated numbers', () => {
      const text = 'Price: $1,234.56';
      const results = detectCurrency(text);
      
      expect(results).toHaveLength(1);
      expect(results[0].amount).toBe(1234.56);
      expect(results[0].currency).toBe('USD');
    });

    test('should handle space-separated numbers', () => {
      const text = 'Price: 1 234 EUR';
      const results = detectCurrency(text);
      
      expect(results).toHaveLength(1);
      expect(results[0].amount).toBe(1234);
      expect(results[0].currency).toBe('EUR');
    });
  });

  describe('normalizeCurrencyCode', () => {
    test('should normalize RMB to CNY', () => {
      expect(normalizeCurrencyCode('RMB')).toBe('CNY');
      expect(normalizeCurrencyCode('rmb')).toBe('CNY');
    });

    test('should normalize 元 to CNY', () => {
      expect(normalizeCurrencyCode('元')).toBe('CNY');
    });

    test('should normalize 人民币 to CNY', () => {
      expect(normalizeCurrencyCode('人民币')).toBe('CNY');
    });

    test('should map currency symbols correctly', () => {
      expect(normalizeCurrencyCode('$')).toBe('USD');
      expect(normalizeCurrencyCode('€')).toBe('EUR');
      expect(normalizeCurrencyCode('£')).toBe('GBP');
      expect(normalizeCurrencyCode('￥')).toBe('CNY');
    });

    test('should return ISO code as-is if valid', () => {
      expect(normalizeCurrencyCode('USD')).toBe('USD');
      expect(normalizeCurrencyCode('EUR')).toBe('EUR');
      expect(normalizeCurrencyCode('GBP')).toBe('GBP');
    });

    test('should return empty string for unsupported currency', () => {
      expect(normalizeCurrencyCode('XYZ')).toBe('');
      expect(normalizeCurrencyCode('???')).toBe('');
    });
  });

  describe('parseAmount', () => {
    test('should parse plain numbers', () => {
      expect(parseAmount('100')).toBe(100);
      expect(parseAmount('99.99')).toBe(99.99);
    });

    test('should parse comma-separated numbers', () => {
      expect(parseAmount('1,234')).toBe(1234);
      expect(parseAmount('1,234.56')).toBe(1234.56);
    });

    test('should parse space-separated numbers', () => {
      expect(parseAmount('1 234')).toBe(1234);
      expect(parseAmount('1 234.56')).toBe(1234.56);
    });

    test('should handle zero', () => {
      expect(parseAmount('0')).toBe(0);
      expect(parseAmount('0.00')).toBe(0);
    });

    test('should handle very large numbers', () => {
      expect(parseAmount('1000000')).toBe(1000000);
      expect(parseAmount('1,000,000.00')).toBe(1000000);
    });

    test('should return 0 for invalid input', () => {
      expect(parseAmount('abc')).toBe(0);
      expect(parseAmount('')).toBe(0);
      expect(parseAmount('NaN')).toBe(0);
    });

    test('should return 0 for negative numbers', () => {
      expect(parseAmount('-100')).toBe(0);
    });
  });
});
