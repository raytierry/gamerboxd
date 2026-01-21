'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { PushButton } from '@/components/PushButton';
import { login } from '@/actions/auth';
import { loginSchema, type LoginFormData } from '@/schemas/auth.schema';
import { Gamepad2, ArrowLeft, Loader2 } from 'lucide-react';

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
    <main className="min-h-screen flex relative overflow-hidden">
      <div className="absolute inset-0 bg-background" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[120px]" />

      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors z-10"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Back</span>
      </Link>

      <div className="flex-1 flex items-center justify-center px-4 relative z-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <Link href="/" className="inline-flex items-center gap-2 mb-8">
              <div className="w-12 h-12 bg-linear-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Gamepad2 className="w-6 h-6 text-white" />
              </div>
            </Link>
            <h1 className="text-3xl font-bold text-white">Welcome back</h1>
            <p className="text-gray-400 mt-2">Sign in to continue your journey</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {serverError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm backdrop-blur-sm">
                {serverError}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-xl focus:border-indigo-500 focus:ring-indigo-500/20"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-red-400 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-xl focus:border-indigo-500 focus:ring-indigo-500/20"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-red-400 text-sm">{errors.password.message}</p>
              )}
            </div>

            <PushButton type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </PushButton>
          </form>

          <p className="text-center text-gray-400 mt-8">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
