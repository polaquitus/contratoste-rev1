// ════════════════════════════════════════════════════════════════════
// ERRORS.JS - Manejo Centralizado de Errores
// ════════════════════════════════════════════════════════════════════

APP.errors = {
  
  // ─── LOG DE ERRORES ───────────────────────────────────────────────
  _log: [],
  
  // ─── HANDLE ERROR ─────────────────────────────────────────────────
  handle: function(error, options = {}) {
    const {
      userMessage = 'Ocurrió un error',
      context = 'unknown',
      toast = true,
      log = true,
      rethrow = false
    } = options;
    
    // Construir entry de log
    const entry = {
      timestamp: new Date().toISOString(),
      context: context,
      message: error.message || String(error),
      stack: error.stack || null,
      userMessage: userMessage
    };
    
    // Log en consola
    if (log) {
      console.error(`[Error:${context}]`, error);
      this._log.push(entry);
      
      // Limitar log a últimos 100
      if (this._log.length > 100) {
        this._log.shift();
      }
    }
    
    // Mostrar al usuario
    if (toast) {
      APP.ui.toast.error(userMessage);
    }
    
    // Re-throw si es necesario
    if (rethrow) {
      throw error;
    }
  },
  
  // ─── GET LOG ──────────────────────────────────────────────────────
  getLog: function() {
    return this._log;
  },
  
  // ─── CLEAR LOG ────────────────────────────────────────────────────
  clearLog: function() {
    this._log = [];
  },
  
  // ─── EXPORT LOG ───────────────────────────────────────────────────
  exportLog: function() {
    const blob = new Blob([JSON.stringify(this._log, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `error-log-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
};

// ─── GLOBAL ERROR HANDLERS ────────────────────────────────────────────

window.addEventListener('error', function(e) {
  APP.errors.handle(e.error || e, {
    context: 'window.error',
    userMessage: 'Error inesperado en la aplicación',
    toast: true,
    log: true
  });
});

window.addEventListener('unhandledrejection', function(e) {
  APP.errors.handle(e.reason, {
    context: 'unhandledrejection',
    userMessage: 'Error en operación asíncrona',
    toast: true,
    log: true
  });
});
