'use client';

import api from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import Image from 'next/image';
import { Product } from '@/types/products';

export function ProductsCard({ product }: { product: Product }) {
  const router = useRouter();
  const { accessToken } = useAuthStore();

  // ============ HANDLE ADD TO CART ==============
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // prevents link navigation

    if (!accessToken) {
      router.push('/login');
      return;
    }

    try {
      await api.post('/cart/add', {
        productId: product._id,
        quantity: 1,
      });

      toast.success('Added to cart!');
    } catch (err) {
      toast.error('Failed to add cart');
    }
  };

  return (
    <Link href={`/products/${product._id}`}>
      <Card className="cursor-pointer hover:shadow-lg transition">
        <CardContent className="p-4">
          <div className="mb-3 h-40 w-full bg-gray-100 flex items-center justify-center text-sm text-gray-400">
            {product.images?.[0] ? (
              <Image
                src={product.images[0]}
                alt={product.title}
                className="h-full w-full object-cover"
              />
            ) : (
              'No Image'
            )}
          </div>

          <h2 className="text-lg font-semibold">{product.title}</h2>

          <p className="mt-2 text-gray-600">₹ {product.price}</p>
        </CardContent>

        <CardFooter className="p-4">
          <Button className="w-full" onClick={handleAddToCart}>
            Add to Cart
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}