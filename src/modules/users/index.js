import { usersService } from './service.js';
import { UsersView } from './view.js';
import { Modal } from '../../components/modal.js';
import { toast } from '../../components/toast.js';
import { showLoader, hideLoader } from '../../components/loader.js';
import { delegate } from '../../utils/dom.js';
import { validateUser } from '../../utils/validators.js';
import { hashPassword } from '../../utils/crypto.js';

export class UsersController {
  constructor(container) {
    this.container = container;
    this.view = new UsersView(container);
    this.modal = new Modal();
    this.users = [];
    this.currentId = null;

    this.setupEventListeners();
  }

  setupEventListeners() {
    delegate(this.container, '[data-action="new"]', 'click', () => this.openModal());
    delegate(this.container, '[data-action="edit"]', 'click', (e) => {
      const id = e.target.getAttribute('data-id');
      this.openModal(id);
    });
    delegate(this.container, '[data-action="delete"]', 'click', (e) => {
      const id = e.target.getAttribute('data-id');
      this.deleteUser(id);
    });
    delegate(this.container, '[data-action="toggle"]', 'click', (e) => {
      const id = e.target.getAttribute('data-id');
      this.toggleActive(id);
    });
    delegate(this.container, '[data-action="reset"]', 'click', (e) => {
      const id = e.target.getAttribute('data-id');
      this.resetPassword(id);
    });
  }

  async load() {
    showLoader('Cargando usuarios...');
    try {
      this.users = await usersService.getAll();
      this.view.render(this.users);
    } catch (error) {
      console.error('Error loading users', error);
      toast('Error al cargar usuarios', 'er');
    } finally {
      hideLoader();
    }
  }

  async openModal(id = null) {
    this.currentId = id;
    
    let user = null;
    if (id) {
      user = this.users.find(u => String(u.id) === String(id));
    }

    const title = user ? 'Editar usuario' : 'Nuevo usuario';
    const formHTML = this.view.renderForm(user);
    
    const footer = `
      <button class="btn btn-s" data-modal-action="cancel">Cancelar</button>
      <button class="btn btn-p" data-modal-action="save">Guardar</button>
    `;

    const body = this.modal.open(title, formHTML, { footer });

    delegate(body.parentElement, '[data-modal-action="cancel"]', 'click', () => this.modal.close());
    delegate(body.parentElement, '[data-modal-action="save"]', 'click', () => this.saveUser());
  }

  async saveUser() {
    const data = this.view.getFormData();

    try {
      if (!this.currentId && !data.password) {
        throw new Error('Contraseña es obligatoria para nuevos usuarios');
      }

      validateUser(data);

      showLoader(this.currentId ? 'Actualizando...' : 'Creando...');

      const payload = {
        role: data.role,
        active: data.active
      };

      if (data.password) {
        payload.password_hash = await hashPassword(data.password);
      }

      if (this.currentId) {
        await usersService.update(this.currentId, payload);
      } else {
        const exists = this.users.some(u => u.username.toLowerCase() === data.username.toLowerCase());
        if (exists) {
          throw new Error('Ese usuario ya existe');
        }
        payload.username = data.username;
        await usersService.create(payload);
      }

      this.modal.close();
      await this.load();
      toast(this.currentId ? 'Usuario actualizado' : 'Usuario creado', 'ok');
    } catch (error) {
      console.error('Error saving user', error);
      toast(error.message || 'Error al guardar', 'er');
    } finally {
      hideLoader();
    }
  }

  async deleteUser(id) {
    const user = this.users.find(u => String(u.id) === String(id));
    const name = user?.username || id;

    if (!confirm(`¿Eliminar el usuario ${name}?`)) {
      return;
    }

    showLoader('Eliminando...');
    try {
      await usersService.delete(id);
      await this.load();
      toast('Usuario eliminado', 'ok');
    } catch (error) {
      console.error('Error deleting user', error);
      toast('Error al eliminar', 'er');
    } finally {
      hideLoader();
    }
  }

  async toggleActive(id) {
    const user = this.users.find(u => String(u.id) === String(id));
    if (!user) return;

    const isActive = user.active === true || user.active === 'true';

    showLoader('Actualizando estado...');
    try {
      await usersService.toggleActive(id, !isActive);
      await this.load();
      toast('Estado actualizado', 'ok');
    } catch (error) {
      console.error('Error toggling active', error);
      toast('Error al actualizar', 'er');
    } finally {
      hideLoader();
    }
  }

  async resetPassword(id) {
    const user = this.users.find(u => String(u.id) === String(id));
    if (!user) return;

    const pwd = prompt(`Nueva contraseña temporal para ${user.username}:`);
    if (!pwd) return;

    showLoader('Reseteando contraseña...');
    try {
      const passwordHash = await hashPassword(pwd);
      await usersService.resetPassword(id, passwordHash);
      toast('Contraseña reseteada', 'ok');
    } catch (error) {
      console.error('Error resetting password', error);
      toast('Error al resetear contraseña', 'er');
    } finally {
      hideLoader();
    }
  }
}
