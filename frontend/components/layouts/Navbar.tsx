'use client';

import { useAuthStore } from '@/store/auth.store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '../ui/button';

export default function Navbar() {
  const router = useRouter();
  const { accessToken, logout } = useAuthStore();

  //   ============ LANDLE LOGOUT ===============
  const handleLogout = () => {
    logout();
    toast.success('You logged out successfully!');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    router.push('/login');
  };

  return (
    <nav className="border-b bg-white">
      <div className="mx-auto max-w-6xl flex items-center justify-between p-4">
        {/* ========== LOGO =========== */}
        <Link href="/products" className="text-xl font-bold">
          ShubhStore
        </Link>

        {/* ============ NAVIGATION LINKS ============== */}
        <div className="flex items-center gap-6">
          <Link href="/products" className="text-sm font-medium">
            Products
          </Link>

          {accessToken && (
            <>
              <Link href="/cart" className="text-sm font-medium">
                Cart
              </Link>

              <Link href="/orders" className="text-sm font-medium">
                Orders
              </Link>
            </>
          )}
        </div>

        {/* ============= AUTH BUTTONS ============ */}
        <div>
          {accessToken ? (
            <Button onClick={handleLogout}>Logout</Button>
          ) : (
            <Link href="/login">
              <Button>Login</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}