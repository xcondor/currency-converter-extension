// Popup UI 逻辑
import { Settings, DEFAULT_SETTINGS } from './types';
import { i18n, Language } from './i18n';

console.log('Currency Converter Extension: Popup loaded');

let settings: Settings = DEFAULT_SETTINGS;

// DOM 元素
const enabledCheckbox = document.getElementById('enabled') as HTMLInputElement;
const baseCurrencySelect = document.getElementById('baseCurrency') as HTMLSelectElement;
const decimalPlacesInput = document.getElementById('decimalPlaces') as HTMLInputElement;
const showRateCheckbox = document.getElementById('showExchangeRate') as HTMLInputElement;
const statusText = document.getElementById('statusText') as HTMLSpanElement;
const clearCacheButton = document.getElementById('clearCache') as HTMLButtonElement;
const messageDiv = document.getElementById('message') as HTMLDivElement;
const langBtn = document.getElementById('langBtn') as HTMLButtonElement;
const langText = document.getElementById('langText') as HTMLSpanElement;

// 初始化国际化
async function initI18n() {
  await i18n.loadLanguage();
  updateUI();
}

// 更新界面文本
function updateUI() {
  const lang = i18n.getLanguage();
  
  // 更新语言按钮文字
  langText.textContent = lang === 'zh' ? 'EN' : '中文';
  
  // 更新所有带 data-i18n 属性的元素
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n') as any;
    if (key) {
      element.textContent = i18n.t(key);
    }
  });
  
  // 更新 HTML lang 属性
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
}

// 切换语言
async function toggleLanguage() {
  const currentLang = i18n.getLanguage();
  const newLang: Language = currentLang === 'zh' ? 'en' : 'zh';
  
  await i18n.setLanguage(newLang);
  
  // 同步到设置
  settings.language = newLang;
  await chrome.storage.local.set({ settings });
  
  updateUI();
  updateStatus(); // 重新更新状态文本
  
  showMessage(i18n.t('settingsSaved'), 'success');
}

// 加载设置
async function loadSettings() {
  try {
    const result = await chrome.storage.local.get('settings');
    settings = result.settings || DEFAULT_SETTINGS;

    // 同步语言设置
    if (settings.language) {
      await i18n.setLanguage(settings.language);
      updateUI();
    }

    // 填充表单
    enabledCheckbox.checked = settings.enabled;
    baseCurrencySelect.value = settings.baseCurrency;
    decimalPlacesInput.value = settings.decimalPlaces.toString();
    showRateCheckbox.checked = settings.showExchangeRate;

    updateStatus();
  } catch (error) {
    console.error('Failed to load settings:', error);
    showMessage(i18n.t('settingsLoadFailed'), 'error');
  }
}

// 自动保存设置
async function autoSaveSettings() {
  try {
    settings = {
      ...settings,
      enabled: enabledCheckbox.checked,
      baseCurrency: baseCurrencySelect.value,
      decimalPlaces: parseInt(decimalPlacesInput.value),
      showExchangeRate: showRateCheckbox.checked
    };

    await chrome.runtime.sendMessage({
      type: 'UPDATE_SETTINGS',
      payload: { settings }
    });

    // 显示保存提示
    showMessage(i18n.t('settingsSaved'), 'success');
  } catch (error) {
    console.error('Failed to save settings:', error);
    showMessage(i18n.t('settingsSaveFailed'), 'error');
  }
}

// 清除缓存
async function clearCache() {
  try {
    await chrome.runtime.sendMessage({
      type: 'CLEAR_CACHE',
      payload: {}
    });

    showMessage(i18n.t('cacheCleared'), 'success');
    updateStatus();
  } catch (error) {
    console.error('Failed to clear cache:', error);
    showMessage(i18n.t('cacheClearFailed'), 'error');
  }
}

// 更新状态
async function updateStatus() {
  try {
    const key = `rateCache_${settings.baseCurrency}`;
    const result = await chrome.storage.local.get(key);
    const cache = result[key];

    if (cache) {
      const age = Date.now() - cache.timestamp;
      const minutes = Math.floor(age / 60000);
      
      if (age < 60 * 60 * 1000) {
        const timeText = i18n.getLanguage() === 'zh' 
          ? `(${minutes} ${i18n.t('minutesAgo')})` 
          : `(${minutes} ${i18n.t('minutesAgo')})`;
        statusText.textContent = `${i18n.t('statusLatest')} ${timeText}`;
      } else {
        const hours = Math.floor(minutes / 60);
        const timeText = i18n.getLanguage() === 'zh'
          ? `(${hours} ${i18n.t('hoursAgo')})`
          : `(${hours} ${i18n.t('hoursAgo')})`;
        statusText.textContent = `${i18n.t('statusExpired')} ${timeText}`;
      }
    } else {
      statusText.textContent = i18n.t('statusNotCached');
    }
  } catch (error) {
    statusText.textContent = i18n.t('statusFailed');
  }
}

// 显示消息
function showMessage(text: string, type: 'success' | 'error') {
  messageDiv.textContent = text;
  messageDiv.className = `message ${type}`;
  messageDiv.classList.remove('hidden');

  // 成功消息 2 秒后自动消失，错误消息 4 秒
  const duration = type === 'success' ? 2000 : 4000;
  
  setTimeout(() => {
    messageDiv.classList.add('hidden');
  }, duration);
}

// 事件监听 - 所有设置变化时自动保存
enabledCheckbox.addEventListener('change', autoSaveSettings);
baseCurrencySelect.addEventListener('change', () => {
  autoSaveSettings();
  updateStatus(); // 更新汇率状态
});
decimalPlacesInput.addEventListener('change', autoSaveSettings);
showRateCheckbox.addEventListener('change', autoSaveSettings);
clearCacheButton.addEventListener('click', clearCache);
langBtn.addEventListener('click', toggleLanguage);

// 初始化
initI18n().then(() => {
  loadSettings();
});
