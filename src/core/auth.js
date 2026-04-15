import { api } from './api.js';
import { hashPassword } from '../utils/crypto.js';

const STORAGE_KEY = 'auth_session';

class AuthManager {
  constructor() {
    this.currentUser = null;
    this.listeners = [];
  }

  async login(username, password) {
    const passwordHash = await hashPassword(password);
    
    const users = await api.get('app_users', `?username=eq.${encodeURIComponent(username)}&active=eq.true&limit=1`);
    
    if (!users || users.length === 0) {
      throw new Error('Usuario no encontrado');
    }

    const user = users[0];
    
    if (user.password_hash !== passwordHash) {
      throw new Error('Contraseña incorrecta');
    }

    const session = {
      id: user.id,
      username: user.username,
      role: user.role || 'SIN_ROL',
      loginTime: Date.now()
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    this.currentUser = session;
    this.notifyListeners();

    return session;
  }

  logout() {
    localStorage.removeItem(STORAGE_KEY);
    this.currentUser = null;
    this.notifyListeners();
  }

  loadSession() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        this.currentUser = JSON.parse(stored);
        this.notifyListeners();
        return this.currentUser;
      } catch (e) {
        console.error('Failed to parse session', e);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    return null;
  }

  getSession() {
    return this.currentUser;
  }

  isAuthenticated() {
    return !!this.currentUser;
  }

  hasRole(role) {
    return this.currentUser?.role === role;
  }

  onAuthChange(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notifyListeners() {
    this.listeners.forEach(cb => cb(this.currentUser));
  }
}

export const auth = new AuthManager();
