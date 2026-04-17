import { headers } from 'next/headers';
import { getPayload } from 'payload';

import { getPriceConfig, deriveAvailableOptions } from '@/app/services/prices';
import { QuotePageClient } from '@/components/app/quote-page-client';
import { getOwnerIdForUser } from '@/lib/access';
import type { User } from '@/payload-types';

import config from '@payload-config';

export default async function AppPage() {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await headers() });

  if (!user) return null;

  const ownerId = getOwnerIdForUser(user as User);

  if (!ownerId) {
    return <div className="p-6 text-sm text-red-500">No se pudo determinar el tenant. Contactá al administrador.</div>;
  }

  const priceConfig = await getPriceConfig(ownerId);
  const availableOptions = deriveAvailableOptions(priceConfig);

  return (
    <>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Cotizador</h1>
      <QuotePageClient priceConfig={priceConfig} availableOptions={availableOptions} />
    </>
  );
}
