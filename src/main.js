import { auth } from './core/auth.js';
import { router } from './core/router.js';
import { store } from './core/store.js';
import { $ } from './utils/dom.js';
import { Sidebar } from './components/sidebar.js';
import { LoginController } from './modules/login/index.js';
import { ContractsController } from './modules/contracts/index.js';
import { UsersController } from './modules/users/index.js';

class App {
  constructor() {
    this.appContainer = $('#app');
    this.sidebar = null;
    this.mainContent = null;
    this.controllers = {};
  }

  async init() {
    console.log('🚀 Inicializando aplicación...');

    // Load session
    const session = auth.loadSession();

    // Setup routes
    this.setupRoutes();

    // Auth change listener
    auth.onAuthChange((user) => {
      if (user) {
        this.renderApp();
      } else {
        this.renderLogin();
      }
    });

    // Initial render
    if (session) {
      this.renderApp();
      this.navigateToFirstAllowed();
    } else {
      router.navigate('login');
    }
  }

  setupRoutes() {
    router.register('login', () => {
      this.renderLogin();
    });

    router.register('contracts', () => {
      if (!this.checkAuth()) return;
      this.loadModule('contracts', ContractsController);
    });

    router.register('users', () => {
      if (!this.checkAuth()) return;
      this.loadModule('users', UsersController);
    });

    // Placeholder routes
    router.register('form', () => {
      if (!this.checkAuth()) return;
      this.renderPlaceholder('Formulario', '📝');
    });

    router.register('index', () => {
      if (!this.checkAuth()) return;
      this.renderPlaceholder('Índices', '📊');
    });

    router.register('licit', () => {
      if (!this.checkAuth()) return;
      this.renderPlaceholder('Licitaciones', '🏛️');
    });

    router.register('providers', () => {
      if (!this.checkAuth()) return;
      this.renderPlaceholder('Proveedores', '🏢');
    });
  }

  checkAuth() {
    if (!auth.isAuthenticated()) {
      router.navigate('login');
      return false;
    }
    return true;
  }

  renderLogin() {
    this.appContainer.innerHTML = '';
    const loginController = new LoginController(this.appContainer);
    loginController.render();
  }

  renderApp() {
    this.appContainer.innerHTML = '';
    this.appContainer.className = 'app';

    // Sidebar
    this.sidebar = new Sidebar();
    const sidebarElement = this.sidebar.render();

    // Main content area
    const main = document.createElement('div');
    main.className = 'mn';
    main.id = 'main-content';

    this.mainContent = main;

    this.appContainer.appendChild(sidebarElement);
    this.appContainer.appendChild(main);
  }

  loadModule(name, ControllerClass) {
    if (!this.mainContent) return;

    if (!this.controllers[name]) {
      this.controllers[name] = new ControllerClass(this.mainContent);
    }

    this.controllers[name].load();
  }

  renderPlaceholder(title, icon) {
    if (!this.mainContent) return;

    this.mainContent.innerHTML = `
      <div class="tb">
        <h1>${icon} ${title}</h1>
      </div>
      <div class="ct">
        <div class="card">
          <div class="empty">
            <div class="ei">${icon}</div>
            <p>Módulo "${title}" en desarrollo</p>
            <p style="font-size:12px;margin-top:8px;color:var(--g500)">Esta funcionalidad estará disponible próximamente</p>
          </div>
        </div>
      </div>
    `;
  }

  navigateToFirstAllowed() {
    const session = auth.getSession();
    const role = session?.role || 'SIN_ROL';
    const permissions = store.getPermissions();

    const modules = ['list', 'form', 'idx', 'licit', 'prov', 'users'];
    const routes = ['contracts', 'form', 'index', 'licit', 'providers', 'users'];

    for (let i = 0; i < modules.length; i++) {
      if (permissions[role]?.[modules[i]]) {
        router.navigate(routes[i]);
        return;
      }
    }

    // No access to anything
    router.navigate('contracts');
  }
}

// Bootstrap
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});

export default App;
