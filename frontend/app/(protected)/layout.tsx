'use client';

import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
import { toast } from 'sonner';

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  const token =
    typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  useEffect(() => {
    if (!token) {
      router.replace('/login');
      toast.warning("You don't have access");
    }
  }, [token, router]);

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Checking authentication...
      </div>
    );
  }

  return <>{children}</>;
}