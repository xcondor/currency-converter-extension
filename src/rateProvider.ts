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
      console.log(`Getting rates for ${baseCurrency}...`);
      
      // 检查缓存
      const cached = await this.getCached(baseCurrency);
      if (cached && this.isCacheValid(cached)) {
        console.log(`✓ Using cached rates (age: ${Math.round((Date.now() - cached.timestamp) / 1000 / 60)}min)`);
        return {
          rates: cached.rates,
          base: cached.base,
          timestamp: cached.timestamp,
          cached: true
        };
      }

      // 缓存无效或不存在，从 API 获取
      console.log('Cache miss or expired, fetching from API...');
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
        console.warn(`⚠️ Using stale cache (age: ${Math.round((Date.now() - cached.timestamp) / 1000 / 60)}min) due to API error`);
        return {
          rates: cached.rates,
          base: cached.base,
          timestamp: cached.timestamp,
          cached: true
        };
      }
      
      // 没有缓存可用，抛出错误
      throw new Error(`无法获取汇率数据：${error instanceof Error ? error.message : '未知错误'}。请检查网络连接。`);
    }
  }

  /**
   * 从 API 获取汇率（带超时和重试）
   */
  async fetchFromAPI(baseCurrency: string): Promise<RateCache> {
    const url = `${API_CONFIG.BASE_URL}/${API_CONFIG.API_KEY}/latest/${baseCurrency}`;
    const timeout = 10000; // 10 秒超时
    const maxRetries = 2; // 最多重试 2 次
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Fetching rates from API (attempt ${attempt + 1}/${maxRetries + 1})...`);
        
        // 创建超时控制器
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        const response = await fetch(url, {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json'
          }
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        if (!data.conversion_rates || !data.base_code) {
          throw new Error('Invalid API response format');
        }
        
        console.log(`✓ Successfully fetched rates for ${baseCurrency}`);
        
        return {
          rates: data.conversion_rates,
          base: data.base_code,
          timestamp: Date.now(),
          source: 'exchangerate-api'
        };
      } catch (error) {
        const isLastAttempt = attempt === maxRetries;
        
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            console.warn(`Request timeout (attempt ${attempt + 1})`);
          } else {
            console.warn(`API request failed (attempt ${attempt + 1}):`, error.message);
          }
        }
        
        if (isLastAttempt) {
          throw new Error(`Failed to fetch rates after ${maxRetries + 1} attempts: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
        
        // 等待后重试（指数退避）
        const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw new Error('Failed to fetch rates');
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
