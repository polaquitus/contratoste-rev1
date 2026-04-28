// ════════════════════════════════════════════════════════════════════
// STORAGE.JS - Wrapper para LocalStorage con Fallbacks
// ════════════════════════════════════════════════════════════════════

APP.data.storage = {
  
  // ─── SAVE ─────────────────────────────────────────────────────────
  save: async function(key, data) {
    // Intentar Supabase primero
    if (STATE.supabaseOK) {
      try {
        await APP.data.supabase.upsertSingle(key, data);
      } catch (e) {
        console.warn(`[Storage] Supabase save failed for ${key}, using localStorage`);
      }
    }
    
    // Siempre guardar en localStorage como backup
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      APP.errors.handle(e, {
        context: 'storage.save',
        userMessage: 'Error guardando datos localmente',
        toast: true
      });
    }
  },
  
  // ─── LOAD ─────────────────────────────────────────────────────────
  load: async function(key, defaultValue = null) {
    // Intentar Supabase primero
    if (STATE.supabaseOK) {
      try {
        const data = await APP.data.supabase.loadSingle(key);
        if (data) {
          // Actualizar localStorage
          localStorage.setItem(key, JSON.stringify(data));
          return data;
        }
      } catch (e) {
        console.warn(`[Storage] Supabase load failed for ${key}, trying localStorage`);
      }
    }
    
    // Fallback a localStorage
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch (e) {
      console.warn(`[Storage] localStorage parse error for ${key}:`, e);
      return defaultValue;
    }
  },
  
  // ─── SAVE ARRAY ───────────────────────────────────────────────────
  saveArray: async function(table, array) {
    if (STATE.supabaseOK) {
      try {
        // Guardar cada item individual
        for (const item of array) {
          await APP.data.supabase.upsertItem(table, item);
        }
      } catch (e) {
        console.warn(`[Storage] Supabase saveArray failed for ${table}`);
      }
    }
    
    // Backup localStorage
    try {
      localStorage.setItem(table, JSON.stringify(array));
    } catch (e) {
      APP.errors.handle(e, {
        context: 'storage.saveArray',
        userMessage: 'Error guardando lista',
        toast: true
      });
    }
  },
  
  // ─── LOAD ARRAY ───────────────────────────────────────────────────
  loadArray: async function(table, defaultValue = []) {
    if (STATE.supabaseOK) {
      try {
        const data = await APP.data.supabase.loadTable(table);
        if (data && data.length) {
          localStorage.setItem(table, JSON.stringify(data));
          return data;
        }
      } catch (e) {
        console.warn(`[Storage] Supabase loadArray failed for ${table}`);
      }
    }
    
    // Fallback localStorage
    try {
      const stored = localStorage.getItem(table);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch (e) {
      console.warn(`[Storage] localStorage parse error for ${table}:`, e);
      return defaultValue;
    }
  },
  
  // ─── DELETE ───────────────────────────────────────────────────────
  delete: async function(table, item) {
    if (STATE.supabaseOK && item.__sbId) {
      try {
        await APP.data.supabase.deleteItem(table, item.__sbId);
      } catch (e) {
        console.warn(`[Storage] Supabase delete failed for ${table}`);
      }
    }
    
    // También limpiar localStorage
    // (requiere recargar el array sin el item)
  },
  
  // ─── CLEAR ────────────────────────────────────────────────────────
  clear: function(key) {
    localStorage.removeItem(key);
  }
};
