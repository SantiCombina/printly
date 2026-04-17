import { QuotePageClient } from '@/components/app/quote-page-client';
import { getPriceConfig, deriveAvailableOptions } from '@/app/services/prices';
import { getAuthUser } from '@/lib/auth-cache';
import { getOwnerIdForUser } from '@/lib/access';
import type { User } from '@/payload-types';

export default async function AppPage() {
  const user = await getAuthUser();

  if (!user) return null;

  const ownerId = getOwnerIdForUser(user as User);

  if (!ownerId) {
    return <div className="p-6 text-sm text-red-500">No se pudo determinar el tenant. Contactá al administrador.</div>;
  }

  const priceConfig = await getPriceConfig(ownerId);
  const availableOptions = deriveAvailableOptions(priceConfig);

  return <QuotePageClient priceConfig={priceConfig} availableOptions={availableOptions} />;
}
