import { Zap, SlidersHorizontal, Users } from 'lucide-react';

const features = [
  {
    icon: <Zap size={28} style={{ color: '#3525cd' }} />,
    title: 'Cotización instantánea',
    desc: 'Calculá el precio de cualquier trabajo de impresión en segundos con resultados precisos.',
  },
  {
    icon: <SlidersHorizontal size={28} style={{ color: '#3525cd' }} />,
    title: 'Precios configurables',
    desc: 'Personalizá papeles, tintas, márgenes y anillados según tu estructura de costos.',
  },
  {
    icon: <Users size={28} style={{ color: '#3525cd' }} />,
    title: 'Multi-vendedor',
    desc: 'Creá cuentas para tu equipo de ventas y cada uno accede al cotizador de tu imprenta.',
  },
];

export function LandingFeatures() {
  return (
    <section className="mx-auto max-w-5xl px-8 pb-24">
      <h2 className="text-3xl font-bold tracking-tight text-center mb-12" style={{ color: '#191c1d' }}>
        Todo lo que necesitás
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="p-7 flex flex-col gap-4"
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              boxShadow: '0px 20px 40px rgba(25,28,29,0.06)',
            }}
          >
            <div>{feature.icon}</div>
            <h3 className="text-lg font-semibold" style={{ color: '#191c1d' }}>
              {feature.title}
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: '#464555' }}>
              {feature.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
