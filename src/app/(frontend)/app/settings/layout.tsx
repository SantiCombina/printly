import React from 'react';

import { SettingsNav } from '@/components/app/settings/settings-nav';

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold tracking-tight mb-6" style={{ color: '#191c1d' }}>
        Configuración
      </h1>
      <div className="flex gap-6">
        <SettingsNav />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
