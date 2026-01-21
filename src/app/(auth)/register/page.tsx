'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { register as registerUser, login } from '@/actions/auth';
import { registerSchema, type RegisterFormData } from '@/schemas/auth.schema';

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterFormData) {
    setServerError('');

    const result = await registerUser(data.email, data.username, data.password);

    if (!result.success) {
      setServerError(result.error || 'Registration failed');
      return;
    }

    const loginResult = await login(data.email, data.password);

    if (loginResult.success) {
      router.push('/profile');
      router.refresh();
    } else {
      router.push('/login');
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0d0d0f] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Create an account</h1>
          <p className="text-gray-400 mt-2">Start tracking your gaming journey</p>
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
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1.5">
              Username
            </label>
            <Input
              id="username"
              type="text"
              placeholder="johndoe"
              className="bg-[#1a1a1d] border-[#2a2a2d] text-white placeholder:text-gray-500"
              {...register('username')}
            />
            {errors.username && (
              <p className="text-red-400 text-sm mt-1">{errors.username.message}</p>
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

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1.5">
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              className="bg-[#1a1a1d] border-[#2a2a2d] text-white placeholder:text-gray-500"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="text-red-400 text-sm mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </Button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-indigo-400 hover:text-indigo-300">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
