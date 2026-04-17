'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useAction } from 'next-safe-action/hooks';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { loginAction } from '@/app/(frontend)/login/actions';

const loginSchema = z.object({
  username: z.string().min(1, 'El usuario es requerido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const { executeAsync, isExecuting } = useAction(loginAction);

  async function onSubmit(values: LoginFormValues) {
    const result = await executeAsync(values);

    if (!result || result.serverError) {
      toast.error(result?.serverError ?? 'Error al iniciar sesión');
      return;
    }

    router.push(result.data?.role === 'owner' ? '/app/settings' : '/app');
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#f8f9fa' }}>
      <div
        className="w-full max-w-sm p-8 flex flex-col gap-6"
        style={{
          background: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0px 20px 40px rgba(25,28,29,0.06)',
        }}
      >
        <div className="text-center">
          <p className="text-2xl font-bold tracking-tight" style={{ color: '#3525cd' }}>
            Printly
          </p>
          <h1 className="mt-3 text-xl font-semibold tracking-tight" style={{ color: '#191c1d' }}>
            Bienvenido
          </h1>
          <p className="mt-1 text-sm" style={{ color: '#464555' }}>
            Iniciá sesión en tu cuenta
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" style={{ color: '#191c1d' }} htmlFor="username">
              Usuario
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              placeholder="Tu nombre de usuario"
              {...register('username')}
              className="w-full px-3 py-2 text-sm outline-none transition-all"
              style={{ background: '#f3f4f5', borderRadius: '8px', border: 'none', color: '#191c1d' }}
              onFocus={(e) => {
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(53,37,205,0.2)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
            {errors.username && (
              <p className="text-xs" style={{ color: '#ef4444' }}>
                {errors.username.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" style={{ color: '#191c1d' }} htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="Tu contraseña"
              {...register('password')}
              className="w-full px-3 py-2 text-sm outline-none transition-all"
              style={{ background: '#f3f4f5', borderRadius: '8px', border: 'none', color: '#191c1d' }}
              onFocus={(e) => {
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(53,37,205,0.2)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
            {errors.password && (
              <p className="text-xs" style={{ color: '#ef4444' }}>
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isExecuting}
            className="w-full py-2.5 text-sm font-semibold text-white mt-1 transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ borderRadius: '9999px', background: 'linear-gradient(135deg, #3525cd, #4F46E5)' }}
          >
            {isExecuting ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </form>
      </div>
    </div>
  );
}
