import { create, $ } from '../utils/dom.js';

export function showToast(message, type = 'info') {
  const toast = create('div', `toast ${type}`);
  toast.textContent = message;

  const root = $('#toast-root') || document.body;
  root.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

export function toast(message, type = 'info') {
  const typeMap = {
    ok: 'ok',
    er: 'er',
    error: 'er',
    success: 'ok'
  };

  showToast(message, typeMap[type] || 'info');
}
