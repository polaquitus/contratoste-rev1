import { api } from '../../core/api.js';

export class UsersService {
  async getAll() {
    return await api.get('app_users', '?order=id.asc');
  }

  async getById(id) {
    const result = await api.get('app_users', `?id=eq.${id}&limit=1`);
    return result[0] || null;
  }

  async create(data) {
    return await api.post('app_users', data);
  }

  async update(id, data) {
    return await api.patch('app_users', data, `?id=eq.${id}`);
  }

  async delete(id) {
    return await api.delete('app_users', `?id=eq.${id}`);
  }

  async resetPassword(id, passwordHash) {
    return await api.patch('app_users', { password_hash: passwordHash }, `?id=eq.${id}`);
  }

  async toggleActive(id, active) {
    return await api.patch('app_users', { active }, `?id=eq.${id}`);
  }
}

export const usersService = new UsersService();
