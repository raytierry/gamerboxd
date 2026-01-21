'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { login } from '@/actions/auth';
import { loginSchema, type LoginFormData } from '@/schemas/auth.schema';

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormData) {
    setServerError('');

    const result = await login(data.email, data.password);

    if (result.success) {
      router.push('/profile');
      router.refresh();
    } else {
      setServerError(result.error || 'Login failed');
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0d0d0f] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Welcome back</h1>
          <p className="text-gray-400 mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {serverError && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
              {serverError}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1.5">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="bg-[#1a1a1d] border-[#2a2a2d] text-white placeholder:text-gray-500"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1.5">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="bg-[#1a1a1d] border-[#2a2a2d] text-white placeholder:text-gray-500"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-indigo-400 hover:text-indigo-300">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
