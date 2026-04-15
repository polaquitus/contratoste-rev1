import { getState } from './state.js';
import { toast } from './ui.js';
import { renderContratosList, renderContratoForm, renderContratoDetail } from './modules/contratos.js';
import { renderMe2nList, renderMe2nDetail } from './modules/me2n.js';
import { renderIndicesView } from './modules/indices.js';
import { renderLicitacionesView } from './modules/licitaciones.js';
import { renderProveedoresView } from './modules/proveedores.js';
import { renderUsuariosView } from './modules/usuarios.js';

const views = {
  list: { render: renderContratosList, title: '📋 Contratos' },
  form: { render: renderContratoForm, title: '➕ Nuevo Contrato' },
  detail: { render: renderContratoDetail, title: '📄 Detalle' },
  me2n: { render: renderMe2nList, title: '🛒 Purchase Orders' },
  me2ndet: { render: renderMe2nDetail, title: '🛒 Detalle PO' },
  idx: { render: renderIndicesView, title: '📊 Índices' },
  licit: { render: renderLicitacionesView, title: '📋 Licitaciones' },
  prov: { render: renderProveedoresView, title: '🏢 Proveedores' },
  users: { render: renderUsuariosView, title: '👥 Usuarios' }
};

export function setupNavigation() {
  const nav = document.getElementById('mainNav');
  const role = getState('rol') || 'SIN_ROL';
  const perms = JSON.parse(localStorage.getItem('role_permissions_v19'))?.[role] || {};
  const modules = [
    { id: 'list', label: 'Contratos', icon: '📋' },
    { id: 'form', label: 'Nuevo Contrato', icon: '➕' },
    { id: 'me2n', label: 'Purchase Orders', icon: '🛒' },
    { id: 'idx', label: 'Índices', icon: '📊' },
    { id: 'licit', label: 'Licitaciones', icon: '📋' },
    { id: 'prov', label: 'Proveedores', icon: '🏢' },
    { id: 'users', label: 'Usuarios', icon: '👥' }
  ];
  let html = '<div class="sb-sec">Módulos</div>';
  modules.forEach(m => {
    if (perms[m.id] !== false) {
      html += `<a class="nv" data-mod="${m.id}" href="#"><span class="ni">${m.icon}</span><span>${m.label}</span></a>`;
    }
  });
  nav.innerHTML = html;
  nav.querySelectorAll('[data-mod]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo(link.dataset.mod);
    });
  });
}

export function navigateTo(viewName) {
  if (!views[viewName]) {
    toast(`Vista "${viewName}" no encontrada`, 'er');
    return;
  }
  const container = document.getElementById('appContainer');
  const titleEl = document.getElementById('pgT');
  const actionsEl = document.getElementById('pgA');
  titleEl.innerHTML = views[viewName].title;
  actionsEl.innerHTML = '';
  views[viewName].render(container, actionsEl);
  document.querySelectorAll('.sb-nav .nv').forEach(el => el.classList.remove('act'));
  document.querySelector(`.sb-nav .nv[data-mod="${viewName}"]`)?.classList.add('act');
}