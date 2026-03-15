'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { loginSchema, LoginFormValues } from '@/lib/validations/auth';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import axios from 'axios';
import Link from 'next/link';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [showPwd, setShowPwd] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // ============== ONSUBMIT ===============
  const onSubmit = async (values: LoginFormValues) => {
    try {
      const res = await api.post('/auth/login', values);

      const { user, accessToken } = res.data.data;

      // SAVE AUTH-STATE (STORE + LOCALSTORAGE)
      setAuth(user, accessToken);

      // Redirect to products
      router.push('/products');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const msg = err.response?.data?.message || 'Login Failed';
        form.setError('root', {
          type: 'server',
          message: msg,
        });
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {form.formState.errors.root && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.root.message}
                </p>
              )}

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="relative">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type={showPwd ? 'text' : 'password'}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <button
                  type="button"
                  className="absolute right-1 top-9 -translate-1"
                  onClick={() => setShowPwd((prev) => !prev)}
                >
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <Button type="submit" className="w-full">
                Login
              </Button>

              <div className="text-sm text-center">
                <span>Already have an account?</span>
                <Link
                  href="/register"
                  className="text-blue-600 hover:underline ml-1"
                >
                  Register
                </Link>
              </div>

              <div className="text-sm text-center">
                <Link
                  href="/forgot-password"
                  className="text-blue-600 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
