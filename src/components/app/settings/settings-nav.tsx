'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Precios', href: '/app/settings/prices' },
  { label: 'Vendedores', href: '/app/settings/sellers' },
];

export function SettingsNav() {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 self-start bg-white rounded-xl shadow-[0px_20px_40px_rgba(25,28,29,0.06)] py-3 px-2">
      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
              isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </aside>
  );
}
