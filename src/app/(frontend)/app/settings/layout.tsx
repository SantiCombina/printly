import React from 'react';

import { SettingsNav } from '@/components/app/settings/settings-nav';

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-6 items-start">
      <SettingsNav />
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
