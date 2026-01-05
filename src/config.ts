// API 配置
export const API_CONFIG = {
  API_KEY: '63b85a6ebcfdfb4181267653',
  BASE_URL: 'https://v6.exchangerate-api.com/v6',
  CACHE_DURATION: 60 * 60 * 1000, // 1 小时（毫秒）
};

// 支持的货币列表
export const SUPPORTED_CURRENCIES = [
  'USD', 'EUR', 'GBP', 'JPY', 'CNY', 'CAD', 'AUD', 'CHF',
  'HKD', 'SGD', 'KRW', 'INR', 'RUB', 'BRL', 'MXN', 'ZAR'
];

// 货币符号映射
export const CURRENCY_SYMBOL_MAP: Record<string, string> = {
  '$': 'USD',
  '€': 'EUR',
  '£': 'GBP',
  '¥': 'JPY',
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
