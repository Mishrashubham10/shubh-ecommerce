import api from '@/lib/api';

export const cartApi = {
  getCart: async () => {
    const res = await api.get('/carts');
    return res.data.data;
  },

  addToCart: async (productId: string, quantity = 1) => {
    const res = await api.post('/carts/add', {
      productId,
      quantity,
    });

    return res.data.data;
  },

  updateCartItem: async (productId: string) => {
    const res = await api.put('/carts/update', {
      productId,
    });

    return res.data.data;
  },

  removeFromCart: async (productId: string) => {
    const res = await api.delete('/carts/delete', {
      data: { productId },
    });

    return res.data.data;
  },
};