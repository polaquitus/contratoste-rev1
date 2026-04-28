// ════════════════════════════════════════════════════════════════════
// CACHE.JS - Sistema de Caché con TTL
// ════════════════════════════════════════════════════════════════════

APP.data.cache = {
  
  // ─── SET CACHE ────────────────────────────────────────────────────
  set: function(key, value, ttl = 300000) { // Default 5min
    APP.cache.computed[key] = {
      value: value,
      expires: Date.now() + ttl
    };
  },
  
  // ─── GET CACHE ────────────────────────────────────────────────────
  get: function(key) {
    const cached = APP.cache.computed[key];
    
    if (!cached) return null;
    
    // Verificar si expiró
    if (Date.now() > cached.expires) {
      delete APP.cache.computed[key];
      return null;
    }
    
    return cached.value;
  },
  
  // ─── INVALIDATE ───────────────────────────────────────────────────
  invalidate: function(pattern) {
    if (!pattern) {
      // Clear all
      APP.cache.computed = {};
      return;
    }
    
    // Clear matching pattern
    const regex = new RegExp(pattern);
    Object.keys(APP.cache.computed).forEach(key => {
      if (regex.test(key)) {
        delete APP.cache.computed[key];
      }
    });
  },
  
  // ─── MEMOIZE ──────────────────────────────────────────────────────
  memoize: function(fn, keyGen, ttl) {
    return function(...args) {
      const key = keyGen ? keyGen(...args) : JSON.stringify(args);
      
      let cached = APP.data.cache.get(key);
      if (cached !== null) {
        return cached;
      }
      
      const result = fn.apply(this, args);
      APP.data.cache.set(key, result, ttl);
      
      return result;
    };
  }
};
