import { DetectionResult } from './types';
import { CURRENCY_SYMBOL_MAP, SUPPORTED_CURRENCIES } from './config';

/**
 * 货币检测器
 * 负责从文本中识别货币金额和货币类型
 */

// 货币符号正则（支持常见符号，R 前面不能是字母）
const SYMBOL_PATTERN = /(?<![A-Z])([¥￥$€£₹₽₩]|C\$|A\$|HK\$|S\$|R\$|R)\s*(\d+(?:[,\s]\d{3})*(?:\.\d+)?)/gi;

// ISO 代码正则（货币代码在数字后面）
const ISO_AFTER_PATTERN = /(?:^|[^\d])(\d+(?:[,\s]\d{3})*(?:\.\d+)?)\s+(USD|EUR|GBP|JPY|CNY|CAD|AUD|CHF|HKD|SGD|KRW|INR|RUB|BRL|MXN|ZAR|RMB)\b/gi;

// ISO 代码正则（货币代码在数字前面）
const ISO_BEFORE_PATTERN = /\b(USD|EUR|GBP|JPY|CNY|CAD|AUD|CHF|HKD|SGD|KRW|INR|RUB|BRL|MXN|ZAR|RMB)\s+(\d+(?:[,\s]\d{3})*(?:\.\d+)?)/gi;

// 中文货币格式
const CHINESE_PATTERN = /(¥|￥)?\s*(\d+(?:[,\s]\d{3})*(?:\.\d+)?)\s*(元|人民币|RMB)?/g;

/**
 * 标准化货币代码
 * 将货币符号或别名转换为标准 ISO 代码
 */
export function normalizeCurrencyCode(symbol: string): string {
  const normalized = symbol.trim().toUpperCase();
  
  // 处理特殊情况
  if (normalized === 'RMB') return 'CNY';
  if (normalized === '元' || normalized === '人民币') return 'CNY';
  
  // 查找符号映射
  const mapped = CURRENCY_SYMBOL_MAP[symbol];
  if (mapped) return mapped;
  
  // 如果已经是 ISO 代码
  if (SUPPORTED_CURRENCIES.includes(normalized)) {
    return normalized;
  }
  
  return '';
}

/**
 * 解析金额字符串为数字
 * 处理各种数字格式（逗号、空格分隔符等）
 */
export function parseAmount(text: string): number {
  // 移除所有空格和逗号
  const cleaned = text.replace(/[\s,]/g, '');
  
  // 解析为浮点数
  const amount = parseFloat(cleaned);
  
  // 验证结果
  if (isNaN(amount) || !isFinite(amount) || amount < 0) {
    return 0;
  }
  
  return amount;
}

/**
 * 检测文本中的货币金额
 * 返回所有检测到的货币信息
 */
export function detectCurrency(text: string): DetectionResult[] {
  if (!text || typeof text !== 'string') {
    return [];
  }

  const results: DetectionResult[] = [];
  const seen = new Set<string>(); // 避免重复检测

  try {
    // 1. 检测货币符号格式 ($100, €50, ¥1000)
    let match;
    SYMBOL_PATTERN.lastIndex = 0;
    while ((match = SYMBOL_PATTERN.exec(text)) !== null) {
      const symbol = match[1];
      const amountStr = match[2];
      const currency = normalizeCurrencyCode(symbol);
      
      if (currency && SUPPORTED_CURRENCIES.includes(currency)) {
        const amount = parseAmount(amountStr);
        if (amount > 0) {
          const key = `${match.index}-${currency}-${amount}`;
          if (!seen.has(key)) {
            results.push({
              amount,
              currency,
              rawText: match[0],
              confidence: 0.9
            });
            seen.add(key);
          }
        }
      }
    }

    // 2. 检测 ISO 代码在后面的格式 (100 USD, 50 EUR)
    ISO_AFTER_PATTERN.lastIndex = 0;
    while ((match = ISO_AFTER_PATTERN.exec(text)) !== null) {
      const amountStr = match[1];
      const currencyCode = match[2];
      const currency = normalizeCurrencyCode(currencyCode);
      
      if (currency && SUPPORTED_CURRENCIES.includes(currency)) {
        const amount = parseAmount(amountStr);
        if (amount > 0) {
          const key = `${match.index}-${currency}-${amount}`;
          if (!seen.has(key)) {
            results.push({
              amount,
              currency,
              rawText: match[0],
              confidence: 0.95
            });
            seen.add(key);
          }
        }
      }
    }

    // 3. 检测 ISO 代码在前面的格式 (USD 100, EUR 50)
    ISO_BEFORE_PATTERN.lastIndex = 0;
    while ((match = ISO_BEFORE_PATTERN.exec(text)) !== null) {
      const currencyCode = match[1];
      const amountStr = match[2];
      const currency = normalizeCurrencyCode(currencyCode);
      
      if (currency && SUPPORTED_CURRENCIES.includes(currency)) {
        const amount = parseAmount(amountStr);
        if (amount > 0) {
          const key = `${match.index}-${currency}-${amount}`;
          if (!seen.has(key)) {
            results.push({
              amount,
              currency,
              rawText: match[0],
              confidence: 0.95
            });
            seen.add(key);
          }
        }
      }
    }

    // 4. 检测中文货币格式 (¥100, 100元, 100人民币)
    CHINESE_PATTERN.lastIndex = 0;
    while ((match = CHINESE_PATTERN.exec(text)) !== null) {
      const symbol = match[1];
      const amountStr = match[2];
      const suffix = match[3];
      
      // 判断是否为人民币
      if (symbol || suffix) {
        const amount = parseAmount(amountStr);
        if (amount > 0) {
          const key = `${match.index}-CNY-${amount}`;
          if (!seen.has(key)) {
            results.push({
              amount,
              currency: 'CNY',
              rawText: match[0],
              confidence: 0.85
            });
            seen.add(key);
          }
        }
      }
    }

  } catch (error) {
    console.warn('Currency detection error:', error);
    return [];
  }

  return results;
}

/**
 * 扫描 HTML 元素中的货币
 * 用于 Content Script 中扫描页面
 */
export function scanElementForCurrency(element: HTMLElement): DetectionResult[] {
  if (!element || !element.textContent) {
    return [];
  }

  const text = element.textContent;
  return detectCurrency(text);
}
