'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, useReducedMotion } from 'motion/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { loginSchema, type LoginFormData } from '@/schemas/auth.schema';
import { Gamepad2, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState('');
  const shouldReduce = useReducedMotion();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormData) {
    setServerError('');
    
    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      setServerError('Invalid email or password');
    } else {
      router.push('/');
      router.refresh();
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-background">
      <motion.div
        initial={shouldReduce ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-block mb-8">
            <motion.div
              whileHover={shouldReduce ? undefined : { scale: 1.05 }}
              whileTap={shouldReduce ? undefined : { scale: 0.95 }}
              className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto"
              style={{
                border: '1px solid var(--nav-border-color)',
                background:
                  'linear-gradient(180deg, var(--glass-button-from) 0%, var(--glass-button-to) 100%)',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              }}
            >
              <Gamepad2 className="w-8 h-8 text-foreground" />
            </motion.div>
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back
          </h1>
          <p className="text-muted-foreground text-base">
            Sign in to your account
          </p>
        </div>

        {/* Form Card */}
        <motion.div
          initial={shouldReduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-3xl p-8 nav-glass"
          style={{
            border: '1px solid var(--nav-border-color)',
            boxShadow: 'var(--nav-shadow)',
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {serverError && (
              <motion.div
                initial={shouldReduce ? false : { opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-500/10 text-red-400 px-4 py-3 rounded-2xl text-sm border border-red-500/20"
              >
                {serverError}
              </motion.div>
            )}

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-foreground"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="h-12 rounded-2xl bg-white/5 border-white/10 focus:border-white/20 text-foreground placeholder:text-muted-foreground"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-red-400 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-foreground"
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="h-12 rounded-2xl bg-white/5 border-white/10 focus:border-white/20 text-foreground placeholder:text-muted-foreground"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-red-400 text-sm">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 rounded-2xl font-medium transition-all"
              style={{
                background: 'var(--button-primary)',
                color: 'var(--button-primary-text)',
              }}
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Sign in'
              )}
            </Button>
          </form>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={shouldReduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center text-muted-foreground mt-8 text-sm"
        >
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            className="text-foreground hover:underline font-medium"
          >
            Create one
          </Link>
        </motion.p>
      </motion.div>
    </main>
  );
}
