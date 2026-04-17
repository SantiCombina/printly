import { headers } from 'next/headers';
import Link from 'next/link';
import { getPayload } from 'payload';

import { LogoutButton } from '@/components/app/logout-button';
import type { User } from '@/payload-types';

import config from '@payload-config';

export async function AppHeader() {
  const headersList = await headers();
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: headersList });
  const typedUser = user as User | null;

  return (
    <header
      className="sticky top-0 z-50 flex items-center justify-between px-8 h-14"
      style={{ background: '#ffffff', boxShadow: '0px 1px 0px rgba(25,28,29,0.08)' }}
    >
      <div className="flex items-center gap-8">
        <span className="text-lg font-bold tracking-tight" style={{ color: '#3525cd' }}>
          Printly
        </span>
        <nav className="flex items-center gap-1">
          <Link
            href="/app"
            className="px-4 py-1.5 text-sm font-medium rounded-full transition-colors hover:bg-gray-100"
            style={{ color: '#191c1d' }}
          >
            Cotizador
          </Link>
          {typedUser?.role === 'owner' && (
            <Link
              href="/app/settings"
              className="px-4 py-1.5 text-sm font-medium rounded-full transition-colors hover:bg-gray-100"
              style={{ color: '#191c1d' }}
            >
              Configuración
            </Link>
          )}
        </nav>
      </div>
      <div className="flex items-center gap-3">
        {typedUser && (
          <span className="text-sm" style={{ color: '#464555' }}>
            {typedUser.username}
          </span>
        )}
        <LogoutButton />
      </div>
    </header>
  );
}
