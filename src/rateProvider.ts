import { RateCache, RateResponse } from './types';
import { API_CONFIG } from './config';

/**
 * 汇率提供器
 * 负责获取和缓存汇率数据
 */

export class RateProvider {
  /**
   * 获取汇率数据（优先使用缓存）
   */
  async getRates(baseCurrency: string): Promise<RateResponse> {
    try {
      // 检查缓存
      const cached = await this.getCached(baseCurrency);
      if (cached && this.isCacheValid(cached)) {
        return {
          rates: cached.rates,
          base: cached.base,
          timestamp: cached.timestamp,
          cached: true
        };
      }

      // 缓存无效或不存在，从 API 获取
      const fresh = await this.fetchFromAPI(baseCurrency);
      await this.updateCache(fresh);
      
      return {
        rates: fresh.rates,
        base: fresh.base,
        timestamp: fresh.timestamp,
        cached: false
      };
    } catch (error) {
      console.error('Failed to get rates:', error);
      
      // 尝试使用过期缓存
      const cached = await this.getCached(baseCurrency);
      if (cached) {
        console.warn('Using stale cache due to API error');
        return {
          rates: cached.rates,
          base: cached.base,
          timestamp: cached.timestamp,
          cached: true
        };
      }
      
      throw error;
    }
  }

  /**
   * 从 API 获取汇率
   */
  async fetchFromAPI(baseCurrency: string): Promise<RateCache> {
    const url = `${API_CONFIG.BASE_URL}/${API_CONFIG.API_KEY}/latest/${baseCurrency}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      rates: data.conversion_rates,
      base: data.base_code,
      timestamp: Date.now(),
      source: 'exchangerate-api'
    };
  }

  /**
   * 获取缓存的汇率
   */
  async getCached(baseCurrency: string): Promise<RateCache | null> {
    try {
      const key = `rateCache_${baseCurrency}`;
      const result = await chrome.storage.local.get(key);
      return result[key] || null;
    } catch (error) {
      console.error('Failed to get cached rates:', error);
      return null;
    }
  }

  /**
   * 更新缓存
   */
  async updateCache(cache: RateCache): Promise<void> {
    try {
      const key = `rateCache_${cache.base}`;
      await chrome.storage.local.set({ [key]: cache });
    } catch (error) {
      console.error('Failed to update cache:', error);
    }
  }

  /**
   * 检查缓存是否有效
   */
  isCacheValid(cache: RateCache): boolean {
    const age = Date.now() - cache.timestamp;
    return age < API_CONFIG.CACHE_DURATION;
  }
}

// 导出单例
export const rateProvider = new RateProvider();
