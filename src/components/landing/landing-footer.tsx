export function LandingFooter() {
  return (
    <footer className="px-8 py-8 flex items-center justify-between" style={{ background: '#ffffff' }}>
      <span className="font-bold text-lg" style={{ color: '#3525cd' }}>
        Printly
      </span>
      <span className="text-sm" style={{ color: '#464555' }}>
        © {new Date().getFullYear()} Printly. Todos los derechos reservados.
      </span>
    </footer>
  );
}
