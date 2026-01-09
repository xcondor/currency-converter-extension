// Content Script 内容脚本
import { detectCurrency, normalizeCurrencyCode, parseAmount } from './detector';
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

// 全局已处理元素集合（跨多次扫描）
let globalProcessedElements = new Set<Element>(); // 改用 Set 以便清空
const globalProcessedPrices = new Map<string, {element: Element, overlay: HTMLElement}>();

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
    console.log('Base currency (本地货币):', settings.baseCurrency);
    console.log('Enabled:', settings.enabled);
    
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
      // 首次扫描页面（完全扫描）
      fullRescan();
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

// 完全重新扫描（清空所有已处理记录和覆盖层）
function fullRescan() {
  console.log('=== Full Rescan: Clearing all overlays and processed records ===');
  
  // 移除所有覆盖层
  overlay.removeAll();
  
  // 清空全局已处理元素集合
  globalProcessedElements.clear();
  globalProcessedPrices.clear();
  
  console.log('Cleared all processed records, starting fresh scan...');
  
  // 执行扫描
  scanAndConvert();
}

// 扫描并转换页面中的货币
function scanAndConvert() {
  if (isProcessing) {
    console.log('Already processing, skipping scan');
    return;
  }
  
  isProcessing = true;
  console.log('=== Starting Currency Scan ===');
  console.log('Settings:', {
    enabled: settings.enabled,
    baseCurrency: settings.baseCurrency,
    decimalPlaces: settings.decimalPlaces
  });
  console.log('Available rates:', Object.keys(currentRates).length, 'currencies');

  try {
    // 注意：不要在这里清空全局变量或移除覆盖层
    // 延迟扫描应该是增量式的，只处理新元素
    // 只有在设置改变或扩展重新启用时才需要完全重新扫描

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

    // 查找所有可能包含货币的元素
    const elements = findCurrencyElements(document.body);
    console.log('Found', elements.length, 'elements to scan');
    
    let convertedCount = 0;
    // 使用全局变量来跨多次扫描追踪已处理的元素（避免重复解析）
    // globalProcessedElements 和 globalProcessedPrices 在文件顶部声明

    elements.forEach(element => {
      // 避免重复处理（使用全局变量）
      if (globalProcessedElements.has(element)) {
        console.log(`⏭ Element already processed globally, skipping:`, element.className || element.tagName);
        return;
      }
      globalProcessedElements.add(element);

      const text = element.textContent || '';
      if (!text.trim()) return;
      
      // 检查这个元素后面是否已经有覆盖层（说明已经处理过）
      const nextSibling = element.nextElementSibling;
      if (nextSibling && nextSibling.classList.contains('currency-converter-overlay')) {
        console.log(`⏭ Element already has overlay, skipping:`, element.className || element.tagName);
        return;
      }

      // 优先尝试结构化提取（仅用于优化，不强制）
      const structuredPrice = extractPriceFromStructure(element);
      
      let structuredPriceProcessed = false; // 标记是否成功处理了结构化价格
      
      if (structuredPrice) {
        // 使用结构化提取的价格
        const { amount, currency, targetElement } = structuredPrice;
        
        console.log(`📍 Structured price: ${amount} ${currency} from`, targetElement.tagName);
        
        // 创建唯一标识
        const priceKey = `${amount}-${currency}`;
        
        // 检查是否已经处理过（使用全局变量）
        if (globalProcessedPrices.has(priceKey)) {
          console.log(`⏭ Skipping duplicate structured price: ${amount} ${currency}`);
          structuredPriceProcessed = true; // 标记为已处理（虽然是重复的）
        }
        // 如果检测到的货币就是本地货币，不需要转换
        else if (currency === settings.baseCurrency) {
          console.log(`✓ Skipping ${currency} ${amount} (same as base currency)`);
          // 不标记为已处理，因为可能有其他货币
        }
        else {
          console.log(`→ Converting ${currency} to ${settings.baseCurrency}`);
          
          const result = convert(
            amount,
            currency,
            settings.baseCurrency,
            currentRates,
            settings.decimalPlaces
          );

          if (result) {
            console.log(`✓ Conversion result:`, {
              original: `${result.originalAmount} ${result.originalCurrency}`,
              converted: `${result.convertedAmount} ${result.targetCurrency}`,
              formatted: result.formattedResult
            });
            
            // 在元素后插入覆盖层
            const overlay = insertOverlayAfterElement(targetElement, result);
            if (overlay) {
              globalProcessedPrices.set(priceKey, {element: targetElement, overlay});
              convertedCount++;
              structuredPriceProcessed = true; // 标记为已成功处理
            }
          }
        }
      }

      // 文本检测（总是执行，除非结构化提取已成功处理）
      // 这样可以处理元素中的其他价格或不同货币
      if (structuredPriceProcessed) {
        // 结构化提取已成功处理，跳过文本检测（避免重复）
        console.log(`⏭ Skipping text detection (structured price already processed)`);
        return;
      }

      // 文本检测
      const detections = detectCurrency(text);
      
      // 调试：显示所有扫描的元素
      if (detections.length > 0) {
        console.log(`📍 Element text: "${text.substring(0, 100)}"`, 'Detections:', detections.length);
      }
      
      if (detections.length === 0) return;

      // 为每个检测到的货币创建转换显示
      detections.forEach(detection => {
        // 首先检查是否有相同金额和货币的价格已经被处理过（不管在哪个元素上）
        const simpleKey = `${detection.amount}-${detection.currency}`;
        if (globalProcessedPrices.has(simpleKey)) {
          console.log(`⏭ Price already processed: ${detection.amount} ${detection.currency}`);
          return;
        }
        
        // 创建唯一标识：使用元素本身作为键的一部分
        const elementKey = `${detection.amount}-${detection.currency}-${element.tagName}-${element.className}`;
        
        // 检查是否已经处理过这个确切的元素和价格组合（使用全局变量）
        let alreadyProcessed = false;
        globalProcessedPrices.forEach((value, key) => {
          if (key.includes(`${detection.amount}-${detection.currency}`) && value.element === element) {
            alreadyProcessed = true;
          }
        });
        
        if (alreadyProcessed) {
          console.log(`⏭ Already processed this exact element: ${detection.amount} ${detection.currency}`);
          return;
        }
        
        // 检查是否有相同金额和货币的价格已经在父/子/兄弟元素上处理过（使用全局变量）
        let shouldSkip = false;
        globalProcessedPrices.forEach((value, key) => {
          if (key.includes(`${detection.amount}-${detection.currency}`)) {
            const existing = value;
            if (existing && existing.element !== element) {
              const existingElement = existing.element;
              
              // 如果是父子关系，跳过
              if (existingElement.contains(element) || element.contains(existingElement)) {
                console.log(`⏭ Skipping duplicate in parent/child: ${detection.amount} ${detection.currency}`);
                shouldSkip = true;
              }
              // 如果是兄弟关系（有相同的父元素），跳过
              else if (existingElement.parentElement && element.parentElement && 
                       existingElement.parentElement === element.parentElement) {
                console.log(`⏭ Skipping duplicate in sibling: ${detection.amount} ${detection.currency}`);
                shouldSkip = true;
              }
            }
          }
        });
        
        if (shouldSkip) return;

        console.log(`Detected: ${detection.amount} ${detection.currency}, Base: ${settings.baseCurrency}`);
        
        // 如果检测到的货币就是本地货币，不需要转换
        if (detection.currency === settings.baseCurrency) {
          console.log(`✓ Skipping ${detection.currency} ${detection.amount} (same as base currency, no conversion needed)`);
          return;
        }

        console.log(`→ Converting ${detection.currency} to ${settings.baseCurrency}`);
        
        const result = convert(
          detection.amount,
          detection.currency,
          settings.baseCurrency,
          currentRates,
          settings.decimalPlaces
        );

        if (result) {
          console.log(`✓ Conversion result:`, {
            original: `${result.originalAmount} ${result.originalCurrency}`,
            converted: `${result.convertedAmount} ${result.targetCurrency}`,
            formatted: result.formattedResult,
            rate: result.rate
          });
          
          // 在元素后插入覆盖层
          const overlay = insertOverlayAfterElement(element, result);
          if (overlay) {
            globalProcessedPrices.set(elementKey, {element, overlay});
            convertedCount++;
          }
        } else {
          console.warn(`✗ Conversion failed for ${detection.amount} ${detection.currency}`);
        }
      });
    });

    console.log('=== Scan Summary ===');
    console.log(`Total elements scanned: ${elements.length}`);
    console.log(`Converted: ${convertedCount}`);
    
    // 调试：显示前几个检测到的元素
    if (convertedCount === 0 && elements.length > 0) {
      console.log('⚠️ No conversions made. Checking first few elements:');
      elements.slice(0, 10).forEach((el, i) => {
        const text = el.textContent?.substring(0, 80);
        const detections = detectCurrency(el.textContent || '');
        const hasSymbol = /[$¥￥€£]/.test(el.textContent || '');
        console.log(`  ${i + 1}. [${el.tagName}.${el.className}] "${text}"`, {
          detections: detections.length,
          hasSymbol,
          currencies: detections.map(d => `${d.amount} ${d.currency}`)
        });
      });
      
      // 特别检查京东价格结构
      const jdPrices = document.querySelectorAll('.p-price, [class*="price"]');
      console.log(`\n🔍 Found ${jdPrices.length} elements with "price" class`);
      Array.from(jdPrices).slice(0, 5).forEach((el, i) => {
        const text = el.textContent?.trim();
        console.log(`  JD Price ${i + 1}: "${text}"`);
      });
    }
    
    if (convertedCount > 0) {
      console.log(`✓ Converted ${convertedCount} currency amounts`);
    } else {
      console.log('ℹ️ No foreign currency found (all amounts are CNY or no amounts detected)');
    }
  } catch (error) {
    console.error('Failed to scan and convert:', error);
  } finally {
    isProcessing = false;
  }
}

// 从 DOM 结构中提取价格（可选优化，用于处理分散的价格结构）
// 规则：如果元素包含货币符号，尝试提取符号后第一个包含数字的子元素
function extractPriceFromStructure(element: Element): { amount: number; currency: string; targetElement: Element } | null {
  try {
    const text = element.textContent || '';
    
    // 检查是否包含货币符号
    const hasCurrencySymbol = /[$¥￥€£₹₽₩]/.test(text);
    if (!hasCurrencySymbol) {
      return null;
    }
    
    // 总是尝试结构化提取（不再检查是否有干扰文本）
    
    // 查找包含货币符号的直接子元素或文本节点
    let currencySymbol: string | null = null;
    let symbolElement: Element | null = null;
    
    // 先尝试找到包含货币符号的元素
    const children = Array.from(element.children);
    for (const child of children) {
      const childText = child.textContent || '';
      const symbolMatch = childText.match(/[$¥￥€£₹₽₩]/);
      if (symbolMatch && childText.trim() === symbolMatch[0]) {
        // 这个元素只包含货币符号
        currencySymbol = symbolMatch[0];
        symbolElement = child;
        break;
      }
    }
    
    // 如果没找到独立的符号元素，检查文本节点
    if (!currencySymbol) {
      const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        null
      );
      
      let node: Node | null;
      while ((node = walker.nextNode())) {
        const textContent = node.textContent || '';
        const symbolMatch = textContent.match(/[$¥￥€£₹₽₩]/);
        if (symbolMatch) {
          currencySymbol = symbolMatch[0];
          break;
        }
      }
    }
    
    if (!currencySymbol) {
      return null;
    }
    
    // 找到符号后，查找下一个包含数字的兄弟元素
    let numberElement: Element | null = null;
    let numberText: string | null = null;
    
    if (symbolElement) {
      // 从符号元素的下一个兄弟开始查找
      let sibling = symbolElement.nextElementSibling;
      while (sibling) {
        const siblingText = sibling.textContent || '';
        const numberMatch = siblingText.match(/^\s*(\d+(?:\.\d+)?)\s*$/);
        if (numberMatch) {
          numberText = numberMatch[1];
          numberElement = sibling;
          break;
        }
        sibling = sibling.nextElementSibling;
      }
    }
    
    // 如果没找到，尝试查找所有包含数字的子元素（取第一个）
    if (!numberElement) {
      for (const child of children) {
        const childText = child.textContent || '';
        // 跳过包含货币符号的元素
        if (/[$¥￥€£₹₽₩]/.test(childText)) {
          continue;
        }
        // 跳过包含"人购买"等的元素
        if (/[人+]+(购买|付款|评价)/.test(childText)) {
          continue;
        }
        const numberMatch = childText.match(/(\d+(?:\.\d+)?)/);
        if (numberMatch) {
          numberText = numberMatch[1];
          numberElement = child;
          break;
        }
      }
    }
    
    // 如果找到了符号和数字
    if (currencySymbol && numberText && numberElement) {
      const amount = parseFloat(numberText.replace(/,/g, ''));
      
      if (isNaN(amount) || amount <= 0) {
        return null;
      }
      
      // 识别货币类型
      const currency = normalizeCurrencyCode(currencySymbol, text, 0);
      
      if (!currency) {
        return null;
      }
      
      console.log(`🔍 Extracted from structure: ${currencySymbol}${numberText} → ${amount} ${currency}`);
      
      return {
        amount,
        currency,
        targetElement: numberElement
      };
    }
    
    return null;
  } catch (error) {
    console.error('Structure extraction error:', error);
    return null;
  }
}

// 查找所有可能包含货币的元素（通用策略）
function findCurrencyElements(root: Node): Element[] {
  const elements: Element[] = [];
  const seen = new Set<Element>();
  
  // 检测网站类型
  const isAmazon = window.location.hostname.includes('amazon.');
  const isJD = window.location.hostname.includes('jd.com');
  const isTaobao = window.location.hostname.includes('taobao.com') || window.location.hostname.includes('tmall.com');
  
  console.log('🔍 Website detection:', { isAmazon, isJD, isTaobao });
  
  // 策略 1：网站特定选择器（优先级最高）
  const priceSelectors: string[] = [];
  
  // Amazon 特定选择器（放在最前面）
  if (isAmazon) {
    priceSelectors.push(
      '.a-price',
      '.a-price-whole',
      '.a-offscreen',
      '.priceToPay',
      '[data-a-color="price"]',
      '.a-color-price',
      '#priceblock_ourprice',
      '#priceblock_dealprice',
      '.offer-price'
    );
  }
  
  // 京东特定选择器
  if (isJD) {
    priceSelectors.push(
      '.p-price',
      '.J-p-price',
      '[class*="J-p-"]'
    );
  }
  
  // 淘宝特定选择器
  if (isTaobao) {
    priceSelectors.push(
      '.price',
      '.priceInt',
      '.priceFloat',
      '[class*="realPrice"]',
      '[class*="priceText"]'
    );
  }
  
  // 通用选择器
  priceSelectors.push(
    '[class*="price"]',
    '[class*="Price"]',
    '[class*="PRICE"]',
    '[class*="money"]',
    '[class*="Money"]',
    '[class*="amount"]',
    '[class*="Amount"]',
    '[class*="cost"]',
    '[class*="Cost"]',
    '[id*="price"]',
    '[id*="Price"]'
  );
  
  // 执行选择器查询并记录结果
  console.log('🔍 Testing selectors:');
  let selectorMatchCount = 0;
  priceSelectors.forEach(selector => {
    try {
      const priceElements = root instanceof Document 
        ? root.querySelectorAll(selector)
        : (root as Element).querySelectorAll?.(selector);
      
      if (priceElements && priceElements.length > 0) {
        selectorMatchCount++;
        console.log(`  ✓ ${selector}: ${priceElements.length} elements`);
        
        priceElements.forEach(el => {
          const text = el.textContent || '';
          // 放宽条件：只要包含货币符号或数字就接受（不再过滤"人购买"）
          if (/[$¥￥€£₹₽₩]/.test(text) || /\d+/.test(text)) {
            if (!seen.has(el)) {
              elements.push(el);
              seen.add(el);
            }
          }
        });
      }
    } catch (e) {
      // 忽略选择器错误
    }
  });
  
  console.log(`🔍 Selector summary: ${selectorMatchCount}/${priceSelectors.length} selectors matched`);
  
  // 策略 2：使用 TreeWalker 遍历所有包含货币符号的元素
  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_ELEMENT,
    {
      acceptNode: (node) => {
        const element = node as Element;
        const tagName = element.tagName.toLowerCase();
        
        // 跳过脚本、样式等标签
        if (tagName === 'script' || tagName === 'style' || tagName === 'noscript') {
          return NodeFilter.FILTER_REJECT;
        }
        
        // 跳过已经有覆盖层的
        if (element.classList.contains('currency-converter-overlay')) {
          return NodeFilter.FILTER_REJECT;
        }
        
        // 如果已经通过策略 1 找到了，跳过
        if (seen.has(element)) {
          return NodeFilter.FILTER_SKIP;
        }
        
        // 获取完整文本内容（包括隐藏元素，如 Amazon 的 .a-offscreen）
        const fullText = element.textContent || '';
        
        // 放宽文本长度限制：1-1000 字符
        if (fullText.length < 1 || fullText.length > 1000) {
          return NodeFilter.FILTER_SKIP;
        }
        
        // 放宽子元素数量限制：最多 30 个
        const childElementCount = element.children.length;
        if (childElementCount > 30) {
          return NodeFilter.FILTER_SKIP;
        }
        
        // 只要包含货币符号或数字就接受（不再检查"人购买"）
        if (/[$¥￥€£₹₽₩]|\d+/.test(fullText)) {
          return NodeFilter.FILTER_ACCEPT;
        }
        
        return NodeFilter.FILTER_SKIP;
      }
    }
  );

  let node;
  while ((node = walker.nextNode())) {
    const element = node as Element;
    if (!seen.has(element)) {
      elements.push(element);
      seen.add(element);
    }
  }

  console.log(`Found ${elements.length} potential price elements`);

  // 调试：显示前 20 个原始元素
  console.log('Raw elements before deduplication:');
  elements.slice(0, 20).forEach((el, i) => {
    const text = el.textContent?.substring(0, 80);
    const hasSymbol = /[$¥￥€£₹₽₩]/.test(el.textContent || '');
    const hasNumber = /\d+/.test(el.textContent || '');
    console.log(`  ${i + 1}. [${el.tagName}.${el.className || '(no class)'}] $:${hasSymbol} #:${hasNumber} "${text}"`);
  });
  
  // 网站特定检查
  if (isAmazon) {
    console.log('\n🛒 Amazon-specific price check:');
    const amazonSelectors = [
      '.a-price',
      '.a-offscreen',
      '.a-price-whole',
      '.priceToPay',
      '[data-a-color="price"]'
    ];
    amazonSelectors.forEach(selector => {
      const amazonElements = document.querySelectorAll(selector);
      console.log(`  ${selector}: ${amazonElements.length} elements`);
      if (amazonElements.length > 0) {
        const sample = amazonElements[0];
        console.log(`    Sample: "${sample.textContent?.trim().substring(0, 60)}"`);
      }
    });
  }
  
  if (isJD) {
    console.log('\n🛒 JD-specific price check:');
    const jdSelectors = ['.p-price', '.J-p-price', '[class*="J-p-"]'];
    jdSelectors.forEach(selector => {
      const jdElements = document.querySelectorAll(selector);
      console.log(`  ${selector}: ${jdElements.length} elements`);
      if (jdElements.length > 0) {
        const sample = jdElements[0];
        console.log(`    Sample: "${sample.textContent?.trim().substring(0, 60)}"`);
      }
    });
  }
  
  if (isTaobao) {
    console.log('\n🛒 Taobao-specific price check:');
    const taobaoSelectors = ['.price', '.priceInt', '.priceFloat'];
    taobaoSelectors.forEach(selector => {
      const taobaoElements = document.querySelectorAll(selector);
      console.log(`  ${selector}: ${taobaoElements.length} elements`);
      if (taobaoElements.length > 0) {
        const sample = taobaoElements[0];
        console.log(`    Sample: "${sample.textContent?.trim().substring(0, 60)}"`);
      }
    });
  }
  
  // 严格去重：移除所有父元素和重复的兄弟元素，只保留最内层的子元素
  const toRemove = new Set<Element>();
  
  elements.forEach(element => {
    if (toRemove.has(element)) return;
    
    // 找出所有是这个元素子元素的元素
    const childrenInList = elements.filter(other => 
      other !== element && element.contains(other) && !toRemove.has(other)
    );
    
    // 如果有子元素，检查是否应该移除父元素
    if (childrenInList.length > 0) {
      const parentHasPrice = /[$¥￥€£₹₽₩]\s*[\d,]+\.?\d*/.test(element.textContent || '');
      
      // 检查是否有子元素也包含价格
      const childrenWithPrice = childrenInList.filter(child => 
        /[$¥￥€£₹₽₩]\s*[\d,]+\.?\d*/.test(child.textContent || '')
      );
      
      // 如果有子元素包含价格，移除父元素
      if (childrenWithPrice.length > 0) {
        toRemove.add(element);
        console.log(`  Removing parent (has ${childrenWithPrice.length} children with prices):`, element.className || element.tagName);
      }
    }
    
    // 检查兄弟元素：如果有相同父元素的兄弟包含相同的价格文本，只保留第一个
    if (!toRemove.has(element) && element.parentElement) {
      const siblings = elements.filter(other => 
        other !== element && 
        !toRemove.has(other) &&
        other.parentElement === element.parentElement
      );
      
      if (siblings.length > 0) {
        const elementText = element.textContent?.trim() || '';
        const elementPrice = elementText.match(/[$¥￥€£₹₽₩]\s*[\d,]+\.?\d*/)?.[0];
        
        if (elementPrice) {
          siblings.forEach(sibling => {
            const siblingText = sibling.textContent?.trim() || '';
            const siblingPrice = siblingText.match(/[$¥￥€£₹₽₩]\s*[\d,]+\.?\d*/)?.[0];
            
            // 如果兄弟元素包含相同的价格，移除后面的（保留第一个）
            if (siblingPrice === elementPrice) {
              // 比较元素在 DOM 中的位置
              const position = element.compareDocumentPosition(sibling);
              // 如果 sibling 在 element 后面，移除 sibling
              if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
                toRemove.add(sibling);
                console.log(`  Removing duplicate sibling with same price "${elementPrice}":`, sibling.className || sibling.tagName);
              }
            }
          });
        }
      }
    }
  });
  
  const filtered = elements.filter(element => !toRemove.has(element));
  
  console.log(`Deduplication: removed ${toRemove.size} elements (parents + duplicate siblings), kept ${filtered.length} elements`);
  
  // 最终过滤：只移除明显无关的元素
  const finalFiltered = filtered.filter(element => {
    const text = element.textContent || '';
    const trimmed = text.trim();
    
    // 排除只包含"X+人购买"、"X人付款"等模式的元素（这些是购买人数，不是价格）
    // 例如："200+人购买"、"1000+人已购"、"500人付款"
    if (/^\d+\+?\s*[人+]+(购买|付款|评价|已购|已付|已售|销量|成交)\s*$/.test(trimmed)) {
      console.log(`  ⏭ Skipping purchase count element: "${trimmed}"`);
      return false;
    }
    
    // 保留所有包含货币符号的元素
    if (/[$¥￥€£₹₽₩]/.test(text)) {
      return true;
    }
    
    // 保留包含 USD, EUR 等货币代码的元素
    if (/\b(USD|EUR|GBP|CNY|JPY|CAD|AUD)\b/i.test(text)) {
      return true;
    }
    
    // 排除纯数字且很短的文本（如 "0", "1", "44"）
    if (/^\d+$/.test(trimmed) && trimmed.length < 3) {
      return false;
    }
    
    // 其他情况保留
    return true;
  });

  console.log(`Element selection: ${elements.length} total, ${finalFiltered.length} after filtering, ${elements.length - finalFiltered.length} removed`);
  
  // 调试：显示前几个被选中的元素
  if (finalFiltered.length > 0) {
    console.log('Sample selected elements:');
    finalFiltered.slice(0, 10).forEach((el, i) => {
      const text = el.textContent?.substring(0, 60);
      const className = el.className || '(no class)';
      console.log(`  ${i + 1}. [${el.tagName}.${className}] "${text}"`);
    });
  }
  
  return finalFiltered;
}

// 获取所有文本节点（保留作为备用）
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

// 在元素后插入覆盖层（紧跟在价格后面）
function insertOverlayAfterElement(element: Element, result: any): HTMLElement | null {
  try {
    // 检查元素后面是否已经有覆盖层
    let nextSibling = element.nextElementSibling;
    if (nextSibling && nextSibling.classList.contains('currency-converter-overlay')) {
      console.log('⚠️ Overlay already exists, skipping');
      return null; // 已经有覆盖层了，跳过
    }

    // 创建覆盖层 - 优化样式，更美观
    const overlayElement = document.createElement('span');
    overlayElement.className = 'currency-converter-overlay';
    overlayElement.style.cssText = `
      display: inline-block;
      margin-left: 6px;
      padding: 2px 8px;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      border-radius: 4px;
      font-size: 0.85em;
      font-weight: 500;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      white-space: nowrap;
      vertical-align: middle;
      line-height: 1.4;
      opacity: 0.95;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08);
      transition: all 0.2s ease;
      cursor: default;
    `;
    
    overlayElement.textContent = `≈ ${result.formattedResult}`;
    
    // 添加悬停效果
    overlayElement.addEventListener('mouseenter', () => {
      overlayElement.style.opacity = '1';
      overlayElement.style.transform = 'translateY(-1px)';
      overlayElement.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)';
    });
    
    overlayElement.addEventListener('mouseleave', () => {
      overlayElement.style.opacity = '0.95';
      overlayElement.style.transform = 'translateY(0)';
      overlayElement.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08)';
    });

    // 获取父元素
    const parent = element.parentElement;
    if (!parent) {
      console.warn('Element has no parent, cannot insert overlay');
      return null;
    }

    // 直接在元素后面插入（作为兄弟元素）
    if (element.nextSibling) {
      parent.insertBefore(overlayElement, element.nextSibling);
    } else {
      parent.appendChild(overlayElement);
    }

    console.log(`✓ Inserted overlay after element:`, element.tagName, element.textContent?.substring(0, 30));
    return overlayElement;
  } catch (error) {
    console.error('Failed to insert overlay after element:', error);
    return null;
  }
}

// 在文本节点后插入覆盖层（保留作为备用）
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
chrome.storage.onChanged.addListener(async (changes, area) => {
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
      // 清空全局已处理元素集合
      globalProcessedPrices.clear();
    } 
    // 如果从禁用变为启用，或者货币/精度设置改变，完全重新扫描
    else if (!oldSettings.enabled || 
             oldSettings.baseCurrency !== newSettings.baseCurrency ||
             oldSettings.decimalPlaces !== newSettings.decimalPlaces) {
      
      // 如果本地货币改变了，需要先获取新的汇率
      if (oldSettings.baseCurrency !== newSettings.baseCurrency) {
        console.log(`Base currency changed: ${oldSettings.baseCurrency} → ${newSettings.baseCurrency}`);
        console.log('Fetching new exchange rates...');
        
        try {
          // 获取新的汇率
          const response = await chrome.runtime.sendMessage({
            type: 'GET_RATES',
            payload: { baseCurrency: newSettings.baseCurrency }
          });
          
          if (response && response.rates) {
            currentRates = response.rates;
            console.log('New rates loaded:', Object.keys(currentRates).length, 'currencies');
            
            // 完全重新扫描
            fullRescan();
          } else {
            console.error('Failed to get new rates');
            showNotification(i18n.t('fetchRatesFailed'), 'error');
          }
        } catch (error) {
          console.error('Failed to fetch new rates:', error);
          showNotification(i18n.t('fetchRatesFailed'), 'error');
        }
      } else {
        // 只是精度改变或从禁用变为启用，直接重新扫描
        fullRescan();
      }
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
  // 检查是否有新的文本内容（忽略我们自己插入的覆盖层）
  const hasNewContent = mutations.some(mutation => {
    // 忽略我们自己插入的覆盖层
    if (mutation.addedNodes.length > 0) {
      const hasNonOverlayNodes = Array.from(mutation.addedNodes).some(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as Element;
          return !element.classList.contains('currency-converter-overlay');
        }
        return node.nodeType === Node.TEXT_NODE;
      });
      return hasNonOverlayNodes;
    }
    
    return mutation.type === 'characterData' && mutation.target.textContent;
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

// 监听滚动事件（处理懒加载内容）
let scrollTimeout: number;
window.addEventListener('scroll', () => {
  if (!isInitialized || !settings.enabled || isProcessing) return;
  
  clearTimeout(scrollTimeout);
  scrollTimeout = window.setTimeout(() => {
    console.log('Scroll detected, checking for new content...');
    scanAndConvert();
  }, 1000);
}, { passive: true });

// 使用 Intersection Observer 监听元素进入视口
const intersectionObserver = new IntersectionObserver((entries) => {
  if (!isInitialized || !settings.enabled || isProcessing) return;
  
  const hasNewVisibleElements = entries.some(entry => entry.isIntersecting);
  
  if (hasNewVisibleElements) {
    clearTimeout((window as any).currencyConverterIntersectionDebounce);
    (window as any).currencyConverterIntersectionDebounce = setTimeout(() => {
      console.log('New elements visible, re-scanning...');
      scanAndConvert();
    }, 500);
  }
}, {
  rootMargin: '50px' // 提前 50px 开始检测
});

// 启动函数
function startup() {
  console.log('Currency Converter: Starting up...');
  console.log('- Document ready state:', document.readyState);
  console.log('- URL:', window.location.href);
  
  // 初始化
  init();
  
  // 电商网站特殊处理：延迟扫描（等待动态内容加载）
  const isAmazon = window.location.hostname.includes('amazon.');
  const isJD = window.location.hostname.includes('jd.com');
  const isTaobao = window.location.hostname.includes('taobao.com') || window.location.hostname.includes('tmall.com');
  
  if (isAmazon || isJD || isTaobao) {
    const siteName = isAmazon ? 'Amazon' : isJD ? 'JD' : 'Taobao';
    console.log(`🛒 ${siteName} detected, scheduling delayed scans...`);
    
    // 第一次延迟扫描（2秒后）
    setTimeout(() => {
      console.log(`🛒 ${siteName}: First delayed scan (2s)`);
      if (isInitialized && settings.enabled) {
        scanAndConvert();
      }
    }, 2000);
    
    // 第二次延迟扫描（5秒后，确保所有内容加载完成）
    setTimeout(() => {
      console.log(`🛒 ${siteName}: Second delayed scan (5s)`);
      if (isInitialized && settings.enabled) {
        scanAndConvert();
      }
    }, 5000);
  }
  
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
  
  // 监听所有可能包含价格的元素
  try {
    // 监听常见的商品容器
    const priceContainers = document.querySelectorAll('[class*="price"], [class*="item"], [class*="product"], [class*="goods"]');
    priceContainers.forEach(container => {
      intersectionObserver.observe(container);
    });
    console.log(`Intersection observer started, watching ${priceContainers.length} containers`);
  } catch (error) {
    console.error('Failed to start intersection observer:', error);
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
