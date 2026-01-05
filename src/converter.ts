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
    // 相同货币，跳过转换
    if (fromCurrency === toCurrency) {
      return {
        originalAmount: amount,
        originalCurrency: fromCurrency,
        convertedAmount: amount,
        targetCurrency: toCurrency,
        rate: 1,
        formattedResult: formatCurrency(amount, toCurrency, decimalPlaces)
      };
    }

    // 检查汇率是否存在
    if (!rates[fromCurrency] || !rates[toCurrency]) {
      console.warn(`Missing rate for ${fromCurrency} or ${toCurrency}`);
      return null;
    }

    // 计算转换
    const rate = rates[toCurrency] / rates[fromCurrency];
    const converted = amount * rate;

    // 验证结果
    if (!isFinite(converted)) {
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
  // 确保至少 2 位小数
  const minDecimals = Math.max(2, decimals);
  
  // 格式化数字
  const formatted = amount.toFixed(minDecimals);
  
  // 添加千位分隔符
  const parts = formatted.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
  return `${parts.join('.')} ${currency}`;
}
