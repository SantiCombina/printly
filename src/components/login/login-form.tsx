'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Calculator, PrinterCheck, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAction } from 'next-safe-action/hooks';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { loginAction } from '@/app/(frontend)/login/actions';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const loginSchema = z.object({
  username: z.string().min(1, 'El usuario es requerido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const features = [
  { icon: Zap, label: 'Cotizaciones en segundos' },
  { icon: Calculator, label: 'Precios siempre actualizados' },
  { icon: PrinterCheck, label: 'Gestión de vendedores' },
];

export function LoginForm() {
  const router = useRouter();

  const form = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

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
    <div className="min-h-screen flex" style={{ background: '#f8f9fa' }}>
      <div
        className="hidden lg:flex flex-col justify-between p-12 w-[480px] shrink-0 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #eef0fd 0%, #dde0fb 100%)' }}
      >
        <div
          className="absolute"
          style={{
            width: 480,
            height: 480,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(79,70,229,0.12) 0%, transparent 70%)',
            top: -120,
            right: -160,
            pointerEvents: 'none',
          }}
        />
        <div
          className="absolute"
          style={{
            width: 320,
            height: 320,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(53,37,205,0.08) 0%, transparent 70%)',
            bottom: 40,
            left: -80,
            pointerEvents: 'none',
          }}
        />

        <div className="relative z-10 flex items-center gap-2">
          <PrinterCheck className="size-7" strokeWidth={2.75} style={{ color: '#3525cd' }} />
          <span className="text-2xl font-black tracking-tight" style={{ color: '#3525cd' }}>
            Printly
          </span>
        </div>

        <div className="relative z-10 flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-bold tracking-tight leading-snug" style={{ color: '#191c1d' }}>
              El cotizador que tu imprenta necesita
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: '#777587' }}>
              Calculá presupuestos al instante, configurá tus precios y gestioná tu equipo desde un solo lugar.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {features.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center rounded-lg shrink-0"
                  style={{ width: 32, height: 32, background: '#ffffff' }}
                >
                  <Icon className="size-4" style={{ color: '#3525cd' }} strokeWidth={2} />
                </div>
                <span className="text-sm font-medium" style={{ color: '#464555' }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-xs font-medium tracking-widest uppercase" style={{ color: '#9ca3af' }}>
            Sistema de gestión para imprentas
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm flex flex-col gap-8">
          <div className="flex items-center gap-2 lg:hidden">
            <PrinterCheck className="size-7" strokeWidth={2.75} style={{ color: '#3525cd' }} />
            <span className="text-2xl font-black tracking-tight" style={{ color: '#3525cd' }}>
              Printly
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#191c1d' }}>
              Bienvenido
            </h1>
            <p className="text-sm" style={{ color: '#777587' }}>
              Iniciá sesión para continuar
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Usuario</FormLabel>
                    <FormControl>
                      <Input autoComplete="username" placeholder="Tu nombre de usuario" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <Input type="password" autoComplete="current-password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isExecuting}
                className="w-full py-3 text-sm font-semibold text-white mt-2 transition-opacity hover:opacity-90 disabled:opacity-60"
                style={{ borderRadius: '9999px', background: 'linear-gradient(135deg, #3525cd, #4F46E5)' }}
              >
                {isExecuting ? 'Ingresando...' : 'Iniciar sesión'}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
