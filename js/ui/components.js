// ════════════════════════════════════════════════════════════════════
// TOAST.JS - Sistema de Notificaciones
// ════════════════════════════════════════════════════════════════════

APP.ui = APP.ui || {};

APP.ui.toast = {
  _queue: [],
  _current: null,
  
  show: function(msg, type = 'info', duration = 3000) {
    this._queue.push({ msg, type, duration });
    if (!this._current) this._showNext();
  },
  
  success: function(msg) { this.show(msg, 'ok', 3000); },
  error: function(msg) { this.show(msg, 'er', 5000); },
  info: function(msg) { this.show(msg, 'info', 3000); },
  warning: function(msg) { this.show(msg, 'warn', 4000); },
  
  _showNext: function() {
    if (this._queue.length === 0) {
      this._current = null;
      return;
    }
    
    const { msg, type, duration } = this._queue.shift();
    this._current = { msg, type };
    
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = msg;
    toast.className = 'toast show ' + type;
    
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => this._showNext(), 300);
    }, duration);
  }
};

APP.ui.loader = {
  show: function(msg = 'Cargando...') {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.querySelector('.loader-msg').textContent = msg;
      loader.style.display = 'flex';
    }
  },
  
  hide: function() {
    const loader = document.getElementById('loader');
    if (loader) loader.style.display = 'none';
  }
};

APP.ui.modal = {
  show: function(content) {
    // TODO: Implementar sistema de modales reutilizable
  },
  
  close: function() {
    // TODO: Cerrar modal actual
  }
};
