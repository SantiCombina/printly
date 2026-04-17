import { PrinterCheck } from 'lucide-react';

export function LandingFooter() {
  return (
    <footer className="py-8" style={{ background: '#ffffff' }}>
      <div className="container-custom flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <PrinterCheck className="size-6 text-primary" strokeWidth={2.25} />
          <span className="font-bold text-lg" style={{ color: '#3525cd' }}>
            Printly
          </span>
        </div>
        <span className="text-sm" style={{ color: '#464555' }}>
          © {new Date().getFullYear()} Printly. Todos los derechos reservados.
        </span>
      </div>
    </footer>
  );
}
