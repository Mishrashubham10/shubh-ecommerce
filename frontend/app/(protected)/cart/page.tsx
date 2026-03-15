'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import api from '@/lib/api';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface CartItem {
  productId: {
    _id: string;
    title: string;
    price: number;
    images?: string[];
  };
  quantity: number;
}

interface Cart {
  items: CartItem[];
}

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>();
  const [loading, setLoading] = useState(true);

  /**
   * FETCH CART
   */
  const fetchCarts = async () => {
    try {
      const res = await api.get('/carts');
      setCart(res.data.data);
    } catch (err) {
      console.error('Failed to fetch cart');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarts();
  }, []);

  /**
   * UPDATE QUANTITY
   */
  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      await api.put('/carts/update', {
        productId,
        quantity,
      });

      fetchCarts();
    } catch (err) {
      toast.error('Failed to update cart');
    }
  };

  /**
   * REMOVE ITEM
   */
  const removeItem = async (productId: string) => {
    try {
      await api.delete('/carts/remove', {
        data: { productId },
      });

      fetchCarts();
    } catch (err) {
      toast.error('Failed to remove item');
    }
  };

  /**
   * LOADING STATE
   */
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading cart...
      </div>
    );
  }

  /**
   * EMPTY CART
   */
  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Your cart is empty
      </div>
    );
  }

  /**
   * CALCULATE TOTAL
   */
  const total = cart.items.reduce(
    (sum, item) => sum + item.productId.price * item.quantity,
    0,
  );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      <div className="space-y-4">
        {cart.items.map((item) => (
          <Card key={item.productId._id}>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <h2 className="font-semibold">{item.productId.title}</h2>

                <p className="text-gray-500">₹ {item.productId.price}</p>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() =>
                    updateQuantity(item.productId._id, item.quantity - 1)
                  }
                  disabled={item.quantity <= 1}
                >
                  -
                </Button>

                <span>{item.quantity}</span>

                <Button
                  variant="outline"
                  onClick={() =>
                    updateQuantity(item.productId._id, item.quantity + 1)
                  }
                >
                  +
                </Button>
              </div>

              <Button
                variant="destructive"
                onClick={() => removeItem(item.productId._id)}
              >
                Remove
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ORDER SUMMARY */}
      <div className="mt-8 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Total: ₹ {total}</h2>

        <Button size="lg">Proceed to Checkout</Button>
      </div>
    </div>
  );
}