/**
 * 国际化模块
 * 支持中英文切换
 */

export type Language = 'zh' | 'en';

export interface I18nMessages {
  // 头部
  appName: string;
  appSubtitle: string;

  // 功能控制卡片
  controlTitle: string;
  autoConvertLabel: string;
  autoConvertDesc: string;

  // 设置卡片
  settingsTitle: string;
  baseCurrencyLabel: string;
  decimalPlacesLabel: string;
  showRateLabel: string;

  // 货币选项
  currencyCNY: string;
  currencyUSD: string;
  currencyEUR: string;
  currencyGBP: string;
  currencyJPY: string;
  currencyKRW: string;
  currencyHKD: string;

  // 状态卡片
  statusTitle: string;
  statusLoading: string;
  statusLatest: string;
  statusExpired: string;
  statusNotCached: string;
  statusFailed: string;
  statusDesc: string;

  // 按钮
  clearCacheBtn: string;

  // 消息提示
  settingsSaved: string;
  settingsSaveFailed: string;
  cacheCleared: string;
  cacheClearFailed: string;
  settingsLoadFailed: string;
  convertedCount: string;
  conversionDisabled: string;
  fetchingRates: string;
  fetchRatesFailed: string;

  // 底部
  footerText: string;

  // 汇率信息
  rateInfo: string;
  clickToConfig: string;

  // 时间单位
  minutesAgo: string;
  hoursAgo: string;
}

const translations: Record<Language, I18nMessages> = {
  zh: {
    appName: '汇率转换器',
    appSubtitle: '实时货币转换助手',

    controlTitle: '功能控制',
    autoConvertLabel: '自动转换',
    autoConvertDesc: '开启后自动识别并转换页面货币',

    settingsTitle: '转换设置',
    baseCurrencyLabel: '本地货币',
    decimalPlacesLabel: '小数位数',
    showRateLabel: '悬停时显示汇率信息',

    currencyCNY: '🇨🇳 人民币 (CNY)',
    currencyUSD: '🇺🇸 美元 (USD)',
    currencyEUR: '🇪🇺 欧元 (EUR)',
    currencyGBP: '🇬🇧 英镑 (GBP)',
    currencyJPY: '🇯🇵 日元 (JPY)',
    currencyKRW: '🇰🇷 韩元 (KRW)',
    currencyHKD: '🇭🇰 港币 (HKD)',

    statusTitle: '汇率状态',
    statusLoading: '加载中...',
    statusLatest: '汇率状态: 最新',
    statusExpired: '汇率状态: 已过期',
    statusNotCached: '汇率状态: 未缓存',
    statusFailed: '汇率状态: 加载失败',
    statusDesc: '汇率数据每小时更新',

    clearCacheBtn: '清除缓存',

    settingsSaved: '设置已自动保存',
    settingsSaveFailed: '保存设置失败',
    cacheCleared: '缓存已清除',
    cacheClearFailed: '清除缓存失败',
    settingsLoadFailed: '加载设置失败',
    convertedCount: '已转换',
    conversionDisabled: '自动转换已禁用',
    fetchingRates: '正在获取汇率数据...',
    fetchRatesFailed: '获取汇率失败，请检查网络连接',

    footerText: '数据由 ExchangeRate-API 提供',

    rateInfo: '汇率',
    clickToConfig: '点击插件图标可配置设置',

    minutesAgo: '分钟前更新',
    hoursAgo: '小时前'
  },

  en: {
    appName: 'Currency Converter',
    appSubtitle: 'Real-time Currency Conversion Assistant',

    controlTitle: 'Function Control',
    autoConvertLabel: 'Auto Convert',
    autoConvertDesc: 'Automatically detect and convert currencies on page',

    settingsTitle: 'Conversion Settings',
    baseCurrencyLabel: 'Base Currency',
    decimalPlacesLabel: 'Decimal Places',
    showRateLabel: 'Show exchange rate on hover',

    currencyCNY: '🇨🇳 Chinese Yuan (CNY)',
    currencyUSD: '🇺🇸 US Dollar (USD)',
    currencyEUR: '🇪🇺 Euro (EUR)',
    currencyGBP: '🇬🇧 British Pound (GBP)',
    currencyJPY: '🇯🇵 Japanese Yen (JPY)',
    currencyKRW: '🇰🇷 Korean Won (KRW)',
    currencyHKD: '🇭🇰 Hong Kong Dollar (HKD)',

    statusTitle: 'Exchange Rate Status',
    statusLoading: 'Loading...',
    statusLatest: 'Status: Latest',
    statusExpired: 'Status: Expired',
    statusNotCached: 'Status: Not Cached',
    statusFailed: 'Status: Load Failed',
    statusDesc: 'Exchange rates update hourly',

    clearCacheBtn: 'Clear Cache',

    settingsSaved: 'Settings saved automatically',
    settingsSaveFailed: 'Failed to save settings',
    cacheCleared: 'Cache cleared',
    cacheClearFailed: 'Failed to clear cache',
    settingsLoadFailed: 'Failed to load settings',
    convertedCount: 'Converted',
    conversionDisabled: 'Auto conversion disabled',
    fetchingRates: 'Fetching exchange rates...',
    fetchRatesFailed: 'Failed to fetch rates, please check network',

    footerText: 'Data provided by ExchangeRate-API',

    rateInfo: 'Rate',
    clickToConfig: 'Click extension icon to configure',

    minutesAgo: 'min ago',
    hoursAgo: 'hr ago'
  }
};

export class I18n {
  private currentLanguage: Language = 'zh';

  constructor() {
    this.loadLanguage();
  }

  /**
   * 加载保存的语言设置
   */
  async loadLanguage(): Promise<void> {
    try {
      const result = await chrome.storage.local.get('language');
      this.currentLanguage = result.language || 'zh';
    } catch (error) {
      console.error('Failed to load language:', error);
    }
  }

  /**
   * 设置语言
   */
  async setLanguage(lang: Language): Promise<void> {
    this.currentLanguage = lang;
    try {
      await chrome.storage.local.set({ language: lang });
    } catch (error) {
      console.error('Failed to save language:', error);
    }
  }

  /**
   * 获取当前语言
   */
  getLanguage(): Language {
    return this.currentLanguage;
  }

  /**
   * 获取翻译文本
   */
  t(key: keyof I18nMessages): string {
    return translations[this.currentLanguage][key];
  }

  /**
   * 获取所有翻译
   */
  getMessages(): I18nMessages {
    return translations[this.currentLanguage];
  }
}

// 导出单例
export const i18n = new I18n();
