import { setState, getState } from './state.js';
import { toast } from './ui.js';

const SB_URL = 'https://upxsqroxbvzwudcaklvn.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVweHNxcm94YnZ6d3VkY2FrbHZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2NTg4NjYsImV4cCI6MjA5MTIzNDg2Nn0.EgXWuLg3ip66PnuCvK01XFj3QDMZDu7PDG21BwkzkNo';

let isOnline = false;

export async function initSupabase() {
  try {
    const response = await fetch(`${SB_URL}/rest/v1/`, {
      headers: { 'apikey': SB_KEY, 'Authorization': `Bearer ${SB_KEY}` }
    });
    isOnline = response.ok;
  } catch (e) {
    isOnline = false;
  }
}

export async function sbFetch(table, method = 'GET', body = null, filter = '') {
  const url = `${SB_URL}/rest/v1/${table}${filter}`;
  const opts = {
    method,
    headers: {
      'apikey': SB_KEY,
      'Authorization': `Bearer ${SB_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': method === 'GET' ? undefined : 'return=representation'
    }
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(url, opts);
  if (!res.ok) throw new Error(`${method} ${table} ${res.status}`);
  return method === 'DELETE' ? null : res.json();
}

export async function fetchAllData() {
  if (!isOnline) {
    setState('contratos', JSON.parse(localStorage.getItem('cta_v7') || '[]'));
    setState('me2n', JSON.parse(localStorage.getItem('me2n_v1') || '{}'));
    setState('indices', JSON.parse(localStorage.getItem('idx_v2') || '{}'));
    setState('licitaciones', JSON.parse(localStorage.getItem('licit_v1') || '[]'));
    setState('proveedores', JSON.parse(localStorage.getItem('prov_v1') || '[]'));
    return;
  }
  try {
    const contratosRows = await sbFetch('contratos', 'GET', null, '?select=id,datos&order=id.asc&limit=2000');
    const contratos = contratosRows.map(r => {
      try { const obj = JSON.parse(r.datos); obj.__sbId = r.id; return obj; } catch { return null; }
    }).filter(Boolean);
    setState('contratos', contratos);

    const me2nRows = await sbFetch('me2n', 'GET', null, '?select=id,datos&limit=1');
    if (me2nRows.length) {
      try { setState('me2n', JSON.parse(me2nRows[0].datos)); } catch { setState('me2n', {}); }
    }

    const idxRows = await sbFetch('indices', 'GET', null, '?select=id,datos&limit=1');
    if (idxRows.length) {
      try { setState('indices', JSON.parse(idxRows[0].datos)); } catch { setState('indices', {}); }
    }

    const licitRows = await sbFetch('licitaciones', 'GET', null, '?select=id,datos&order=id.asc&limit=1000');
    const licitaciones = licitRows.map(r => {
      try { const obj = JSON.parse(r.datos); obj.__sbId = r.id; return obj; } catch { return null; }
    }).filter(Boolean);
    setState('licitaciones', licitaciones);

    const provRows = await sbFetch('contratistas', 'GET', null, '?select=id,vendor_num,nombre,email,telefono,rubro,payload,active&active=eq.true&limit=5000');
    const proveedores = provRows.map(r => ({
      id: r.id,
      name: r.nombre,
      vendorNum: r.vendor_num,
      email: r.email,
      telefono: r.telefono,
      rubro: r.rubro,
      ...JSON.parse(r.payload || '{}')
    }));
    setState('proveedores', proveedores);

    localStorage.setItem('cta_v7', JSON.stringify(contratos));
    localStorage.setItem('me2n_v1', JSON.stringify(getState('me2n')));
    localStorage.setItem('idx_v2', JSON.stringify(getState('indices')));
    localStorage.setItem('licit_v1', JSON.stringify(licitaciones));
    localStorage.setItem('prov_v1', JSON.stringify(proveedores));
  } catch (e) {
    console.error('Error cargando datos:', e);
    toast('Error al cargar datos desde Supabase', 'er');
  }
}

export async function saveContrato(contrato) {
  const payload = { datos: JSON.stringify(contrato) };
  if (isOnline) {
    if (contrato.__sbId) {
      await sbFetch('contratos', 'PATCH', payload, `?id=eq.${contrato.__sbId}`);
    } else {
      const res = await sbFetch('contratos', 'POST', payload);
      if (res && res[0]) contrato.__sbId = res[0].id;
    }
  }
  localStorage.setItem('cta_v7', JSON.stringify(getState('contratos')));
}

export async function saveMe2n() {
  const me2n = getState('me2n');
  localStorage.setItem('me2n_v1', JSON.stringify(me2n));
  if (!isOnline) return;
  const rows = await sbFetch('me2n', 'GET', null, '?select=id&limit=1');
  const payload = { datos: JSON.stringify(me2n) };
  if (rows.length) {
    await sbFetch('me2n', 'PATCH', payload, `?id=eq.${rows[0].id}`);
  } else {
    await sbFetch('me2n', 'POST', payload);
  }
}

export async function saveIndices() {
  const indices = getState('indices');
  localStorage.setItem('idx_v2', JSON.stringify(indices));
  if (!isOnline) return;
  const rows = await sbFetch('indices', 'GET', null, '?select=id&limit=1');
  const payload = { datos: JSON.stringify(indices) };
  if (rows.length) {
    await sbFetch('indices', 'PATCH', payload, `?id=eq.${rows[0].id}`);
  } else {
    await sbFetch('indices', 'POST', payload);
  }
}

export async function saveLicitaciones() {
  const licitaciones = getState('licitaciones');
  localStorage.setItem('licit_v1', JSON.stringify(licitaciones));
  if (!isOnline) return;
  // Simplificado: en una versión completa deberías iterar, pero para el arranque basta.
}

export async function saveProveedores() {
  const proveedores = getState('proveedores');
  localStorage.setItem('prov_v1', JSON.stringify(proveedores));
  if (!isOnline) return;
}