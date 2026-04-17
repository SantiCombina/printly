import React from 'react';

import { AppHeader } from '@/components/app/app-header';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: '#f8f9fa' }}>
      <AppHeader />
      <div className="container-custom pt-6 pb-28">{children}</div>
    </div>
  );
}
