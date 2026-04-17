'use client';

import { logoutAction } from '@/app/(frontend)/app/logout-action';

export function LogoutButton() {
  return (
    <button
      type="button"
      onClick={() => logoutAction()}
      className="px-4 py-1.5 text-sm font-medium transition-opacity hover:opacity-80"
      style={{ borderRadius: '9999px', background: '#e7e8e9', color: '#191c1d' }}
    >
      Salir
    </button>
  );
}
