import { DetectionResult } from './types';
import { CURRENCY_SYMBOL_MAP, SUPPORTED_CURRENCIES } from './config';

/**
 * 货币检测器
 * 负责从文本中识别货币金额和货币类型
 */

// 货币符号正则（支持常见符号，R 前面不能是字母）
// 改进：价格后面不能跟着数字（避免匹配到 ¥33601 这种情况，实际是 ¥336 + 01万人购买）
// 使用更严格的匹配：只匹配合理的价格格式
// 支持千位分隔符：$1,234.56 或 $1234.56
const SYMBOL_PATTERN = /(?<![A-Z])([¥￥$€£₹₽₩]|C\$|A\$|HK\$|S\$|R\$|R)\s*(\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?|\d{1,6}(?:\.\d{1,2})?)(?![,.\d])/gi;

// ISO 代码正则（货币代码在数字后面）
const ISO_AFTER_PATTERN = /(?:^|[^\d])(\d+(?:[,\s]\d{3})*(?:\.\d+)?)\s+(USD|EUR|GBP|JPY|CNY|CAD|AUD|CHF|HKD|SGD|KRW|INR|RUB|BRL|MXN|ZAR|RMB)\b/gi;

// ISO 代码正则（货币代码在数字前面）
const ISO_BEFORE_PATTERN = /\b(USD|EUR|GBP|JPY|CNY|CAD|AUD|CHF|HKD|SGD|KRW|INR|RUB|BRL|MXN|ZAR|RMB)\s+(\d+(?:[,\s]\d{3})*(?:\.\d+)?)/gi;

// 中文货币格式（必须有 ¥/￥ 符号或者元/人民币/RMB 后缀）
const CHINESE_PATTERN = /(?:(¥|￥)\s*(\d+(?:[,\s]\d{3})*(?:\.\d+)?)|(\d+(?:[,\s]\d{3})*(?:\.\d+)?)\s*(元|人民币|RMB))/g;

/**
 * 智能判断 ¥ 符号代表的货币
 * 根据上下文判断是 CNY（人民币）还是 JPY（日元）
 */
function detectYenCurrency(text: string, matchIndex: number): string {
  // 检查附近是否有中文标识
  const contextStart = Math.max(0, matchIndex - 20);
  const contextEnd = Math.min(text.length, matchIndex + 50);
  const context = text.substring(contextStart, contextEnd);
  
  // 中文标识：元、人民币、RMB、CNY
  if (/[元人民币]|RMB|CNY/i.test(context)) {
    return 'CNY';
  }
  
  // 日文标识：円、日元、JPY
  if (/[円]|日元|JPY/i.test(context)) {
    return 'JPY';
  }
  
  // 检查是否有中文字符（简单判断：如果上下文中有中文，很可能是人民币）
  if (/[\u4e00-\u9fa5]/.test(context)) {
    return 'CNY';
  }
  
  // 默认返回 CNY（因为中文网站更常见）
  return 'CNY';
}

/**
 * 标准化货币代码
 * 将货币符号或别名转换为标准 ISO 代码
 */
export function normalizeCurrencyCode(symbol: string, context?: string, matchIndex?: number): string {
  const normalized = symbol.trim().toUpperCase();
  
  // 处理特殊情况
  if (normalized === 'RMB') return 'CNY';
  if (normalized === '元' || normalized === '人民币') return 'CNY';
  
  // 特殊处理 ¥ 符号（需要根据上下文判断）
  if (symbol === '¥' && context !== undefined && matchIndex !== undefined) {
    return detectYenCurrency(context, matchIndex);
  }
  
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
 * 验证金额是否合理
 * 过滤掉明显不是价格的数字
 */
function isValidPrice(amount: number, context: string): boolean {
  // 价格范围：0.01 到 999,999
  if (amount < 0.01 || amount > 999999) {
    return false;
  }
  
  // 过滤掉"X+人购买"、"X人付款"、"X+评价"等模式
  // 这些是购买人数、评价数量，不是价格
  if (/\d+\+?\s*[人+]+(购买|付款|评价|已购|已付|已售|销量|成交)/.test(context)) {
    // 检查金额是否出现在这些词前面（说明是人数，不是价格）
    const amountStr = amount.toString();
    const pattern = new RegExp(`${amountStr}\\+?\\s*[人+]+(购买|付款|评价|已购|已付|已售|销量|成交)`);
    if (pattern.test(context)) {
      console.log(`⏭ Skipping purchase count: ${amount} (matched pattern: ${amountStr}+人购买)`);
      return false;
    }
  }
  
  // 如果金额超过 10000，检查是否合理
  if (amount > 10000) {
    // 检查上下文是否同时包含价格符号和"人购买"（说明可能是拼接错误）
    const hasPrice = /[$¥￥€£₹₽₩]/.test(context);
    const hasPurchaseInfo = /\d+\s*[人+]+(购买|付款|评价)/.test(context);
    
    if (hasPrice && hasPurchaseInfo) {
      return false;
    }
    
    // 如果上下文包含"黄金"、"足金"、"纯度"等，可能是黄金纯度而非价格
    if (/黄金|足金|纯度|K金|AU|9999|999|990|916/.test(context)) {
      return false;
    }
  }
  
  // 如果金额是整千或整万（如 1000, 5000, 10000），检查上下文
  if (amount >= 1000 && amount % 1000 === 0) {
    // 如果上下文包含"黄金"、"足金"、"纯度"等，可能是黄金纯度而非价格
    if (/黄金|足金|纯度|K金|AU|9999|999|990|916/.test(context)) {
      return false;
    }
  }
  
  // 如果金额是 4 位数且都相同（如 9999, 8888），可能不是价格
  const amountStr = amount.toString();
  if (amountStr.length === 4 && /^(\d)\1{3}$/.test(amountStr)) {
    // 除非上下文明确包含价格相关词汇
    if (!/价格|售价|¥|元|RMB/.test(context)) {
      return false;
    }
  }
  
  return true;
}

/**
 * 清理价格金额，移除可能误匹配的部分
 * 例如：¥33601 可能是 ¥336 + 01万人购买
 */
function cleanAmount(amount: number, context: string, matchIndex: number): number {
  const amountStr = amount.toString();
  
  // 检查金额后面是否紧跟着"万"、"千"等单位（说明可能是购买人数）
  // 例如：¥33601万+人购买 → 实际价格是 ¥336，01万是购买人数
  const afterMatch = context.substring(matchIndex);
  
  // 匹配模式：数字后面紧跟着"万"、"千"、"+"、"人"
  const followPattern = /^[¥￥$€£₹₽₩]\s*\d+(\d{2})(万|千|\+|人)/;
  const match = afterMatch.match(followPattern);
  
  if (match && match[1]) {
    // 找到了可疑的后缀数字
    const suspiciousSuffix = match[1]; // 例如 "01"
    
    // 检查原金额是否以这个后缀结尾
    if (amountStr.endsWith(suspiciousSuffix)) {
      // 移除后缀，得到真实价格
      const cleanedStr = amountStr.substring(0, amountStr.length - suspiciousSuffix.length);
      const cleanedAmount = parseFloat(cleanedStr);
      
      if (!isNaN(cleanedAmount) && cleanedAmount > 0) {
        console.log(`🔧 Cleaned amount: ${amount} → ${cleanedAmount} (removed suffix: ${suspiciousSuffix})`);
        return cleanedAmount;
      }
    }
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
      const currency = normalizeCurrencyCode(symbol, text, match.index);
      
      if (currency && SUPPORTED_CURRENCIES.includes(currency)) {
        let amount = parseAmount(amountStr);
        
        // 清理金额（移除可能的购买人数后缀）
        amount = cleanAmount(amount, text, match.index);
        
        // 验证金额是否合理
        if (amount > 0 && isValidPrice(amount, text)) {
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
        if (amount > 0 && isValidPrice(amount, text)) {
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
        if (amount > 0 && isValidPrice(amount, text)) {
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
      // 新的正则有两种模式：
      // 模式1: (¥|￥)\s*(\d+) - match[1] 是符号, match[2] 是金额
      // 模式2: (\d+)\s*(元|人民币|RMB) - match[3] 是金额, match[4] 是后缀
      
      const symbol = match[1];  // ¥ 或 ￥
      const amountWithSymbol = match[2];  // 符号后的金额
      const amountWithSuffix = match[3];  // 后缀前的金额
      const suffix = match[4];  // 元、人民币、RMB
      
      const amountStr = amountWithSymbol || amountWithSuffix;
      
      // 必须有符号或后缀才算人民币
      if ((symbol || suffix) && amountStr) {
        const amount = parseAmount(amountStr);
        if (amount > 0 && isValidPrice(amount, text)) {
          const key = `${match.index}-CNY-${amount}`;
          if (!seen.has(key)) {
            results.push({
              amount,
              currency: 'CNY',
              rawText: match[0],
              confidence: 0.95  // 提高置信度，因为有明确的中文标识
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
