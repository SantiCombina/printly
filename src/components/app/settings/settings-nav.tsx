'use client';

import { DollarSign, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Precios', href: '/app/settings/prices', icon: DollarSign },
  { label: 'Vendedores', href: '/app/settings/sellers', icon: Users },
];

export function SettingsNav() {
  const pathname = usePathname();

  return (
    <aside
      className="w-52 shrink-0 self-start sticky top-6 bg-white rounded-2xl p-2"
      style={{ boxShadow: '0px 20px 40px rgba(25,28,29,0.06)' }}
    >
      <p className="px-3 pt-2 pb-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: '#9ca3af' }}>
        Configuración
      </p>
      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium rounded-xl transition-colors',
              isActive ? 'text-white' : 'hover:bg-[#f3f4f5]',
            )}
            style={
              isActive
                ? { background: 'linear-gradient(135deg, #3525cd 0%, #4F46E5 100%)', color: '#ffffff' }
                : { color: '#464555' }
            }
          >
            <Icon
              className={cn('size-4 shrink-0', isActive ? 'text-white' : '')}
              style={isActive ? {} : { color: '#777587' }}
            />
            {item.label}
          </Link>
        );
      })}
    </aside>
  );
}
