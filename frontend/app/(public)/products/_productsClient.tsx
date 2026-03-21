'use client';

import { ProductsCard } from '@/components/products/ProductsCard';
import api from '@/lib/api';
import { productApi } from '@/services/product.api';
import { Product } from '@/types/products';
import { useEffect, useState } from 'react';

export function ProductsClientPage() {
  const [products, setProducts] = useState<Product[]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * FETCH PRODUCTS
   */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsRes = await productApi.getProducts();
        console.log('============== RES - DATA ============', productsRes);
        setProducts(productsRes);
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
        {products?.map((product) => (
          <ProductsCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}