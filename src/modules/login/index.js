import { auth } from '../../core/auth.js';
import { router } from '../../core/router.js';
import { toast } from '../../components/toast.js';
import { showLoader, hideLoader } from '../../components/loader.js';
import { create, clear, on, $ } from '../../utils/dom.js';

export class LoginController {
  constructor(container) {
    this.container = container;
  }

  render() {
    clear(this.container);

    const wrapper = create('div');
    wrapper.style.cssText = 'min-height:100vh;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,var(--p900),var(--p700))';

    const card = create('div', 'card');
    card.style.cssText = 'width:400px;padding:40px';

    card.innerHTML = `
      <div style="text-align:center;margin-bottom:32px">
        <div style="width:60px;height:60px;margin:0 auto 12px;background:var(--p500);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:800;color:white">CT</div>
        <h2 style="font-size:20px;font-weight:700;color:var(--p900);margin-bottom:4px">Contratos TA</h2>
        <p style="font-size:13px;color:var(--g500)">Sistema de gestión de contratos</p>
      </div>

      <div style="margin-bottom:16px">
        <label style="display:block;font-size:12px;font-weight:600;color:var(--g700);margin-bottom:6px">USUARIO</label>
        <input type="text" id="login-username" placeholder="Ingrese su usuario" autofocus />
      </div>

      <div style="margin-bottom:24px">
        <label style="display:block;font-size:12px;font-weight:600;color:var(--g700);margin-bottom:6px">CONTRASEÑA</label>
        <input type="password" id="login-password" placeholder="Ingrese su contraseña" />
      </div>

      <button class="btn btn-p" id="login-submit" style="width:100%;justify-content:center">
        Iniciar sesión
      </button>
    `;

    wrapper.appendChild(card);
    this.container.appendChild(wrapper);

    this.setupEventListeners();
  }

  setupEventListeners() {
    const submitBtn = $('#login-submit');
    const usernameInput = $('#login-username');
    const passwordInput = $('#login-password');

    on(submitBtn, 'click', () => this.handleLogin());
    
    on(usernameInput, 'keypress', (e) => {
      if (e.key === 'Enter') this.handleLogin();
    });
    
    on(passwordInput, 'keypress', (e) => {
      if (e.key === 'Enter') this.handleLogin();
    });
  }

  async handleLogin() {
    const username = $('#login-username').value.trim();
    const password = $('#login-password').value.trim();

    if (!username || !password) {
      toast('Complete todos los campos', 'er');
      return;
    }

    showLoader('Iniciando sesión...');
    
    try {
      await auth.login(username, password);
      router.navigate('contracts');
    } catch (error) {
      console.error('Login error', error);
      toast(error.message || 'Error al iniciar sesión', 'er');
    } finally {
      hideLoader();
    }
  }
}
