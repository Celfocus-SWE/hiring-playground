export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastOptions {
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  autoClose?: boolean;
  showCloseButton?: boolean;
  className?: string;
}

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  title?: string;
  options: ToastOptions;
  timestamp: number;
}

class ToastNotification {
  private toasts: Toast[] = [];
  private container: HTMLDivElement | null = null;
  private isEnabled: boolean = true;
  private defaultOptions: ToastOptions = {
    duration: 5000,
    position: 'bottom-right',
    autoClose: true,
    showCloseButton: true,
  };

  constructor() {
    // Only initialize on client side
    if (typeof window !== 'undefined') {
      this.init();
    }
  }

  private init(): void {
    // Create container if it doesn't exist
    if (!this.container) {
      this.createContainer();
    }
  }

  private createContainer(): void {
    if (typeof document === 'undefined') return;
    
    this.container = document.createElement('div');
    this.container.id = 'toast-notification-container';
    this.container.className = 'toast-container';
    document.body.appendChild(this.container);
    this.addStyles();
  }

  private addStyles(): void {
    if (typeof document === 'undefined') return;
    if (document.getElementById('toast-notification-styles')) {
      return; // Styles already added
    }

    const style = document.createElement('style');
    style.id = 'toast-notification-styles';
    style.textContent = `
      .toast-container {
        position: fixed;
        z-index: 9999;
        pointer-events: none;
        max-width: 400px;
        width: 100%;
      }

      .toast-container.top-right {
        top: 20px;
        right: 20px;
      }

      .toast-container.top-left {
        top: 20px;
        left: 20px;
      }

      .toast-container.bottom-right {
        bottom: 20px;
        right: 20px;
      }

      .toast-container.bottom-left {
        bottom: 20px;
        left: 20px;
      }

      .toast-container.top-center {
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
      }

      .toast-container.bottom-center {
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
      }

      .toast {
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        margin-bottom: 10px;
        padding: 16px;
        pointer-events: auto;
        position: relative;
        overflow: hidden;
        animation: toastSlideIn 0.3s ease-out;
        border-left: 4px solid #ccc;
        max-width: 400px;
        min-width: 300px;
      }

      .toast.success {
        border-left-color: #4caf50;
      }

      .toast.error {
        border-left-color: #f44336;
      }

      .toast.info {
        border-left-color: #2196f3;
      }

      .toast.warning {
        border-left-color: #ff9800;
      }

      .toast-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 8px;
      }

      .toast-title {
        font-weight: 600;
        font-size: 14px;
        color: #333;
        margin: 0;
        flex: 1;
      }

      .toast-close {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0;
        margin-left: 8px;
        font-size: 18px;
        color: #999;
        line-height: 1;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all 0.2s;
      }

      .toast-close:hover {
        background: #f5f5f5;
        color: #666;
      }

      .toast-message {
        font-size: 14px;
        color: #666;
        margin: 0;
        line-height: 1.4;
      }

      .toast-progress {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 3px;
        background: #e0e0e0;
        width: 100%;
      }

      .toast-progress-bar {
        height: 100%;
        background: #ccc;
        transition: width linear;
      }

      .toast.success .toast-progress-bar {
        background: #4caf50;
      }

      .toast.error .toast-progress-bar {
        background: #f44336;
      }

      .toast.info .toast-progress-bar {
        background: #2196f3;
      }

      .toast.warning .toast-progress-bar {
        background: #ff9800;
      }

      @keyframes toastSlideIn {
        from {
          transform: translateY(100%);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }

      @keyframes toastSlideOut {
        from {
          transform: translateY(0);
          opacity: 1;
        }
        to {
          transform: translateY(100%);
          opacity: 0;
        }
      }

      .toast.removing {
        animation: toastSlideOut 0.3s ease-in forwards;
      }

      .toast-icon {
        margin-right: 8px;
        font-size: 16px;
      }

      .toast.success .toast-icon::before {
        content: "✓";
        color: #4caf50;
      }

      .toast.error .toast-icon::before {
        content: "✕";
        color: #f44336;
      }

      .toast.info .toast-icon::before {
        content: "ℹ";
        color: #2196f3;
      }

      .toast.warning .toast-icon::before {
        content: "⚠";
        color: #ff9800;
      }
    `;
    document.head.appendChild(style);
  }

  private generateId(): string {
    return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private createToastElement(toast: Toast): HTMLDivElement {
    const toastElement = document.createElement('div');
    toastElement.className = `toast ${toast.type}`;
    toastElement.dataset.toastId = toast.id;

    const options = { ...this.defaultOptions, ...toast.options };

    toastElement.innerHTML = `
      <div class="toast-header">
        <div style="display: flex; align-items: center; flex: 1;">
          <span class="toast-icon"></span>
          <h4 class="toast-title">${toast.title || this.getDefaultTitle(toast.type)}</h4>
        </div>
        ${options.showCloseButton ? '<button class="toast-close" aria-label="Close">×</button>' : ''}
      </div>
      <p class="toast-message">${toast.message}</p>
      ${options.autoClose ? '<div class="toast-progress"><div class="toast-progress-bar"></div></div>' : ''}
    `;

    // Add close button event listener
    const closeButton = toastElement.querySelector('.toast-close');
    if (closeButton) {
      closeButton.addEventListener('click', () => this.removeToast(toast.id));
    }

    return toastElement;
  }

  private getDefaultTitle(type: ToastType): string {
    switch (type) {
      case 'success':
        return 'Success';
      case 'error':
        return 'Error';
      case 'info':
        return 'Information';
      case 'warning':
        return 'Warning';
      default:
        return 'Notification';
    }
  }

  private updateContainerPosition(position: string): void {
    if (this.container) {
      this.container.className = `toast-container ${position}`;
    }
  }

  private addToastToDOM(toast: Toast): void {
    if (!this.container || typeof document === 'undefined') return;

    const toastElement = this.createToastElement(toast);
    const options = { ...this.defaultOptions, ...toast.options };

    // Update container position if needed
    this.updateContainerPosition(options.position || 'bottom-right');

    // Add to DOM
    this.container.appendChild(toastElement);

    // Auto-close functionality
    if (options.autoClose && options.duration) {
      const progressBar = toastElement.querySelector('.toast-progress-bar') as HTMLElement;
      if (progressBar) {
        progressBar.style.transition = `width ${options.duration}ms linear`;
        setTimeout(() => {
          progressBar.style.width = '0%';
        }, 10);
      }

      setTimeout(() => {
        this.removeToast(toast.id);
      }, options.duration);
    }
  }

  private removeToast(id: string): void {
    const toastIndex = this.toasts.findIndex(t => t.id === id);
    if (toastIndex === -1) return;

    const toastElement = document.querySelector(`[data-toast-id="${id}"]`) as HTMLElement;
    if (toastElement) {
      toastElement.classList.add('removing');
      setTimeout(() => {
        if (toastElement.parentNode) {
          toastElement.parentNode.removeChild(toastElement);
        }
      }, 300);
    }

    this.toasts.splice(toastIndex, 1);
  }

  // Public methods
  public enable(): void {
    this.isEnabled = true;
  }

  public disable(): void {
    this.isEnabled = false;
    this.clear(); // Clear existing toasts when disabled
  }

  public isNotificationsEnabled(): boolean {
    return this.isEnabled;
  }

  public show(
    type: ToastType,
    message: string,
    title?: string,
    options?: ToastOptions
  ): string | null {
    if (!this.isEnabled) return null;
    if (typeof window === 'undefined') return null; // SSR check

    const toast: Toast = {
      id: this.generateId(),
      type,
      message,
      title,
      options: options || {},
      timestamp: Date.now(),
    };

    this.toasts.push(toast);
    this.addToastToDOM(toast);
    return toast.id;
  }

  public success(message: string, title?: string, options?: ToastOptions): string | null {
    return this.show('success', message, title, options);
  }

  public error(message: string, title?: string, options?: ToastOptions): string | null {
    return this.show('error', message, title, options);
  }

  public info(message: string, title?: string, options?: ToastOptions): string | null {
    return this.show('info', message, title, options);
  }

  public warning(message: string, title?: string, options?: ToastOptions): string | null {
    return this.show('warning', message, title, options);
  }

  public remove(id: string): void {
    this.removeToast(id);
  }

  public clear(): void {
    this.toasts.forEach(toast => this.removeToast(toast.id));
  }

  public getToasts(): Toast[] {
    return [...this.toasts];
  }
}

// Create singleton instance
const toastNotification = new ToastNotification();

export default toastNotification;