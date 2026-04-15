import { create, clear, $ } from '../../utils/dom.js';

export class UsersView {
  constructor(container) {
    this.container = container;
  }

  render(users) {
    clear(this.container);

    const toolbar = this.renderToolbar(users.length);
    const content = this.renderTable(users);

    this.container.appendChild(toolbar);
    this.container.appendChild(content);
  }

  renderToolbar(count) {
    const toolbar = create('div', 'tb');
    
    const title = create('h1');
    title.innerHTML = `Usuarios <span class="bc">(${count})</span>`;
    
    const actions = create('div', 'tba');
    const newBtn = create('button', 'btn btn-p', '➕ Nuevo usuario');
    newBtn.setAttribute('data-action', 'new');
    
    actions.appendChild(newBtn);
    toolbar.appendChild(title);
    toolbar.appendChild(actions);

    return toolbar;
  }

  renderTable(users) {
    const wrapper = create('div', 'ct');

    if (users.length === 0) {
      const empty = create('div', 'empty');
      empty.innerHTML = `
        <div class="ei">👤</div>
        <p>No hay usuarios registrados</p>
      `;
      wrapper.appendChild(empty);
      return wrapper;
    }

    const card = create('div', 'card');
    const table = create('table');

    const thead = create('thead');
    thead.innerHTML = `
      <tr>
        <th>Usuario</th>
        <th>Rol</th>
        <th>Estado</th>
        <th>Acciones</th>
      </tr>
    `;
    table.appendChild(thead);

    const tbody = create('tbody');
    users.forEach(user => {
      const isActive = user.active === true || user.active === 'true';
      const tr = create('tr');
      tr.innerHTML = `
        <td style="font-weight:700">${user.username || '-'}</td>
        <td>${user.role || 'SIN_ROL'}</td>
        <td><span class="bdg ${isActive ? 'act' : 'exp'}">${isActive ? 'ACTIVO' : 'INACTIVO'}</span></td>
        <td>
          <div style="display:flex;gap:6px;flex-wrap:wrap">
            <button class="btn btn-s btn-sm" data-action="edit" data-id="${user.id}">Editar</button>
            <button class="btn btn-s btn-sm" data-action="reset" data-id="${user.id}">Reset pass</button>
            <button class="btn btn-s btn-sm" data-action="toggle" data-id="${user.id}">${isActive ? 'Inactivar' : 'Activar'}</button>
            <button class="btn btn-d btn-sm" data-action="delete" data-id="${user.id}">Eliminar</button>
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

  renderForm(user = null) {
    const isEdit = !!user;
    return `
      <div class="fg fg2">
        <div class="fgrp">
          <label>Usuario <span class="req">*</span></label>
          <input type="text" id="username" value="${user?.username || ''}" ${isEdit ? 'disabled' : ''} />
        </div>
        <div class="fgrp">
          <label>Rol <span class="req">*</span></label>
          <select id="role">
            <option value="SIN_ROL" ${user?.role === 'SIN_ROL' ? 'selected' : ''}>SIN_ROL</option>
            <option value="READER" ${user?.role === 'READER' ? 'selected' : ''}>READER</option>
            <option value="PROVEEDORES" ${user?.role === 'PROVEEDORES' ? 'selected' : ''}>PROVEEDORES</option>
            <option value="LICITACIONES" ${user?.role === 'LICITACIONES' ? 'selected' : ''}>LICITACIONES</option>
            <option value="ADMIN" ${user?.role === 'ADMIN' ? 'selected' : ''}>ADMIN</option>
            <option value="OWNER" ${user?.role === 'OWNER' ? 'selected' : ''}>OWNER</option>
          </select>
        </div>
        <div class="fgrp">
          <label>Estado</label>
          <select id="active">
            <option value="true" ${user?.active !== false ? 'selected' : ''}>ACTIVO</option>
            <option value="false" ${user?.active === false ? 'selected' : ''}>INACTIVO</option>
          </select>
        </div>
        <div class="fgrp">
          <label>Contraseña ${isEdit ? '(dejar vacío para no cambiar)' : '<span class="req">*</span>'}</label>
          <input type="password" id="password" />
        </div>
      </div>
    `;
  }

  getFormData() {
    return {
      username: $('#username')?.value.trim() || '',
      role: $('#role')?.value || 'SIN_ROL',
      active: $('#active')?.value === 'true',
      password: $('#password')?.value.trim() || ''
    };
  }
}
