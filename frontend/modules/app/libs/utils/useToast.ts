import { useCallback } from 'react';
import toastNotification, { ToastOptions } from './ToastNotification';

export const useToast = () => {
  const success = useCallback((message: string, title?: string, options?: ToastOptions) => {
    return toastNotification.success(message, title, options);
  }, []);

  const error = useCallback((message: string, title?: string, options?: ToastOptions) => {
    return toastNotification.error(message, title, options);
  }, []);

  const info = useCallback((message: string, title?: string, options?: ToastOptions) => {
    return toastNotification.info(message, title, options);
  }, []);

  const warning = useCallback((message: string, title?: string, options?: ToastOptions) => {
    return toastNotification.warning(message, title, options);
  }, []);

  const show = useCallback((type: 'success' | 'error' | 'info' | 'warning', message: string, title?: string, options?: ToastOptions) => {
    return toastNotification.show(type, message, title, options);
  }, []);

  const remove = useCallback((id: string) => {
    toastNotification.remove(id);
  }, []);

  const clear = useCallback(() => {
    toastNotification.clear();
  }, []);

  const enable = useCallback(() => {
    toastNotification.enable();
  }, []);

  const disable = useCallback(() => {
    toastNotification.disable();
  }, []);

  const isEnabled = useCallback(() => {
    return toastNotification.isNotificationsEnabled();
  }, []);

  const getToasts = useCallback(() => {
    return toastNotification.getToasts();
  }, []);

  return {
    success,
    error,
    info,
    warning,
    show,
    remove,
    clear,
    enable,
    disable,
    isEnabled,
    getToasts,
  };
}; 