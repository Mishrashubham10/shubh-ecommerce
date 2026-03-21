'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

import { productApi } from '@/services/product.api';

import { Button } from '@/components/ui/button';
import { Product } from '@/types/products';
import { ProductsCard } from '@/components/products/ProductsCard';
import ProductFilter from '@/components/products/ProductFilter';

export default function ProductsPage() {
  const router = useRouter();
  const params = useSearchParams();

  const search = params.get('search') || '';
  const minPrice = params.get('minPrice') || '';
  const maxPrice = params.get('maxPrice') || '';
  const page = Number(params.get('page') || 1);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState<{
    total: number;
    page: number;
    totalPages: number;
  } | null>(null);

  /**
   * UPDATE QUERY PARAMS
   */
  const updateQuery = (newParams: Record<string, string | number | undefined>) => {
    const query = new URLSearchParams(params.toString());

    Object.entries(newParams).forEach(([key, value]) => {
      if (!value) {
        query.delete(key);
      } else {
        query.set(key, String(value));
      }
    });

    router.push(`/products?${query.toString()}`);
  };

  /**
   * FETCH PRODUCTS
   */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const res = await productApi.getProducts({
          search,
          minPrice: minPrice ? Number(minPrice) : undefined,
          maxPrice: maxPrice ? Number(maxPrice) : undefined,
          page,
        });

        setProducts(res.data);
        setMeta(res.meta);
      } catch (err) {
        console.error('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [search, minPrice, maxPrice, page]);

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
   * EMPTY STATE
   */
  if (!products.length) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        No products found
      </div>
    );
  }

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* SIDEBAR FILTERS */}
      <div className="md:col-span-1">
        <ProductFilter />
      </div>

      {/* PRODUCTS SECTION */}
      <div className="md:col-span-3">
        {/* GRID */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductsCard key={product._id} product={product} />
          ))}
        </div>

        {/* PAGINATION */}
        <div className="flex justify-center gap-4 mt-8">
          <Button
            disabled={page <= 1}
            onClick={() => updateQuery({ page: page - 1 })}
          >
            Prev
          </Button>

          <span className="flex items-center font-medium">Page {page}</span>

          <Button
            disabled={meta ? page >= meta.totalPages : true}
            onClick={() => updateQuery({ page: page + 1 })}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}