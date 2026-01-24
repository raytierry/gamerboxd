'use server';

import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signIn } from '@/lib/auth';
import { AuthError } from 'next-auth';

interface AuthResult {
  success: boolean;
  error?: string;
}

export async function register(
  email: string,
  username: string,
  password: string
): Promise<AuthResult> {
  try {
    const existingUser = await prisma.users.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return { success: false, error: 'Email already in use' };
      }
      return { success: false, error: 'Username already taken' };
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.users.create({
      data: {
        email,
        username,
        passwordHash,
      },
    });

    return { success: true };
  } catch {
    return { success: false, error: 'Something went wrong' };
  }
}

export async function login(email: string, password: string): Promise<AuthResult> {
  try {
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === 'CredentialsSignin') {
        return { success: false, error: 'Invalid email or password' };
      }
    }
    throw error;
  }
}
