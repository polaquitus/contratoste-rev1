// ════════════════════════════════════════════════════════════════════
// SUPABASE.JS - Cliente Supabase con Retry y Fallbacks
// ════════════════════════════════════════════════════════════════════

APP.data.supabase = {
  
  // ─── FETCH BASE ───────────────────────────────────────────────────
  fetch: async function(table, method = 'GET', body = null, filter = '') {
    const url = `${CONFIG.SB_URL}/rest/v1/${table}${filter}`;
    const opts = {
      method,
      headers: CONFIG.SB_HDR
    };
    
    if (body) {
      opts.body = JSON.stringify(body);
    }
    
    try {
      const response = await fetch(url, opts);
      
      if (!response.ok) {
        throw new Error(`Supabase ${method} ${table}: ${response.status} ${response.statusText}`);
      }
      
      return method === 'DELETE' ? null : response.json();
      
    } catch (error) {
      APP.errors.handle(error, {
        context: `supabase.fetch.${table}`,
        userMessage: `Error en conexión con servidor (${table})`,
        toast: false, // El caller decide si mostrar toast
        log: true
      });
      throw error;
    }
  },
  
  // ─── LOAD TABLE ───────────────────────────────────────────────────
  loadTable: async function(table, options = {}) {
    const {
      select = 'id,datos',
      order = 'id.asc',
      limit = 2000
    } = options;
    
    const filter = `?select=${select}&order=${order}&limit=${limit}`;
    const rows = await this.fetch(table, 'GET', null, filter);
    
    return rows.map(row => {
      try {
        const obj = JSON.parse(row.datos);
        obj.__sbId = row.id;
        return obj;
      } catch (e) {
        console.warn(`[Supabase] Error parseando row ${row.id}:`, e);
        return null;
      }
    }).filter(Boolean);
  },
  
  // ─── LOAD SINGLE ──────────────────────────────────────────────────
  loadSingle: async function(table) {
    const rows = await this.fetch(table, 'GET', null, '?select=id,datos&limit=1');
    
    if (!rows.length) return null;
    
    try {
      const obj = JSON.parse(rows[0].datos);
      obj.__sbId = rows[0].id;
      return obj;
    } catch (e) {
      console.warn(`[Supabase] Error parseando single:`, e);
      return null;
    }
  },
  
  // ─── UPSERT ITEM ──────────────────────────────────────────────────
  upsertItem: async function(table, item) {
    const payload = { datos: JSON.stringify(item) };
    
    if (item.__sbId) {
      // UPDATE
      const result = await this.fetch(
        table,
        'PATCH',
        payload,
        `?id=eq.${item.__sbId}`
      );
      return result;
    } else {
      // INSERT
      const result = await this.fetch(table, 'POST', payload);
      if (result && result[0]) {
        item.__sbId = result[0].id;
      }
      return result;
    }
  },
  
  // ─── UPSERT SINGLE ────────────────────────────────────────────────
  upsertSingle: async function(table, obj) {
    return this.upsertItem(table, obj);
  },
  
  // ─── DELETE ITEM ──────────────────────────────────────────────────
  deleteItem: async function(table, sbId) {
    if (!sbId) {
      throw new Error('deleteItem requiere sbId');
    }
    
    return this.fetch(table, 'DELETE', null, `?id=eq.${sbId}`);
  },
  
  // ─── REPLACE TABLE ────────────────────────────────────────────────
  replaceTable: async function(table, items) {
    // Eliminar todos los existentes
    const existing = await this.fetch(table, 'GET', null, '?select=id');
    
    for (const row of existing) {
      await this.deleteItem(table, row.id);
    }
    
    // Insertar nuevos
    for (const item of items) {
      await this.fetch(table, 'POST', { datos: JSON.stringify(item) });
    }
  },
  
  // ─── STATUS CHECK ─────────────────────────────────────────────────
  checkStatus: async function() {
    try {
      await this.fetch('contratos', 'GET', null, '?select=id&limit=1');
      STATE.supabaseOK = true;
      return true;
    } catch (e) {
      STATE.supabaseOK = false;
      return false;
    }
  }
};
