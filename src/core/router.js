class Router {
  constructor() {
    this.routes = new Map();
    this.currentRoute = null;
    this.listeners = [];
  }

  register(name, handler) {
    this.routes.set(name, handler);
  }

  async navigate(name, params = {}) {
    const handler = this.routes.get(name);
    
    if (!handler) {
      console.error(`Route not found: ${name}`);
      return;
    }

    this.currentRoute = { name, params };
    this.notifyListeners();

    try {
      await handler(params);
    } catch (error) {
      console.error(`Route error: ${name}`, error);
    }
  }

  getCurrent() {
    return this.currentRoute;
  }

  onChange(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notifyListeners() {
    this.listeners.forEach(cb => cb(this.currentRoute));
  }
}

export const router = new Router();
