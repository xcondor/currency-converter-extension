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
      display: inline-flex;
      align-items: center;
      gap: 6px;
      margin-left: 8px;
      padding: 6px 12px;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      border-radius: 6px;
      font-size: 0.9em;
      font-weight: 700;
      font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
      white-space: nowrap;
      cursor: help;
      box-shadow: 0 2px 8px rgba(16, 185, 129, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2);
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      letter-spacing: 0.5px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      position: relative;
      overflow: hidden;
    `;

    // 金额文本
    const amountText = document.createElement('span');
    amountText.textContent = conversion.formattedResult;
    amountText.style.cssText = `
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
      font-variant-numeric: tabular-nums;
    `;

    // 添加闪光效果
    const shine = document.createElement('span');
    shine.style.cssText = `
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: linear-gradient(
        45deg,
        transparent 30%,
        rgba(255, 255, 255, 0.3) 50%,
        transparent 70%
      );
      transform: translateX(-100%);
      pointer-events: none;
    `;

    container.appendChild(amountText);
    container.appendChild(shine);

    // 悬停效果 - 更有质感
    container.addEventListener('mouseenter', () => {
      container.style.transform = 'scale(1.08) translateY(-2px)';
      container.style.boxShadow = '0 4px 16px rgba(16, 185, 129, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
      // 触发闪光动画
      shine.style.animation = 'shine 0.6s ease';
    });

    container.addEventListener('mouseleave', () => {
      container.style.transform = 'scale(1) translateY(0)';
      container.style.boxShadow = '0 2px 8px rgba(16, 185, 129, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
      shine.style.animation = '';
    });

    // 添加闪光动画样式
    if (!document.getElementById('currency-converter-shine-animation')) {
      const style = document.createElement('style');
      style.id = 'currency-converter-shine-animation';
      style.textContent = `
        @keyframes shine {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `;
      document.head.appendChild(style);
    }

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
    
    // 清理动画样式
    const shineStyle = document.getElementById('currency-converter-shine-animation');
    if (shineStyle) {
      shineStyle.remove();
    }
  }
}

export const overlay = new Overlay();
