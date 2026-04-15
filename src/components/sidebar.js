import { create, on } from '../utils/dom.js';
import { auth } from '../core/auth.js';
import { router } from '../core/router.js';
import { store } from '../core/store.js';

export class Sidebar {
  constructor() {
    this.element = null;
  }

  render() {
    const sidebar = create('div', 'sb');

    // Logo
    const logo = create('div', 'sb-logo');
    logo.innerHTML = `
      <div class="ico">CT</div>
      <div class="txt">
        Contratos TA
        <span>v2.0</span>
      </div>
    `;

    // Navigation
    const nav = create('nav', 'sb-nav');
    
    const modules = this.getAvailableModules();
    
    nav.appendChild(this.renderSection('Principal', modules.main));
    if (modules.admin.length > 0) {
      nav.appendChild(this.renderSection('Administración', modules.admin));
    }

    sidebar.appendChild(logo);
    sidebar.appendChild(nav);
    sidebar.appendChild(this.renderFooter());

    this.element = sidebar;
    this.setupEventListeners();

    return sidebar;
  }

  renderSection(title, items) {
    const section = create('div');
    const sectionTitle = create('div', 'sb-sec', title);
    section.appendChild(sectionTitle);

    items.forEach(item => {
      const link = create('a', `nv ${item.disabled ? 'dis' : ''}`);
      link.setAttribute('href', '#');
      link.setAttribute('data-route', item.route);
      
      link.innerHTML = `
        <span class="ni">${item.icon}</span>
        <span>${item.label}</span>
        ${item.badge ? `<span class="badge">${item.badge}</span>` : ''}
      `;

      section.appendChild(link);
    });

    return section;
  }

  renderFooter() {
    const session = auth.getSession();
    const footer = create('div', 'sb-nav');
    footer.style.marginTop = 'auto';
    footer.style.borderTop = '1px solid rgba(255,255,255,0.08)';
    footer.style.padding = '14px';

    footer.innerHTML = `
      <div style="font-size:11px;opacity:0.5;margin-bottom:8px">
        ${session?.username || 'Usuario'} (${session?.role || 'Sin rol'})
      </div>
      <button class="btn btn-s btn-sm" style="width:100%" data-action="logout">Cerrar sesión</button>
    `;

    return footer;
  }

  getAvailableModules() {
    const session = auth.getSession();
    const role = session?.role || 'SIN_ROL';
    const permissions = store.getPermissions();

    const canAccess = (module) => permissions[role]?.[module] || false;

    const main = [
      { route: 'contracts', icon: '📄', label: 'Contratos', disabled: !canAccess('list') },
      { route: 'form', icon: '📝', label: 'Formulario', disabled: !canAccess('form') },
      { route: 'index', icon: '📊', label: 'Índices', disabled: !canAccess('idx') },
      { route: 'licit', icon: '🏛️', label: 'Licitaciones', disabled: !canAccess('licit') },
      { route: 'providers', icon: '🏢', label: 'Proveedores', disabled: !canAccess('prov') }
    ].filter(item => !item.disabled);

    const admin = [];
    if (canAccess('users')) {
      admin.push({ route: 'users', icon: '👥', label: 'Usuarios' });
    }

    return { main, admin };
  }

  setupEventListeners() {
    if (!this.element) return;

    on(this.element, 'click', (e) => {
      const link = e.target.closest('[data-route]');
      if (link) {
        e.preventDefault();
        const route = link.getAttribute('data-route');
        router.navigate(route);
        this.updateActive(route);
      }

      const logoutBtn = e.target.closest('[data-action="logout"]');
      if (logoutBtn) {
        auth.logout();
        router.navigate('login');
      }
    });

    router.onChange((currentRoute) => {
      if (currentRoute) {
        this.updateActive(currentRoute.name);
      }
    });
  }

  updateActive(routeName) {
    if (!this.element) return;

    const links = this.element.querySelectorAll('[data-route]');
    links.forEach(link => {
      const route = link.getAttribute('data-route');
      if (route === routeName) {
        link.classList.add('act');
      } else {
        link.classList.remove('act');
      }
    });
  }
}
