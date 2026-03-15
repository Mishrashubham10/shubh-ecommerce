'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface CartItem {
  productId: {
    _id: string;
    title: string;
    price: number;
  };
  quantity: number;
}

interface Cart {
  items: CartItem[];
}

export default function CheckoutPage() {
  const router = useRouter();

  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  const [address, setAddress] = useState({
    line1: '',
    city: '',
    pincode: '',
    country: '',
  });

  /**
   * FETCH CART
   */
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await api.get('/carts');
        setCart(res.data.data);
      } catch (err) {
        toast.error('Failed to load cart');
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  /**
   * FETCH CART
   */
  const total =
    cart?.items.reduce(
      (sum, item) => sum + item.productId.price * item.quantity,
      0,
    ) || 0;

  /**
   * HANDLE ADDRESS CHANGE
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  };

  /**
   * CREATE ORDER
   */
  const handleCheckout = async () => {
    try {
      const res = await api.post('/orders', {
        shippingAddress: address,
      });

      const order = res.data.data;

      toast.success('Order created successfully');
      router.push(`/orders/${order._id}`);
    } catch (err) {
      toast.error('Checkout failed');
    }
  };

  /**
   * LOADING
   */
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading checkout...
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Cart is empty
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 grid md:grid-cols-2 gap-6">
      {/* SHIPPING ADDRESS */}
      <Card>
        <CardHeader>
          <CardTitle>Shipping Address</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <Input
            placeholder="Address line"
            name="line1"
            onChange={handleChange}
          />

          <Input placeholder="City" name="city" onChange={handleChange} />

          <Input placeholder="Pincode" name="pincode" onChange={handleChange} />

          <Input placeholder="Country" name="country" onChange={handleChange} />
        </CardContent>
      </Card>

      {/* ORDER SUMMARY */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {cart.items.map((item) => (
            <div key={item.productId._id} className="flex justify-between">
              <span>
                {item.productId.title} x {item.quantity}
              </span>

              <span>₹ {item.productId.price * item.quantity}</span>
            </div>
          ))}

          <hr />

          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>₹ {total}</span>
          </div>

          <Button className="w-full mt-4" onClick={handleCheckout}>
            Place Order
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}