import api from '@/lib/api';

export const authApi = {
  login: async (email: string, password: string) => {
    const res = await api.post('/login', {
      email,
      password,
    });

    return res.data.data;
  },

  register: async (data: unknown) => {
    const res = await api.post('/register', data);
    return res.data.data;
  },

  logout: async () => {
    const res = await api.post('/logout');
    return res.data.data;
  },
};