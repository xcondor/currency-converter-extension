import { Settings, DEFAULT_SETTINGS } from './types';

/**
 * 设置管理器
 * 负责管理用户设置的读取和保存
 */

export class SettingsManager {
  /**
   * 加载设置
   */
  async loadSettings(): Promise<Settings> {
    try {
      const result = await chrome.storage.local.get('settings');
      return result.settings || DEFAULT_SETTINGS;
    } catch (error) {
      console.error('Failed to load settings:', error);
      return DEFAULT_SETTINGS;
    }
  }

  /**
   * 保存设置
   */
  async saveSettings(settings: Settings): Promise<void> {
    try {
      await chrome.storage.local.set({ settings });
    } catch (error) {
      console.error('Failed to save settings:', error);
      throw error;
    }
  }

  /**
   * 清除缓存
   */
  async clearCache(): Promise<void> {
    try {
      const keys = await chrome.storage.local.get(null);
      const cacheKeys = Object.keys(keys).filter(key => key.startsWith('rateCache_'));
      if (cacheKeys.length > 0) {
        await chrome.storage.local.remove(cacheKeys);
      }
    } catch (error) {
      console.error('Failed to clear cache:', error);
      throw error;
    }
  }
}

// 导出单例
export const settingsManager = new SettingsManager();
