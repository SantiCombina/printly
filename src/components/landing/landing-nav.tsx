import { PrinterCheck } from 'lucide-react';
import Link from 'next/link';

export function LandingNav() {
  return (
    <nav
      className="sticky top-0 z-50 py-4"
      style={{ background: '#ffffff', boxShadow: '0px 1px 0px rgba(25,28,29,0.08)' }}
    >
      <div className="container-custom flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <PrinterCheck className="size-6 text-primary" strokeWidth={2.25} />
          <span className="text-xl font-bold tracking-tight" style={{ color: '#3525cd' }}>
            Printly
          </span>
        </div>
        <Link
          href="/login"
          className="px-5 py-2 text-sm font-medium transition-opacity hover:opacity-80"
          style={{ borderRadius: '9999px', background: '#e7e8e9', color: '#191c1d' }}
        >
          Iniciar sesión
        </Link>
      </div>
    </nav>
  );
}
