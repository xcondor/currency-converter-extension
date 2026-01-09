import { ConversionResult } from './types';

/**
 * 货币转换器
 * 负责执行货币转换计算和格式化
 */

/**
 * 转换货币
 */
export function convert(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: Record<string, number>,
  decimalPlaces: number = 2
): ConversionResult | null {
  try {
    // 相同货币，不需要转换
    if (fromCurrency === toCurrency) {
      return null;
    }

    // ExchangeRate-API 的数据结构：
    // 请求 latest/EUR 时，返回的 rates 是以 EUR 为基准的汇率
    // rates.CNY = 7.8 表示 1 EUR = 7.8 CNY
    // rates.USD = 1.1 表示 1 EUR = 1.1 USD
    
    // 情况 1: 从 baseCurrency 转换到其他货币（例如 EUR → CNY）
    // 直接使用 rates[toCurrency]
    
    // 情况 2: 从其他货币转换到 baseCurrency（例如 CNY → EUR）
    // 需要取倒数：1 / rates[fromCurrency]
    
    // 情况 3: 从其他货币转换到其他货币（例如 CNY → USD）
    // 需要先转换到 baseCurrency，再转换到目标货币
    // rate = rates[toCurrency] / rates[fromCurrency]
    
    let rate: number;
    
    if (!rates[fromCurrency]) {
      // fromCurrency 不在 rates 中，说明 fromCurrency 就是 baseCurrency
      // 例如：baseCurrency = EUR, fromCurrency = EUR, toCurrency = CNY
      // 这种情况在前面已经被 if (fromCurrency === toCurrency) 处理了
      // 如果到这里，说明 fromCurrency 是 baseCurrency，toCurrency 是其他货币
      rate = rates[toCurrency];
    } else if (!rates[toCurrency]) {
      // toCurrency 不在 rates 中，说明 toCurrency 就是 baseCurrency
      // 例如：baseCurrency = EUR, fromCurrency = CNY, toCurrency = EUR
      // 需要取倒数
      rate = 1 / rates[fromCurrency];
    } else {
      // 两个都在 rates 中，说明都不是 baseCurrency
      // 例如：baseCurrency = EUR, fromCurrency = CNY, toCurrency = USD
      rate = rates[toCurrency] / rates[fromCurrency];
    }
    
    const converted = amount * rate;

    console.log(`Conversion calculation:`, {
      amount,
      fromCurrency,
      toCurrency,
      fromRate: rates[fromCurrency],
      toRate: rates[toCurrency],
      calculatedRate: rate,
      converted
    });

    // 验证结果
    if (!isFinite(converted) || isNaN(converted)) {
      throw new Error('Conversion resulted in invalid number');
    }

    return {
      originalAmount: amount,
      originalCurrency: fromCurrency,
      convertedAmount: converted,
      targetCurrency: toCurrency,
      rate,
      formattedResult: formatCurrency(converted, toCurrency, decimalPlaces)
    };
  } catch (error) {
    console.error('Conversion error:', error);
    return null;
  }
}

/**
 * 格式化货币金额
 */
export function formatCurrency(
  amount: number,
  currency: string,
  decimals: number = 2
): string {
  // 四舍五入到指定小数位
  const rounded = Math.round(amount * Math.pow(10, decimals)) / Math.pow(10, decimals);
  
  // 格式化数字，固定小数位数
  const formatted = rounded.toFixed(decimals);
  
  // 添加千位分隔符
  const parts = formatted.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
  return `${parts.join('.')} ${currency}`;
}
