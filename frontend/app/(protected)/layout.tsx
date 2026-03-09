'use client';

import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      router.replace('/login');
    }
  }, [router]);

  // Optional: Prevent flicker
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;
  }

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}