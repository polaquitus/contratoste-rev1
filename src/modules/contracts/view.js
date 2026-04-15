import { create, clear, setText, $ } from '../../utils/dom.js';

export class ContractsView {
  constructor(container) {
    this.container = container;
  }

  render(contracts) {
    clear(this.container);

    const toolbar = this.renderToolbar(contracts.length);
    const content = this.renderTable(contracts);

    this.container.appendChild(toolbar);
    this.container.appendChild(content);
  }

  renderToolbar(count) {
    const toolbar = create('div', 'tb');
    
    const title = create('h1');
    title.innerHTML = `Contratos <span class="bc">(${count})</span>`;
    
    const actions = create('div', 'tba');
    const newBtn = create('button', 'btn btn-p', '➕ Nuevo contrato');
    newBtn.setAttribute('data-action', 'new');
    
    actions.appendChild(newBtn);
    toolbar.appendChild(title);
    toolbar.appendChild(actions);

    return toolbar;
  }

  renderTable(contracts) {
    const wrapper = create('div', 'ct');

    if (contracts.length === 0) {
      const empty = create('div', 'empty');
      empty.innerHTML = `
        <div class="ei">📄</div>
        <p>No hay contratos registrados</p>
      `;
      wrapper.appendChild(empty);
      return wrapper;
    }

    const card = create('div', 'card');
    const table = create('table');

    const thead = create('thead');
    thead.innerHTML = `
      <tr>
        <th>Número</th>
        <th>Estado</th>
        <th>Área</th>
        <th>Monto</th>
        <th>Fecha inicio</th>
        <th>Acciones</th>
      </tr>
    `;
    table.appendChild(thead);

    const tbody = create('tbody');
    contracts.forEach(contract => {
      const tr = create('tr');
      tr.innerHTML = `
        <td style="font-weight:700">${contract.contrato_numero || '-'}</td>
        <td><span class="bdg act">${contract.estado || '-'}</span></td>
        <td>${contract.area_gestion || '-'}</td>
        <td>${contract.monto_total ? `$${contract.monto_total.toLocaleString()}` : '-'}</td>
        <td>${contract.fecha_inicio ? new Date(contract.fecha_inicio).toLocaleDateString() : '-'}</td>
        <td>
          <div style="display:flex;gap:6px">
            <button class="btn btn-s btn-sm" data-action="edit" data-id="${contract.id}">Editar</button>
            <button class="btn btn-d btn-sm" data-action="delete" data-id="${contract.id}">Eliminar</button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    card.appendChild(table);
    wrapper.appendChild(card);

    return wrapper;
  }

  renderForm(contract = null) {
    return `
      <div class="fg fg2">
        <div class="fgrp">
          <label>Número de contrato <span class="req">*</span></label>
          <input type="text" id="contrato_numero" value="${contract?.contrato_numero || ''}" />
        </div>
        <div class="fgrp">
          <label>Estado</label>
          <select id="estado">
            <option value="VIGENTE" ${contract?.estado === 'VIGENTE' ? 'selected' : ''}>VIGENTE</option>
            <option value="TERMINADO" ${contract?.estado === 'TERMINADO' ? 'selected' : ''}>TERMINADO</option>
            <option value="SUSPENDIDO" ${contract?.estado === 'SUSPENDIDO' ? 'selected' : ''}>SUSPENDIDO</option>
          </select>
        </div>
        <div class="fgrp">
          <label>Área de gestión</label>
          <input type="text" id="area_gestion" value="${contract?.area_gestion || ''}" />
        </div>
        <div class="fgrp">
          <label>Monto total</label>
          <input type="number" id="monto_total" value="${contract?.monto_total || ''}" />
        </div>
        <div class="fgrp">
          <label>Fecha inicio</label>
          <input type="date" id="fecha_inicio" value="${contract?.fecha_inicio || ''}" />
        </div>
        <div class="fgrp">
          <label>Fecha fin</label>
          <input type="date" id="fecha_fin" value="${contract?.fecha_fin || ''}" />
        </div>
      </div>
    `;
  }

  getFormData() {
    return {
      contrato_numero: $('#contrato_numero')?.value.trim() || '',
      estado: $('#estado')?.value || 'VIGENTE',
      area_gestion: $('#area_gestion')?.value.trim() || null,
      monto_total: parseFloat($('#monto_total')?.value) || null,
      fecha_inicio: $('#fecha_inicio')?.value || null,
      fecha_fin: $('#fecha_fin')?.value || null
    };
  }
}
