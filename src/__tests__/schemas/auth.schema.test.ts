import { loginSchema, registerSchema } from '@/schemas/auth.schema';

describe('Auth Schemas', () => {
  describe('loginSchema', () => {
    it('should validate correct login data', () => {
      const result = loginSchema.safeParse({
        email: 'user@example.com',
        password: 'password123',
      });

      expect(result.success).toBe(true);
    });

    it('should require email', () => {
      const result = loginSchema.safeParse({
        email: '',
        password: 'password123',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Email is required');
      }
    });

    it('should validate email format', () => {
      const result = loginSchema.safeParse({
        email: 'invalid-email',
        password: 'password123',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Invalid email address');
      }
    });

    it('should require password', () => {
      const result = loginSchema.safeParse({
        email: 'user@example.com',
        password: '',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Password is required');
      }
    });

    it('should accept valid email formats', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.org',
        'user+tag@example.co.uk',
      ];

      validEmails.forEach((email) => {
        const result = loginSchema.safeParse({ email, password: 'test' });
        expect(result.success).toBe(true);
      });
    });
  });

  describe('registerSchema', () => {
    const validData = {
      email: 'user@example.com',
      username: 'testuser',
      password: 'password123',
      confirmPassword: 'password123',
    };

    it('should validate correct registration data', () => {
      const result = registerSchema.safeParse(validData);

      expect(result.success).toBe(true);
    });

    describe('email validation', () => {
      it('should require email', () => {
        const result = registerSchema.safeParse({
          ...validData,
          email: '',
        });

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Email is required');
        }
      });

      it('should validate email format', () => {
        const result = registerSchema.safeParse({
          ...validData,
          email: 'not-an-email',
        });

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Invalid email address');
        }
      });
    });

    describe('username validation', () => {
      it('should require minimum 3 characters', () => {
        const result = registerSchema.safeParse({
          ...validData,
          username: 'ab',
        });

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Username must be at least 3 characters');
        }
      });

      it('should allow exactly 3 characters', () => {
        const result = registerSchema.safeParse({
          ...validData,
          username: 'abc',
        });

        expect(result.success).toBe(true);
      });

      it('should enforce maximum 20 characters', () => {
        const result = registerSchema.safeParse({
          ...validData,
          username: 'a'.repeat(21),
        });

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Username must be at most 20 characters');
        }
      });

      it('should allow exactly 20 characters', () => {
        const result = registerSchema.safeParse({
          ...validData,
          username: 'a'.repeat(20),
        });

        expect(result.success).toBe(true);
      });

      it('should only allow alphanumeric and underscores', () => {
        const result = registerSchema.safeParse({
          ...validData,
          username: 'user@name',
        });

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe(
            'Username can only contain letters, numbers and underscores'
          );
        }
      });

      it('should reject spaces in username', () => {
        const result = registerSchema.safeParse({
          ...validData,
          username: 'user name',
        });

        expect(result.success).toBe(false);
      });

      it('should reject special characters', () => {
        const invalidUsernames = ['user-name', 'user.name', 'user!', 'user#tag'];

        invalidUsernames.forEach((username) => {
          const result = registerSchema.safeParse({ ...validData, username });
          expect(result.success).toBe(false);
        });
      });

      it('should allow valid usernames', () => {
        const validUsernames = ['user123', 'User_Name', '_underscore_', 'ALLCAPS', 'mixedCase123'];

        validUsernames.forEach((username) => {
          const result = registerSchema.safeParse({ ...validData, username });
          expect(result.success).toBe(true);
        });
      });
    });

    describe('password validation', () => {
      it('should require minimum 6 characters', () => {
        const result = registerSchema.safeParse({
          ...validData,
          password: '12345',
          confirmPassword: '12345',
        });

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Password must be at least 6 characters');
        }
      });

      it('should allow exactly 6 characters', () => {
        const result = registerSchema.safeParse({
          ...validData,
          password: '123456',
          confirmPassword: '123456',
        });

        expect(result.success).toBe(true);
      });

      it('should allow long passwords', () => {
        const longPassword = 'a'.repeat(100);
        const result = registerSchema.safeParse({
          ...validData,
          password: longPassword,
          confirmPassword: longPassword,
        });

        expect(result.success).toBe(true);
      });
    });

    describe('password confirmation', () => {
      it('should require confirmPassword', () => {
        const result = registerSchema.safeParse({
          ...validData,
          confirmPassword: '',
        });

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Please confirm your password');
        }
      });

      it('should require passwords to match', () => {
        const result = registerSchema.safeParse({
          ...validData,
          password: 'password123',
          confirmPassword: 'differentpassword',
        });

        expect(result.success).toBe(false);
        if (!result.success) {
          const confirmError = result.error.issues.find((i) => i.path.includes('confirmPassword'));
          expect(confirmError?.message).toBe('Passwords do not match');
        }
      });

      it('should pass when passwords match', () => {
        const result = registerSchema.safeParse({
          ...validData,
          password: 'exactmatch',
          confirmPassword: 'exactmatch',
        });

        expect(result.success).toBe(true);
      });
    });
  });
});
