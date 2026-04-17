import Link from 'next/link';

import { Button } from '@/components/ui/button';

export function LandingHero() {
  return (
    <section className="container-custom py-28 text-center">
      <h1 className="text-5xl font-bold tracking-tight leading-tight mb-6" style={{ color: '#191c1d' }}>
        El cotizador que tu imprenta necesita
      </h1>
      <p className="text-xl mb-10 max-w-2xl mx-auto" style={{ color: '#464555' }}>
        Calculá presupuestos de impresión en segundos. Configurá tus precios, gestioná vendedores y generá cotizaciones
        profesionales al instante.
      </p>
      <div className="flex items-center justify-center gap-4 flex-wrap">
        <Link
          href="/login"
          className="px-8 py-3 text-base font-semibold text-white transition-opacity hover:opacity-90"
          style={{ borderRadius: '9999px', background: 'linear-gradient(135deg, #3525cd, #4F46E5)' }}
        >
          Empezar ahora
        </Link>
        <Button
          type="button"
          className="px-8 py-3 text-base font-semibold transition-opacity hover:opacity-80"
          style={{ borderRadius: '9999px', background: '#e7e8e9', color: '#191c1d' }}
        >
          Ver demo
        </Button>
      </div>
    </section>
  );
}
