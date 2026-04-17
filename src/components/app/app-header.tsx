import { PrinterCheck } from 'lucide-react';
import { headers } from 'next/headers';
import { getPayload } from 'payload';

import { AppNav } from '@/components/app/app-nav';
import { LogoutButton } from '@/components/app/logout-button';
import type { User } from '@/payload-types';

import config from '@payload-config';

export async function AppHeader() {
  const headersList = await headers();
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: headersList });
  const typedUser = user as User | null;

  const navItems = [
    { href: '/app', label: 'Cotizador' },
    ...(typedUser?.role === 'owner' ? [{ href: '/app/settings', label: 'Configuración' }] : []),
  ];

  return (
    <header
      className="sticky top-0 z-50 h-16 bg-white/80 backdrop-blur-xl"
      style={{ boxShadow: '0px 1px 0px rgba(25,28,29,0.08)' }}
    >
      <div className="container-custom flex items-center justify-between h-full">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <PrinterCheck className="size-5" strokeWidth={2.25} style={{ color: '#3525cd' }} />
            <span className="text-base font-black tracking-tight" style={{ color: '#3525cd' }}>
              Printly
            </span>
          </div>
          {typedUser?.localName && (
            <>
              <span className="text-[#d9dadb]">·</span>
              <span className="text-sm font-medium" style={{ color: '#464555' }}>
                {typedUser.localName}
              </span>
            </>
          )}
        </div>
        <div className="flex items-center gap-1">
          <AppNav items={navItems} />
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
