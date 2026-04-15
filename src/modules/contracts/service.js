import { api } from '../../core/api.js';

export class ContractsService {
  async getAll() {
    return await api.get('contracts', '?order=created_at.desc');
  }

  async getById(id) {
    const result = await api.get('contracts', `?id=eq.${id}&limit=1`);
    return result[0] || null;
  }

  async create(data) {
    return await api.post('contracts', data);
  }

  async update(id, data) {
    return await api.patch('contracts', data, `?id=eq.${id}`);
  }

  async delete(id) {
    return await api.delete('contracts', `?id=eq.${id}`);
  }

  async search(filters = {}) {
    let query = '?';
    const params = [];

    if (filters.estado) {
      params.push(`estado=eq.${encodeURIComponent(filters.estado)}`);
    }

    if (filters.search) {
      params.push(`contrato_numero=ilike.%${encodeURIComponent(filters.search)}%`);
    }

    if (params.length > 0) {
      query += params.join('&');
    }

    query += '&order=created_at.desc';

    return await api.get('contracts', query);
  }
}

export const contractsService = new ContractsService();
