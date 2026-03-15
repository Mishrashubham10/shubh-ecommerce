import { Suspense } from 'react';
import { ProductsClientPage } from './_productsClient';

export default function ProductsPage() {
  return (
    <Suspense fallback={null}>
      <ProductsClientPage />
    </Suspense>
  );
}