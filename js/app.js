// ════════════════════════════════════════════════════════════════════
// APP.JS - Orquestador Principal (Híbrido)
// ════════════════════════════════════════════════════════════════════

APP.init = async function(fromLogin = false) {
  
  showLoader('Conectando con Supabase...');
  
  // Require login
  if (!fromLogin) {
    const logged = await APP.auth.requireLogin();
    if (!logged) {
      hideLoader();
      return;
    }
  }
  
  // Load data
  try {
    showLoader('Cargando contratos...');
    DB = await APP.data.supabase.loadTable('contratos');
    
    showLoader('Cargando ME2N...');
    const me2nObj = await APP.data.supabase.loadSingle('me2n');
    if (me2nObj) ME2N = me2nObj;
    
    showLoader('Cargando índices...');
    const idxObj = await APP.data.supabase.loadSingle('indices');
    if (idxObj) {
      delete idxObj.__sbId;
      IDX_STORE = idxObj;
    }
    if (typeof idxMergeOfficialSeeds === 'function') idxMergeOfficialSeeds();
    localStorage.setItem('idx_v2', JSON.stringify(IDX_STORE));
    
    showLoader('Cargando licitaciones...');
    LICIT_DB = await APP.data.supabase.loadTable('licitaciones');
    
    SB_OK = true;
    setSBStatus(true);
    STATE.supabaseOK = true;
    
  } catch (e) {
    console.warn('Supabase error:', e);
    
    // Fallback localStorage
    try { DB = JSON.parse(localStorage.getItem('cta_v7')) || []; } catch(ex) { DB = []; }
    try { ME2N = JSON.parse(localStorage.getItem('me2n_v1')) || {}; } catch(ex) { ME2N = {}; }
    try { IDX_STORE = JSON.parse(localStorage.getItem('idx_v2')) || {}; } catch(ex) { IDX_STORE = {}; }
    if (typeof idxMergeOfficialSeeds === 'function') idxMergeOfficialSeeds();
    try { LICIT_DB = JSON.parse(localStorage.getItem('licit_v1')) || []; } catch(ex) { LICIT_DB = []; }
    
    SB_OK = false;
    setSBStatus(false);
    STATE.supabaseOK = false;
    APP.ui.toast.error('Sin conexión - modo local activo');
  }
  
  // Load proveedores
  try {
    showLoader('Cargando contratistas...');
    await loadProv();
  } catch (ex) {
    console.warn('loadProv error:', ex);
    try {
      PROV_DB = JSON.parse(localStorage.getItem('contr_v1')) ||
        JSON.parse(localStorage.getItem('prov_v1')) || [];
    } catch (e3) {
      PROV_DB = [];
    }
  }
  
  hideLoader();
  
  // Event listeners para formulario
  ['f_ini', 'f_fin'].forEach(id => {
    const el = document.getElementById(id);
    if (el && typeof calcPlazo === 'function') {
      el.onchange = calcPlazo;
    }
  });
  
  // Render inicial
  if (typeof buildPoly === 'function') buildPoly();
  if (typeof renderList === 'function') renderList();
  if (typeof updNav === 'function') updNav();
};

// Init cuando DOM ready
window.addEventListener('DOMContentLoaded', function() {
  // Inicializar event delegation
  APP.events.init();
  
  // Lock auth hasta login
  document.body.classList.add('auth-locked');
});

// Init cuando todo carga
window.addEventListener('load', async function() {
  await APP.init(false);
});
