// 共享类型定义

export interface CurrencyMatch {
  element: HTMLElement;
  originalText: string;
  amount: number;
  currency: string;
  position: { start: number; end: number };
}

export interface DetectionResult {
  amount: number;
  currency: string;
  rawText: string;
  confidence: number;
}

export interface RateCache {
  rates: Record<string, number>;
  base: string;
  timestamp: number;
  source: string;
}

export interface RateResponse {
  rates: Record<string, number>;
  base: string;
  timestamp: number;
  cached: boolean;
}

export interface ConversionResult {
  originalAmount: number;
  originalCurrency: string;
  convertedAmount: number;
  targetCurrency: string;
  rate: number;
  formattedResult: string;
}

export interface Settings {
  enabled: boolean; // 新增：启用/禁用开关
  baseCurrency: string;
  displayFormat: 'inline' | 'tooltip' | 'both';
  decimalPlaces: number;
  showOriginalCurrency: boolean;
  showExchangeRate: boolean;
  language: 'zh' | 'en'; // 语言设置
  enabledSites: string[];
  disabledSites: string[];
  useWhitelist: boolean;
  autoUpdate: boolean;
  updateInterval: number;
  maxElementsToScan: number;
  debounceDelay: number;
}

export interface Message {
  type: 'GET_RATES' | 'UPDATE_SETTINGS' | 'CLEAR_CACHE';
  payload?: any;
}

export interface StorageData {
  settings: Settings;
  rateCaches: Record<string, RateCache>;
  lastUpdate: number;
}

export const DEFAULT_SETTINGS: Settings = {
  enabled: true, // 默认启用
  baseCurrency: 'CNY',
  displayFormat: 'inline',
  decimalPlaces: 2,
  showOriginalCurrency: true,
  showExchangeRate: true, // 默认显示汇率
  language: 'zh', // 默认中文
  enabledSites: [],
  disabledSites: [],
  useWhitelist: false,
  autoUpdate: true,
  updateInterval: 60,
  maxElementsToScan: 1000,
  debounceDelay: 300
};
