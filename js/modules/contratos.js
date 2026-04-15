import { getState } from '../state.js';
import { fD, fN, esc, toast } from '../ui.js';
import { navigateTo } from '../navigation.js';

let editId = null;
export let detId = null;

export function renderContratosList(container, actionsEl) {
  actionsEl.innerHTML = `
    <div style="display:flex;gap:8px">
      <button class="btn btn-s btn-sm" id="importSapBtn">📤 Importar ME3N (SAP)</button>
      <button class="btn btn-p" id="newContractBtn">➕ Nuevo Contrato</button>
    </div>
  `;
  document.getElementById('newContractBtn').addEventListener('click', () => {
    editId = null;
    navigateTo('form');
  });
  const contratos = getState('contratos');
  let html = `<div class="card"><div class="thdr"><h2>Contratos Registrados</h2><span class="tcnt">${contratos.length}</span></div>`;
  if (!contratos.length) {
    html += '<div class="empty">No hay contratos.</div></div>';
  } else {
    html += '<table><thead><tr><th>N° Ctto</th><th>Proveedor</th><th>Monto</th><th>Inicio</th><th>Fin</th></tr></thead><tbody>';
    contratos.forEach(c => {
      html += `<tr style="cursor:pointer" data-id="${c.id}">
        <td>${esc(c.num)}</td><td>${esc(c.cont)}</td><td>${c.mon} ${fN(c.monto)}</td>
        <td>${fD(c.fechaIni)}</td><td>${fD(c.fechaFin)}</td>
      </tr>`;
    });
    html += '</tbody></table></div>';
  }
  container.innerHTML = html;
  container.querySelectorAll('[data-id]').forEach(tr => {
    tr.addEventListener('click', () => {
      detId = tr.dataset.id;
      navigateTo('detail');
    });
  });
}

export function renderContratoForm(container, actionsEl) {
  actionsEl.innerHTML = `<button class="btn btn-s" id="cancelFormBtn">← Volver</button>`;
  document.getElementById('cancelFormBtn').addEventListener('click', () => navigateTo('list'));
  container.innerHTML = '<div class="card"><p>Formulario en construcción</p></div>';
}

export function renderContratoDetail(container, actionsEl) {
  actionsEl.innerHTML = `<button class="btn btn-s" id="backToListBtn">← Lista</button>`;
  document.getElementById('backToListBtn').addEventListener('click', () => navigateTo('list'));
  container.innerHTML = '<div class="card"><p>Detalle en construcción</p></div>';
}