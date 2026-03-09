import { Suspense } from 'react';
import ProductsClient from './_productsClient';

export default function ProductsPage() {
  return (
    <Suspense fallback={null}>
      <ProductsClient />
    </Suspense>
  );
}