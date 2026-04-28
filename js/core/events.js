// ════════════════════════════════════════════════════════════════════
// EVENTS.JS - Sistema de Event Delegation
// ════════════════════════════════════════════════════════════════════

APP.events = {
  
  // ─── HANDLERS REGISTRADOS ─────────────────────────────────────────
  _handlers: {
    click: [],
    input: [],
    change: [],
    submit: []
  },
  
  // ─── REGISTRAR HANDLER ────────────────────────────────────────────
  on: function(eventType, selector, handler) {
    if (!this._handlers[eventType]) {
      this._handlers[eventType] = [];
    }
    
    this._handlers[eventType].push({
      selector: selector,
      handler: handler
    });
  },
  
  // ─── DELEGACIÓN CENTRALIZADA ──────────────────────────────────────
  delegate: function(event) {
    const eventType = event.type;
    const handlers = APP.events._handlers[eventType] || [];
    
    for (let handler of handlers) {
      const target = event.target.closest(handler.selector);
      if (target) {
        handler.handler.call(target, event);
      }
    }
  },
  
  // ─── INICIALIZAR ──────────────────────────────────────────────────
  init: function() {
    // Delegación global para todos los eventos
    ['click', 'input', 'change', 'submit'].forEach(eventType => {
      document.addEventListener(eventType, this.delegate, true);
    });
    
    console.log('[Events] Sistema de delegación inicializado');
  }
};

// ─── HANDLERS PREDEFINIDOS ────────────────────────────────────────────

// Navegación
APP.events.on('click', '[data-action="navigate"]', function(e) {
  e.preventDefault();
  const page = this.dataset.page;
  if (page) APP.router.go(page);
});

// Botones de acción
APP.events.on('click', '[data-action="save"]', function(e) {
  e.preventDefault();
  const module = this.dataset.module || 'contracts';
  APP.modules[module]?.save?.();
});

APP.events.on('click', '[data-action="delete"]', function(e) {
  e.preventDefault();
  const id = this.dataset.id;
  const module = this.dataset.module || 'contracts';
  if (confirm('¿Confirmar eliminación?')) {
    APP.modules[module]?.delete?.(id);
  }
});

// Cerrar modales
APP.events.on('click', '[data-action="close-modal"]', function(e) {
  e.preventDefault();
  APP.ui.modal.close();
});

// Logout
APP.events.on('click', '[data-action="logout"]', function(e) {
  e.preventDefault();
  APP.auth.logout();
});
