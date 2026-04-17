import Link from 'next/link';

const navItems = [
  { label: 'Precios', href: '/app/settings/prices' },
  { label: 'Vendedores', href: '/app/settings/sellers' },
];

export function SettingsNav() {
  return (
    <aside
      className="shrink-0 flex flex-col gap-1 py-4 px-3"
      style={{
        width: '240px',
        background: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0px 20px 40px rgba(25,28,29,0.06)',
        alignSelf: 'start',
      }}
    >
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="px-3 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-gray-100"
          style={{ color: '#191c1d' }}
        >
          {item.label}
        </Link>
      ))}
    </aside>
  );
}
