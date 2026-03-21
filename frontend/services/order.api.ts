import api from '@/lib/api';

export const orderApi = {
  createOrder: async (shippingAddress: unknown) => {
    const res = await api.post('/orders', {
      shippingAddress,
    });

    return res.data.data;
  },

  getMyOrders: async () => {
    const res = await api.get('/orders/my-order');
    return res.data.data;
  },
};