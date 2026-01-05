// Content Script 内容脚本
import { detectCurrency } from './detector';
import { convert } from './converter';
import { overlay } from './overlay';
import { Settings, DEFAULT_SETTINGS } from './types';
import { i18n } from './i18n';

console.log('Currency Converter Extension: Content script loaded');

let settings: Settings = DEFAULT_SETTINGS;
let currentRates: Record<string, number> = {};
let isProcessing = false;
let isLoading = false;
let isInitialized = false;

// 初始化
async function init() {
  try {
    // 防止重复初始化
    if (isInitialized && !isLoading) {
      console.log('Already initialized, re-scanning page...');
      scanAndConvert();
      return;
    }

    console.log('Initializing currency converter...');

    // 加载语言设置
    await i18n.loadLanguage();
    
    // 显示加载状态
    if (!isLoading) {
      isLoading = true;
      showLoadingNotification();
    }

    // 加载设置
    const result = await chrome.storage.local.get('settings');
    settings = result.settings || DEFAULT_SETTINGS;
    
    console.log('Settings loaded:', settings);
    
    // 同步语言
    if (settings.language) {
      await i18n.setLanguage(settings.language);
    }

    // 检查是否启用
    if (!settings.enabled) {
      console.log('Extension is disabled');
      hideLoadingNotification();
      isLoading = false;
      isInitialized = true;
      return;
    }

    // 获取汇率
    console.log('Fetching exchange rates...');
    const response = await chrome.runtime.sendMessage({
      type: 'GET_RATES',
      payload: { baseCurrency: settings.baseCurrency }
    });

    if (response && response.rates) {
      currentRates = response.rates;
      console.log('Rates loaded:', Object.keys(currentRates).length, 'currencies');
      hideLoadingNotification();
      isLoading = false;
      isInitialized = true;
      // 扫描页面
      scanAndConvert();
    } else {
      throw new Error('Failed to get rates from response');
    }
  } catch (error) {
    console.error('Failed to initialize:', error);
    hideLoadingNotification();
    isLoading = false;
    isInitialized = true;
    
    // 如果是 runtime 错误（扩展被重载），不显示错误通知
    if (error instanceof Error && error.message.includes('Extension context invalidated')) {
      console.log('Extension context invalidated, will retry on next visibility change');
      isInitialized = false; // 重置标志，下次可见时重试
    } else {
      showNotification(i18n.t('fetchRatesFailed'), 'error');
    }
  }
}

// 显示加载通知
function showLoadingNotification() {
  const existing = document.getElementById('currency-converter-loading');
  if (existing) return;

  const notification = document.createElement('div');
  notification.id = 'currency-converter-loading';
  notification.innerHTML = `
    <div style="display: flex; align-items: center; gap: 12px;">
      <div class="spinner"></div>
      <span>${i18n.t('fetchingRates')}</span>
    </div>
  `;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 16px 24px;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
    z-index: 999999;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    font-weight: 600;
  `;

  // 添加旋转动画样式
  const style = document.createElement('style');
  style.id = 'currency-converter-loading-style';
  style.textContent = `
    .spinner {
      width: 20px;
      height: 20px;
      border: 3px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(notification);
}

// 隐藏加载通知
function hideLoadingNotification() {
  const notification = document.getElementById('currency-converter-loading');
  const style = document.getElementById('currency-converter-loading-style');
  if (notification) notification.remove();
  if (style) style.remove();
}

// 扫描并转换页面中的货币
function scanAndConvert() {
  if (isProcessing) {
    console.log('Already processing, skipping scan');
    return;
  }
  
  isProcessing = true;
  console.log('Starting currency scan...');

  try {
    // 移除旧的覆盖层
    overlay.removeAll();

    // 检查是否启用
    if (!settings.enabled) {
      console.log('Extension is disabled, skipping scan');
      return;
    }

    // 检查是否有汇率数据
    if (!currentRates || Object.keys(currentRates).length === 0) {
      console.log('No rates available, skipping scan');
      return;
    }

    // 查找所有文本节点
    const textNodes = getTextNodes(document.body);
    console.log('Found', textNodes.length, 'text nodes to scan');
    
    let convertedCount = 0;

    textNodes.forEach(node => {
      if (!node.textContent) return;

      const text = node.textContent;
      const detections = detectCurrency(text);

      if (detections.length === 0) return;

      // 为每个检测到的货币创建转换显示
      detections.forEach(detection => {
        // 跳过已经是目标货币的
        if (detection.currency === settings.baseCurrency) {
          return;
        }

        const result = convert(
          detection.amount,
          detection.currency,
          settings.baseCurrency,
          currentRates,
          settings.decimalPlaces
        );

        if (result) {
          // 在文本节点后插入覆盖层
          insertOverlay(node, result);
          convertedCount++;
        }
      });
    });

    if (convertedCount > 0) {
      console.log(`✓ Converted ${convertedCount} currency amounts`);
    } else {
      console.log('No currency amounts found to convert');
    }
  } catch (error) {
    console.error('Failed to scan and convert:', error);
  } finally {
    isProcessing = false;
  }
}

// 获取所有文本节点
function getTextNodes(element: Node): Text[] {
  const textNodes: Text[] = [];
  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: (node) => {
        // 跳过脚本和样式标签
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        
        const tagName = parent.tagName.toLowerCase();
        if (tagName === 'script' || tagName === 'style' || tagName === 'noscript') {
          return NodeFilter.FILTER_REJECT;
        }

        // 跳过已经有覆盖层的
        if (parent.classList.contains('currency-converter-overlay')) {
          return NodeFilter.FILTER_REJECT;
        }

        // 只处理有实际内容的文本节点
        if (node.textContent && node.textContent.trim().length > 0) {
          return NodeFilter.FILTER_ACCEPT;
        }

        return NodeFilter.FILTER_REJECT;
      }
    }
  );

  let node;
  while ((node = walker.nextNode())) {
    textNodes.push(node as Text);
  }

  return textNodes;
}

// 在文本节点后插入覆盖层
function insertOverlay(textNode: Text, result: any) {
  try {
    const parent = textNode.parentElement;
    if (!parent) return;

    // 创建覆盖层
    const overlayElement = overlay.create(result, settings.showExchangeRate);

    // 在文本节点后插入
    if (textNode.nextSibling) {
      parent.insertBefore(overlayElement, textNode.nextSibling);
    } else {
      parent.appendChild(overlayElement);
    }
  } catch (error) {
    console.error('Failed to insert overlay:', error);
  }
}

// 显示通知
function showNotification(message: string, type: 'success' | 'error' = 'success') {
  const notification = document.createElement('div');
  notification.innerHTML = `
    <div style="display: flex; align-items: center; gap: 8px;">
      <span style="font-size: 20px;">${type === 'success' ? '💱' : '⚠️'}</span>
      <span>${message}</span>
    </div>
  `;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, ${type === 'success' ? '#667eea 0%, #764ba2' : '#ef4444 0%, #dc2626'} 100%);
    color: white;
    padding: 16px 24px;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
    z-index: 999999;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    font-weight: 600;
    animation: slideInRight 0.3s ease;
  `;

  // 添加动画样式
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInRight {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    @keyframes slideOutRight {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(notification);

  // 3秒后淡出并移除
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => {
      notification.remove();
      style.remove();
    }, 300);
  }, 3000);
}

// 监听设置变化
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.settings) {
    const newSettings = changes.settings.newValue;
    const oldSettings = changes.settings.oldValue || {};
    
    settings = newSettings;
    
    // 同步语言设置
    if (newSettings.language && newSettings.language !== oldSettings.language) {
      i18n.setLanguage(newSettings.language);
    }
    
    console.log('Settings changed:', newSettings);
    
    // 如果禁用了，移除所有覆盖层
    if (!newSettings.enabled) {
      overlay.removeAll();
    } 
    // 如果从禁用变为启用，或者货币/精度设置改变，重新扫描
    else if (!oldSettings.enabled || 
             oldSettings.baseCurrency !== newSettings.baseCurrency ||
             oldSettings.decimalPlaces !== newSettings.decimalPlaces) {
      // 重新初始化并扫描
      init();
    }
  }
});

// 监听页面可见性变化（标签页切换）
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    console.log('Tab became visible, checking state...');
    console.log('- Initialized:', isInitialized);
    console.log('- Enabled:', settings.enabled);
    console.log('- Has rates:', Object.keys(currentRates).length > 0);
    
    if (isInitialized && settings.enabled && Object.keys(currentRates).length > 0) {
      console.log('Re-scanning page...');
      scanAndConvert();
    } else if (!isInitialized) {
      console.log('Not initialized yet, initializing...');
      init();
    } else if (!settings.enabled) {
      console.log('Extension is disabled, skipping scan');
    } else if (Object.keys(currentRates).length === 0) {
      console.log('No rates available, re-initializing...');
      init();
    }
  }
});

// 监听 DOM 变化（动态内容加载）
const observer = new MutationObserver((mutations) => {
  // 检查是否有新的文本内容
  const hasNewContent = mutations.some(mutation => {
    return mutation.addedNodes.length > 0 || 
           (mutation.type === 'characterData' && mutation.target.textContent);
  });

  if (hasNewContent && isInitialized && settings.enabled && !isProcessing) {
    // 使用防抖延迟，避免频繁扫描
    clearTimeout((window as any).currencyConverterDebounce);
    (window as any).currencyConverterDebounce = setTimeout(() => {
      console.log('DOM changed, re-scanning...');
      scanAndConvert();
    }, 500);
  }
});

// 启动函数
function startup() {
  console.log('Currency Converter: Starting up...');
  console.log('- Document ready state:', document.readyState);
  console.log('- URL:', window.location.href);
  
  // 初始化
  init();
  
  // 开始监听 DOM 变化
  try {
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });
    console.log('DOM observer started');
  } catch (error) {
    console.error('Failed to start DOM observer:', error);
  }
}

// 启动
if (document.readyState === 'loading') {
  console.log('Document still loading, waiting for DOMContentLoaded...');
  document.addEventListener('DOMContentLoaded', startup);
} else {
  console.log('Document already loaded, starting immediately...');
  startup();
}

// 监听来自 background 的消息（用于扩展重载后触发）
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'EXTENSION_RELOADED') {
    console.log('Extension reloaded, re-initializing...');
    isInitialized = false;
    isLoading = false;
    init();
    sendResponse({ success: true });
  }
  return true;
});

// 添加全局错误处理
window.addEventListener('error', (event) => {
  if (event.message.includes('Extension context invalidated')) {
    console.log('Extension context invalidated, resetting state...');
    isInitialized = false;
    isLoading = false;
  }
});
