// Service Worker 后台服务
import { rateProvider } from './rateProvider';
import { settingsManager } from './settingsManager';
import { Message } from './types';

console.log('Currency Converter Extension: Service Worker loaded');

// 扩展安装或更新时通知所有标签页
chrome.runtime.onInstalled.addListener(async (details) => {
  console.log('Extension installed/updated:', details.reason);
  
  // 通知所有已打开的标签页重新初始化
  const tabs = await chrome.tabs.query({});
  for (const tab of tabs) {
    if (tab.id) {
      try {
        await chrome.tabs.sendMessage(tab.id, { type: 'EXTENSION_RELOADED' });
      } catch (error) {
        // 忽略无法发送消息的标签页（如 chrome:// 页面）
      }
    }
  }
});

// 点击插件图标时打开侧边栏
chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ windowId: tab.windowId });
});

// 监听来自 Content Script 和 Popup 的消息
chrome.runtime.onMessage.addListener((message: Message, sender, sendResponse) => {
  handleMessage(message, sender)
    .then(sendResponse)
    .catch(error => {
      console.error('Message handler error:', error);
      sendResponse({ error: error.message });
    });
  
  // 返回 true 表示异步响应
  return true;
});

async function handleMessage(message: Message, sender: chrome.runtime.MessageSender): Promise<any> {
  switch (message.type) {
    case 'GET_RATES': {
      const { baseCurrency } = message.payload;
      const rates = await rateProvider.getRates(baseCurrency);
      return rates;
    }

    case 'UPDATE_SETTINGS': {
      const { settings } = message.payload;
      await settingsManager.saveSettings(settings);
      return { success: true };
    }

    case 'CLEAR_CACHE': {
      await settingsManager.clearCache();
      return { success: true };
    }

    default:
      throw new Error(`Unknown message type: ${message.type}`);
  }
}