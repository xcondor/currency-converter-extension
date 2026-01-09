import { ConversionResult } from './types';
import { i18n } from './i18n';

/**
 * UI 覆盖层
 * 在页面上显示转换结果
 */

export class Overlay {
  /**
   * 创建覆盖层元素 - 金钱风格
   */
  create(conversion: ConversionResult, showRate: boolean = false): HTMLElement {
    const container = document.createElement('span');
    container.className = 'currency-converter-overlay';
    container.style.cssText = `
      display: inline-block;
      padding: 2px 6px;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      border-radius: 3px;
      font-size: 0.7em;
      font-weight: 600;
      font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
      white-space: nowrap;
      cursor: help;
      box-shadow: 0 1px 4px rgba(16, 185, 129, 0.3);
      transition: all 0.2s ease;
      letter-spacing: 0.3px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      position: relative;
      vertical-align: middle;
      margin: 0 2px;
      line-height: 1.2;
      opacity: 0.9;
    `;

    // 金额文本
    const amountText = document.createElement('span');
    amountText.textContent = `≈${conversion.formattedResult}`;
    amountText.style.cssText = `
      font-variant-numeric: tabular-nums;
    `;

    container.appendChild(amountText);

    // 悬停效果
    container.addEventListener('mouseenter', () => {
      container.style.opacity = '1';
      container.style.transform = 'scale(1.1)';
      container.style.boxShadow = '0 2px 8px rgba(16, 185, 129, 0.5)';
      container.style.zIndex = '999999';
    });

    container.addEventListener('mouseleave', () => {
      container.style.opacity = '0.9';
      container.style.transform = 'scale(1)';
      container.style.boxShadow = '0 1px 4px rgba(16, 185, 129, 0.3)';
      container.style.zIndex = '';
    });

    // 设置提示信息
    if (showRate) {
      const rateText = i18n.getLanguage() === 'zh'
        ? `💱 ${i18n.t('rateInfo')}: 1 ${conversion.originalCurrency} = ${conversion.rate.toFixed(4)} ${conversion.targetCurrency}`
        : `💱 ${i18n.t('rateInfo')}: 1 ${conversion.originalCurrency} = ${conversion.rate.toFixed(4)} ${conversion.targetCurrency}`;
      container.title = rateText;
    } else {
      container.title = i18n.t('clickToConfig');
    }

    return container;
  }

  /**
   * 移除所有覆盖层
   */
  removeAll() {
    const overlays = document.querySelectorAll('.currency-converter-overlay');
    overlays.forEach(overlay => overlay.remove());
  }
}

export const overlay = new Overlay();
