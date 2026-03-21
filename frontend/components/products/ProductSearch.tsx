'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '../ui/input';

export function ProductSearch() {
  const router = useRouter();
  const params = useSearchParams();

  const search = params.get('search') || '';

  const handleSearch = (value: string) => {
    const query = new URLSearchParams();

    if (value) {
      query.set('search', value);
    }

    router.push(`/products?${query.toString()}`);
  };

  return (
    <Input
      placeholder="Search products..."
      defaultValue={search}
      onChange={(e) => handleSearch(e.target.value)}
      className="max-w-md"
    />
  );
}