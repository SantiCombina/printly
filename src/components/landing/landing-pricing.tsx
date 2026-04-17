import Link from 'next/link';

import { Button } from '@/components/ui/button';

const basicFeatures = ['1 imprenta', 'Hasta 2 vendedores', 'Cotizador completo', 'Configuración de precios'];

const proFeatures = [
  'Vendedores ilimitados',
  'Reportes y estadísticas',
  'Generación de presupuestos PDF',
  'Soporte prioritario',
  'Todo lo del plan Básico',
];

export function LandingPricing() {
  return (
    <section className="container-custom pb-28">
      <h2 className="text-3xl font-bold tracking-tight text-center mb-12" style={{ color: '#191c1d' }}>
        Planes simples
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          className="p-8 flex flex-col gap-6"
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0px 20px 40px rgba(25,28,29,0.06)',
          }}
        >
          <div>
            <p className="text-sm font-medium uppercase tracking-wider mb-1" style={{ color: '#464555' }}>
              Básico
            </p>
            <p className="text-4xl font-bold tracking-tight" style={{ color: '#191c1d' }}>
              $9<span className="text-lg font-normal">/mes</span>
            </p>
          </div>
          <ul className="flex flex-col gap-3 text-sm" style={{ color: '#464555' }}>
            {basicFeatures.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span style={{ color: '#10B981' }}>✓</span> {item}
              </li>
            ))}
          </ul>
          <Button
            type="button"
            className="w-full py-3 text-sm font-semibold transition-opacity hover:opacity-80"
            style={{ borderRadius: '9999px', background: '#e7e8e9', color: '#191c1d' }}
          >
            Comenzar
          </Button>
        </div>

        <div
          className="p-8 flex flex-col gap-6"
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0px 20px 40px rgba(25,28,29,0.06)',
            outline: '2px solid #4F46E5',
          }}
        >
          <div>
            <p className="text-sm font-medium uppercase tracking-wider mb-1" style={{ color: '#4F46E5' }}>
              Pro
            </p>
            <p className="text-4xl font-bold tracking-tight" style={{ color: '#191c1d' }}>
              $24<span className="text-lg font-normal">/mes</span>
            </p>
          </div>
          <ul className="flex flex-col gap-3 text-sm" style={{ color: '#464555' }}>
            {proFeatures.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span style={{ color: '#10B981' }}>✓</span> {item}
              </li>
            ))}
          </ul>
          <Link
            href="/login"
            className="w-full py-3 text-sm font-semibold text-white text-center transition-opacity hover:opacity-90"
            style={{
              borderRadius: '9999px',
              background: 'linear-gradient(135deg, #3525cd, #4F46E5)',
              display: 'block',
            }}
          >
            Comenzar con Pro
          </Link>
        </div>
      </div>
    </section>
  );
}
