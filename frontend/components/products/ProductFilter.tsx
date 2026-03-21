'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

export default function ProductFilter() {
  const router = useRouter();
  const params = useSearchParams();

  const search = params.get('search') || '';
  const minPrice = params.get('minPrice') || '';
  const maxPrice = params.get('maxPrice') || '';

  // ============ UPDATE QUERY ==============
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

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h2 className="font-semibold text-lg">Filters</h2>

      {/* ============ SEARCH ============= */}
      <Input
        placeholder="Search products..."
        defaultValue={search}
        onChange={(e) => updateQuery({ search: e.target.value, page: 1 })}
      />

      {/* ============== PRICE FILTER ================= */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Price</p>

        <Input
          placeholder="Min"
          type="number"
          defaultValue={minPrice}
          onChange={(e) => updateQuery({ minPrice: e.target.value, page: 1 })}
        />

        <Input
          placeholder="Max"
          type="number"
          defaultValue={maxPrice}
          onChange={(e) => updateQuery({ maxPrice: e.target.value, page: 1 })}
        />
      </div>

      {/* =========== CLEAR BUTTON ============ */}
      <Button
        className="w-full"
        variant="outline"
        onClick={() => router.push('/products')}
      >
        Clear Filters
      </Button>
    </div>
  );
}