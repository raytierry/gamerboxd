'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { register as registerUser } from '@/actions/auth';
import { registerSchema, type RegisterFormData } from '@/schemas/auth.schema';
import { Gamepad2, Loader2 } from 'lucide-react';

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

    const loginResult = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (loginResult?.error) {
      router.push('/login');
    } else {
      router.push('/');
      router.refresh();
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center border border-white/10"
              style={{
                background: 'linear-gradient(145deg, rgba(45, 80, 75, 0.4) 0%, rgba(25, 45, 45, 0.6) 100%)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Create account</h1>
          <p className="text-muted-foreground mt-2">Start tracking your games</p>
        </div>

        <div
          className="p-6 rounded-2xl border border-white/10"
          style={{
            background: 'linear-gradient(145deg, rgba(45, 80, 75, 0.2) 0%, rgba(25, 45, 45, 0.3) 100%)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {serverError && (
              <div className="bg-red-500/10 text-red-400 px-4 py-3 rounded-xl text-sm border border-red-500/20">
                {serverError}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="h-12 rounded-xl bg-white/5 border-white/10 focus:border-white/20"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-red-400 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-foreground">
                Username
              </label>
              <Input
                id="username"
                type="text"
                placeholder="coolplayer"
                className="h-12 rounded-xl bg-white/5 border-white/10 focus:border-white/20"
                {...register('username')}
              />
              {errors.username && (
                <p className="text-red-400 text-sm">{errors.username.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="h-12 rounded-xl bg-white/5 border-white/10 focus:border-white/20"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-red-400 text-sm">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                className="h-12 rounded-xl bg-white/5 border-white/10 focus:border-white/20"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className="text-red-400 text-sm">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 rounded-xl bg-white text-black hover:bg-white/90 font-medium"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Create account'
              )}
            </Button>
          </form>
        </div>

        <p className="text-center text-muted-foreground mt-8 text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-white hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
