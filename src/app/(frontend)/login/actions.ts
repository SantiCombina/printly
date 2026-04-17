'use server';

import { cookies } from 'next/headers';
import { z } from 'zod';

import { actionClient } from '@/lib/safe-action-client';

interface PayloadLoginResponse {
  token: string;
  user: {
    role: 'admin' | 'owner' | 'seller';
  };
}

export const loginAction = actionClient
  .schema(z.object({ username: z.string().min(1), password: z.string().min(1) }))
  .action(async ({ parsedInput }) => {
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: parsedInput.username, password: parsedInput.password }),
    });

    if (!response.ok) {
      throw new Error('Credenciales inválidas');
    }

    const data = (await response.json()) as PayloadLoginResponse;
    const cookieStore = await cookies();
    cookieStore.set('payload-token', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return { role: data.user.role };
  });
