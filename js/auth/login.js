// ════════════════════════════════════════════════════════════════════
// LOGIN.JS - Sistema de Autenticación
// ════════════════════════════════════════════════════════════════════

APP.auth = {
  
  // ─── SHA256 ───────────────────────────────────────────────────────
  sha256: async function(str) {
    const buffer = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(str)
    );
    return Array.from(new Uint8Array(buffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  },
  
  // ─── LOGIN ────────────────────────────────────────────────────────
  login: async function(username, password) {
    try {
      // Buscar usuario en Supabase
      const filter = `?select=id,username,password_hash,role,active&username=eq.${encodeURIComponent(username)}&limit=1`;
      const rows = await APP.data.supabase.fetch('app_users', 'GET', null, filter);
      
      if (!rows || !rows.length) {
        throw new Error('Usuario no encontrado');
      }
      
      const user = rows[0];
      
      // Verificar activo
      if (user.active === false || String(user.active) === 'false') {
        throw new Error('Usuario inactivo');
      }
      
      // Verificar password
      const hash = await this.sha256(password);
      if (String(hash).toLowerCase() !== String(user.password_hash || '').toLowerCase()) {
        throw new Error('Contraseña incorrecta');
      }
      
      // Guardar sesión
      STATE.user = {
        id: user.id || user.username,
        username: user.username
      };
      STATE.role = (user.role || 'SIN_ROL').trim().toUpperCase();
      
      // Actualizar UI
      this.updateUI();
      
      // Log success
      console.log('[Auth] Login exitoso:', user.username, '→', STATE.role);
      
      return true;
      
    } catch (error) {
      APP.errors.handle(error, {
        context: 'auth.login',
        userMessage: error.message,
        toast: false, // El modal muestra el error
        log: true
      });
      throw error;
    }
  },
  
  // ─── LOGOUT ───────────────────────────────────────────────────────
  logout: function() {
    STATE.user = null;
    STATE.role = null;
    
    this.updateUI();
    this.showLoginModal();
    
    APP.ui.toast.info('Sesión cerrada');
  },
  
  // ─── REQUIRE LOGIN ────────────────────────────────────────────────
  requireLogin: async function() {
    if (STATE.user && STATE.role) {
      this.updateUI();
      this.hideLoginModal();
      return true;
    }
    
    this.showLoginModal();
    return false;
  },
  
  // ─── CHECK PERMISSION ─────────────────────────────────────────────
  hasPermission: function(module) {
    const role = String(STATE.role || '').toLowerCase();
    const allowed = APP.permissions[role] || [];
    return allowed.includes(module);
  },
  
  // ─── UPDATE UI ────────────────────────────────────────────────────
  updateUI: function() {
    // Actualizar badge de rol
    this.updateRoleBadge();
    
    // Mostrar/ocultar elementos según permisos
    this.applyPermissions();
    
    // Mostrar/ocultar botón logout
    const logoutBtn = document.getElementById('sbLogoutBtn');
    if (logoutBtn) {
      logoutBtn.style.display = STATE.user ? 'inline-flex' : 'none';
    }
  },
  
  // ─── UPDATE ROLE BADGE ────────────────────────────────────────────
  updateRoleBadge: function() {
    let badge = document.getElementById('role-badge');
    
    if (!badge) {
      badge = document.createElement('span');
      badge.id = 'role-badge';
      badge.style.cssText = 'font-size:11px;font-weight:700;padding:4px 11px;border-radius:99px;display:inline-flex;align-items:center;gap:5px;cursor:default;margin-right:6px;background:#e0f2fe;color:#075985';
      
      const tba = document.querySelector('.tba');
      if (tba) tba.insertBefore(badge, tba.firstChild);
    }
    
    const role = (STATE.role || 'SIN ROL').toString().toUpperCase();
    badge.className = 'auth-badge ' + role.toLowerCase().replace(/\s+/g, '_');
    badge.textContent = '👤 ' + role.replaceAll('_', ' ');
  },
  
  // ─── APPLY PERMISSIONS ────────────────────────────────────────────
  applyPermissions: function() {
    const role = String(STATE.role || '').toUpperCase();
    
    // Ocultar módulos owner-only si no es owner
    if (role && role !== 'OWNER') {
      document.querySelectorAll('[data-owner-only="1"]').forEach(el => {
        el.style.display = 'none';
      });
    }
  },
  
  // ─── SHOW LOGIN MODAL ─────────────────────────────────────────────
  showLoginModal: function() {
    document.body.classList.add('auth-locked');
    
    if (document.getElementById('loginOverlay')) return;
    
    const html = `
      <div id="loginOverlay" style="position:fixed;inset:0;background:linear-gradient(135deg,rgba(20,48,58,.97),rgba(36,86,108,.94));z-index:10050;display:flex;align-items:center;justify-content:center;padding:20px">
        <div style="background:#fff;border-radius:18px;box-shadow:0 25px 70px rgba(0,0,0,.35);width:430px;max-width:96vw;padding:24px 24px 18px;border:1px solid #dbe5ea">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">
            <div style="font-size:26px">🔐</div>
            <div>
              <div style="font-size:21px;font-weight:800;color:#14303a">Ingreso al sistema</div>
              <div style="font-size:12px;color:#64748b">Perfiles: OWNER / ING_CONTRATOS / RESP_TECNICO</div>
            </div>
          </div>
          <div style="display:grid;gap:12px">
            <div>
              <label style="display:block;font-size:11px;font-weight:700;text-transform:uppercase;color:#475569;margin-bottom:4px">Usuario</label>
              <input id="lgUser" type="text" placeholder="usuario" style="width:100%;padding:10px 12px;border:1px solid #cbd5e1;border-radius:8px">
            </div>
            <div>
              <label style="display:block;font-size:11px;font-weight:700;text-transform:uppercase;color:#475569;margin-bottom:4px">Contraseña</label>
              <input id="lgPass" type="password" placeholder="••••••••" style="width:100%;padding:10px 12px;border:1px solid #cbd5e1;border-radius:8px">
            </div>
            <div id="lgMsg" style="font-size:12px;color:#64748b;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:10px 12px">
              Ingresá con tu usuario y contraseña.
            </div>
            <button id="lgBtn" class="btn btn-p" style="width:100%;justify-content:center">Ingresar</button>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', html);
    
    // Event listeners
    document.getElementById('lgBtn').addEventListener('click', () => this.handleLogin());
    document.getElementById('lgUser').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.handleLogin();
    });
    document.getElementById('lgPass').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.handleLogin();
    });
  },
  
  // ─── HIDE LOGIN MODAL ─────────────────────────────────────────────
  hideLoginModal: function() {
    document.body.classList.remove('auth-locked');
    const overlay = document.getElementById('loginOverlay');
    if (overlay) overlay.remove();
  },
  
  // ─── HANDLE LOGIN ─────────────────────────────────────────────────
  handleLogin: async function() {
    const username = (document.getElementById('lgUser')?.value || '').trim();
    const password = (document.getElementById('lgPass')?.value || '').trim();
    const msg = document.getElementById('lgMsg');
    
    if (!username || !password) {
      if (msg) {
        msg.textContent = 'Ingresá usuario y contraseña';
        msg.style.color = '#dc2626';
      }
      return;
    }
    
    try {
      await this.login(username, password);
      
      // Login exitoso
      this.hideLoginModal();
      APP.ui.toast.success('Sesión iniciada: ' + username);
      
      // Reiniciar app con usuario logueado
      if (typeof APP.init === 'function') {
        await APP.init(true);
      }
      
    } catch (error) {
      if (msg) {
        msg.textContent = error.message || 'Error al iniciar sesión';
        msg.style.color = '#dc2626';
      }
    }
  }
};
