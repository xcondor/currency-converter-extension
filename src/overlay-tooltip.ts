import { ConversionResult } from './types';
import { i18n } from './i18n';

/**
 * Tooltip 模式的覆盖层
 * 鼠标悬停时显示，不占用页面空间
 */

export class TooltipOverlay {
  private tooltip: HTMLElement | null = null;

  /**
   * 为元素添加悬停提示
   */
  addTooltip(element: Element, conversion: ConversionResult): void {
    // 添加下划线样式，表示可以悬停
    (element as HTMLElement).style.cssText += `
      text-decoration: underline;
      text-decoration-style: dotted;
      text-decoration-color: #10b981;
      cursor: help;
    `;

    // 鼠标进入时显示提示
    element.addEventListener('mouseenter', (e) => {
      this.showTooltip(e as MouseEvent, conversion);
    });

    // 鼠标离开时隐藏提示
    element.addEventListener('mouseleave', () => {
      this.hideTooltip();
    });
  }

  /**
   * 显示提示框
   */
  private showTooltip(event: MouseEvent, conversion: ConversionResult): void {
    // 移除旧的提示框
    this.hideTooltip();

    // 创建新的提示框
    this.tooltip = document.createElement('div');
    this.tooltip.className = 'currency-converter-tooltip';
    this.tooltip.style.cssText = `
      position: fixed;
      z-index: 999999;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 600;
      font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
      pointer-events: none;
      white-space: nowrap;
      animation: fadeIn 0.2s ease;
    `;

    this.tooltip.textContent = `≈ ${conversion.formattedResult}`;

    // 添加动画
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-5px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(this.tooltip);

    // 定位提示框
    this.positionTooltip(event);
  }

  /**
   * 定位提示框
   */
  private positionTooltip(event: MouseEvent): void {
    if (!this.tooltip) return;

    const tooltipRect = this.tooltip.getBoundingClientRect();
    const padding = 10;

    let left = event.clientX;
    let top = event.clientY - tooltipRect.height - padding;

    // 确保不超出屏幕
    if (left + tooltipRect.width > window.innerWidth) {
      left = window.innerWidth - tooltipRect.width - padding;
    }

    if (top < 0) {
      top = event.clientY + padding;
    }

    this.tooltip.style.left = `${left}px`;
    this.tooltip.style.top = `${top}px`;
  }

  /**
   * 隐藏提示框
   */
  private hideTooltip(): void {
    if (this.tooltip) {
      this.tooltip.remove();
      this.tooltip = null;
    }
  }

  /**
   * 移除所有提示
   */
  removeAll(): void {
    this.hideTooltip();
    
    // 移除所有下划线样式
    document.querySelectorAll('[style*="text-decoration"]').forEach(element => {
      const el = element as HTMLElement;
      if (el.style.textDecorationColor === 'rgb(16, 185, 129)') {
        el.style.textDecoration = '';
        el.style.cursor = '';
      }
    });
  }
}

export const tooltipOverlay = new TooltipOverlay();
