class Store {
  constructor() {
    this.state = {
      permissions: this.loadPermissions()
    };
    this.listeners = new Map();
  }

  loadPermissions() {
    const stored = localStorage.getItem('role_permissions');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse permissions', e);
      }
    }
    return this.getDefaultPermissions();
  }

  getDefaultPermissions() {
    return {
      OWNER: { list: true, form: true, me2n: true, idx: true, licit: true, prov: true, users: true },
      ADMIN: { list: true, form: true, me2n: true, idx: true, licit: true, prov: true, users: true },
      LICITACIONES: { list: true, form: false, me2n: false, idx: false, licit: true, prov: false, users: false },
      PROVEEDORES: { list: true, form: false, me2n: false, idx: false, licit: false, prov: true, users: false },
      READER: { list: true, form: false, me2n: false, idx: false, licit: false, prov: false, users: false },
      SIN_ROL: { list: false, form: false, me2n: false, idx: false, licit: false, prov: false, users: false }
    };
  }

  savePermissions(permissions) {
    this.state.permissions = permissions;
    localStorage.setItem('role_permissions', JSON.stringify(permissions));
    this.notify('permissions');
  }

  getPermissions() {
    return this.state.permissions;
  }

  canAccess(role, module) {
    return this.state.permissions[role]?.[module] || false;
  }

  subscribe(key, callback) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, []);
    }
    this.listeners.get(key).push(callback);

    return () => {
      const callbacks = this.listeners.get(key);
      if (callbacks) {
        this.listeners.set(key, callbacks.filter(cb => cb !== callback));
      }
    };
  }

  notify(key) {
    const callbacks = this.listeners.get(key);
    if (callbacks) {
      callbacks.forEach(cb => cb(this.state[key]));
    }
  }
}

export const store = new Store();
