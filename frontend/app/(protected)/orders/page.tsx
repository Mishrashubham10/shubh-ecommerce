'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/lib/api';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  /**
   * FETCH ORDERS
   */
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders/my-orders');
        setOrders(res.data.data);
      } catch (err) {
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  /**
   * LOADING STATE
   */
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading orders...
      </div>
    );
  }

  /**
   * EMPTY ORDERS
   */
  if (orders.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        No orders found
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">My Orders</h1>

      {orders.map((order) => (
        <Card key={order._id}>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Order #{order._id.slice(-6)}</CardTitle>

            <span className="text-sm font-medium">Status: {order.status}</span>
          </CardHeader>

          <CardContent className="space-y-3">
            {order.items.map((item, index) => (
              <div className="flex justify-between" key={index}>
                <span>
                  {item.title} * {item.quantity}
                </span>

                <span>₹ {item.price * item.quantity}</span>
              </div>
            ))}

            <hr />

            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>₹ {order.totalAmount}</span>
            </div>

            <p className="text-sm text-gray-500">
              Ordered on: {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}