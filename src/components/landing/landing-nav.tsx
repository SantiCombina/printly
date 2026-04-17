import Link from 'next/link';

export function LandingNav() {
  return (
    <nav
      className="sticky top-0 z-50 flex items-center justify-between px-8 py-4"
      style={{ background: '#ffffff', boxShadow: '0px 1px 0px rgba(25,28,29,0.08)' }}
    >
      <span className="text-xl font-bold tracking-tight" style={{ color: '#3525cd' }}>
        Printly
      </span>
      <Link
        href="/login"
        className="px-5 py-2 text-sm font-medium transition-opacity hover:opacity-80"
        style={{ borderRadius: '9999px', background: '#e7e8e9', color: '#191c1d' }}
      >
        Iniciar sesión
      </Link>
    </nav>
  );
}
