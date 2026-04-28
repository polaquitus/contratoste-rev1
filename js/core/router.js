// ════════════════════════════════════════════════════════════════════
// ROUTER.JS - SPA Router
// ════════════════════════════════════════════════════════════════════

APP.router = {
  
  // ─── RUTAS DEFINIDAS ──────────────────────────────────────────────
  routes: {
    'list': {
      title: '📋 Contratos',
      render: () => APP.modules.contracts.renderList(),
      actions: `<button data-action="navigate" data-page="form" class="btn btn-p">➕ Nuevo Contrato</button>`
    },
    'form': {
      title: () => STATE.editId ? '✏️ Editar Contrato' : '➕ Nuevo Contrato',
      render: () => APP.modules.contracts.renderForm(),
      actions: `<button data-action="navigate" data-page="list" class="btn btn-s">← Volver</button>`
    },
    'detail': {
      title: '📄 Detalle',
      render: () => APP.modules.contracts.renderDetail(),
      actions: `<button data-action="navigate" data-page="list" class="btn btn-s">← Lista</button>`
    },
    'me2n': {
      title: '🛒 Purchase Orders (ME2N)',
      render: () => APP.modules.me2n.renderList(),
      actions: ''
    },
    'idx': {
      title: '📊 Master de Índices',
      render: () => APP.modules.indices.renderView(),
      actions: `<button data-action="update-all-indices" class="btn btn-s btn-sm">🔄 Actualizar todos</button>`
    },
    'licit': {
      title: '🏗️ Licitaciones',
      render: () => APP.modules.licitaciones.renderList(),
      actions: `<button data-action="new-licit" class="btn btn-p">➕ Nueva Licitación</button>`
    },
    'prov': {
      title: '👥 Proveedores',
      render: () => APP.modules.proveedores.renderList(),
      actions: `<button data-action="new-prov" class="btn btn-p">➕ Nuevo Proveedor</button>`
    },
    'users': {
      title: '👤 Usuarios',
      render: () => APP.modules.usuarios.renderList(),
      actions: `<button data-action="new-user" class="btn btn-p">➕ Nuevo Usuario</button>`,
      permission: 'owner'
    }
  },
  
  // ─── NAVEGAR ──────────────────────────────────────────────────────
  go: function(page) {
    const route = this.routes[page];
    
    if (!route) {
      console.error('[Router] Ruta no encontrada:', page);
      return;
    }
    
    // Verificar permisos
    if (route.permission && !APP.auth.hasPermission(route.permission)) {
      APP.ui.toast.error('No tenés permisos para acceder a esta sección');
      return;
    }
    
    // Ocultar todas las vistas
    document.querySelectorAll('.vw').forEach(v => v.classList.remove('on'));
    
    // Mostrar vista actual
    const view = document.getElementById('v' + this._capitalize(page));
    if (view) view.classList.add('on');
    
    // Actualizar título y acciones
    const title = typeof route.title === 'function' ? route.title() : route.title;
    document.getElementById('pgT').innerHTML = title;
    document.getElementById('pgA').innerHTML = route.actions;
    
    // Actualizar sidebar
    this._updateSidebar(page);
    
    // Renderizar contenido
    try {
      route.render();
    } catch(e) {
      APP.errors.handle(e, {
        userMessage: 'Error renderizando ' + page,
        context: 'router.go',
        toast: true
      });
    }
    
    // Actualizar estado
    STATE.currentPage = page;
    
    // Scroll to top
    window.scrollTo({top: 0, behavior: 'smooth'});
  },
  
  // ─── ACTUALIZAR SIDEBAR ───────────────────────────────────────────
  _updateSidebar: function(page) {
    document.querySelectorAll('.nv').forEach(n => n.classList.remove('act'));
    const link = document.querySelector(`[data-page="${page}"]`);
    if (link) link.closest('.nv')?.classList.add('act');
  },
  
  // ─── HELPERS ──────────────────────────────────────────────────────
  _capitalize: function(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
};
