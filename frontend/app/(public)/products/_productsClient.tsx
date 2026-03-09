'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  images?: string[];
}

export function ProductsClientPage() {
  const router = useRouter();
  const { accessToken } = useAuthStore();

  const [products, setProducts] = useState<Product[]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * FETCH PRODUCTS
   */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        console.log('============== RES - DATA ============', res.data);
        setProducts(res.data.data);
      } catch (err) {
        setError('Failed to load products');
        console.log('Failed to fetch products from server');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  /**
   * ADD TO CART
   */
  const handleAddToCart = async (productId: string) => {
    // IF USER NOT LOGGED IN → REDIRECT
    if (!accessToken) {
      router.push('/login');
      return;
    }

    try {
      await api.post('/cart/add', {
        productId,
        quantity: 1,
      });

      toast.success('Product added to cart');
    } catch (err) {
      console.log('Failed to add product');
      toast.error('Failed to add product');
    }
  };

  /**
   * LOADING STATE
   */
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading products...
      </div>
    );
  }

  /**
   * ERROR STATE
   */
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  /**
   * PRODUCTS GRID
   */
  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">Products</h1>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products?.map((p) => (
          <Card key={p._id}>
            <CardContent className="p-4">
              <div className="mb-3 h-40 w-full bg-gray-100 flex items-center justify-center text-sm text-gray-400">
                {p.images?.[0] ? (
                  <Image src={p.images[0]} alt={p.title} fill loading="lazy" />
                ) : (
                  'No Image'
                )}
              </div>

              <h2 className="text-lg font-semibold">{p.title}</h2>

              <p className="mt-2 text-gray-600">₹ {p.price}</p>
            </CardContent>

            <CardFooter className="p-4">
              <Button className="w-full" onClick={() => handleAddToCart(p._id)}>
                Add to Cart
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}