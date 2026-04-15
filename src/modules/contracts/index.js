import { contractsService } from './service.js';
import { ContractsView } from './view.js';
import { Modal } from '../../components/modal.js';
import { toast } from '../../components/toast.js';
import { showLoader, hideLoader } from '../../components/loader.js';
import { delegate } from '../../utils/dom.js';
import { validateContract } from '../../utils/validators.js';

export class ContractsController {
  constructor(container) {
    this.container = container;
    this.view = new ContractsView(container);
    this.modal = new Modal();
    this.contracts = [];
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
      this.deleteContract(id);
    });
  }

  async load() {
    showLoader('Cargando contratos...');
    try {
      this.contracts = await contractsService.getAll();
      this.view.render(this.contracts);
    } catch (error) {
      console.error('Error loading contracts', error);
      toast('Error al cargar contratos', 'er');
    } finally {
      hideLoader();
    }
  }

  async openModal(id = null) {
    this.currentId = id;
    
    let contract = null;
    if (id) {
      contract = this.contracts.find(c => String(c.id) === String(id));
    }

    const title = contract ? 'Editar contrato' : 'Nuevo contrato';
    const formHTML = this.view.renderForm(contract);
    
    const footer = `
      <button class="btn btn-s" data-modal-action="cancel">Cancelar</button>
      <button class="btn btn-p" data-modal-action="save">Guardar</button>
    `;

    const body = this.modal.open(title, formHTML, { footer });

    delegate(body.parentElement, '[data-modal-action="cancel"]', 'click', () => this.modal.close());
    delegate(body.parentElement, '[data-modal-action="save"]', 'click', () => this.saveContract());
  }

  async saveContract() {
    const data = this.view.getFormData();

    try {
      validateContract(data);
      
      showLoader(this.currentId ? 'Actualizando...' : 'Creando...');

      if (this.currentId) {
        await contractsService.update(this.currentId, data);
      } else {
        await contractsService.create(data);
      }

      this.modal.close();
      await this.load();
      toast(this.currentId ? 'Contrato actualizado' : 'Contrato creado', 'ok');
    } catch (error) {
      console.error('Error saving contract', error);
      toast(error.message || 'Error al guardar', 'er');
    } finally {
      hideLoader();
    }
  }

  async deleteContract(id) {
    const contract = this.contracts.find(c => String(c.id) === String(id));
    const name = contract?.contrato_numero || id;

    if (!confirm(`¿Eliminar el contrato ${name}?`)) {
      return;
    }

    showLoader('Eliminando...');
    try {
      await contractsService.delete(id);
      await this.load();
      toast('Contrato eliminado', 'ok');
    } catch (error) {
      console.error('Error deleting contract', error);
      toast('Error al eliminar', 'er');
    } finally {
      hideLoader();
    }
  }
}
