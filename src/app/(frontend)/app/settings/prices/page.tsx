import { headers } from 'next/headers';
import { getPayload } from 'payload';

import { PricesClient } from '@/components/app/settings/prices/prices-client';
import { getOwnerIdForUser } from '@/lib/access';
import type { User } from '@/payload-types';

import config from '@payload-config';

export default async function PricesPage() {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await headers() });

  if (!user) return null;

  const ownerId = getOwnerIdForUser(user as User);
  if (!ownerId) return null;

  const [paperDocs, inkDocs, marginDocs, bindingDocs] = await Promise.all([
    payload.find({ collection: 'paper-prices', where: { owner: { equals: ownerId } }, limit: 1000 }),
    payload.find({ collection: 'ink-prices', where: { owner: { equals: ownerId } }, limit: 1000 }),
    payload.find({ collection: 'profit-margins', where: { owner: { equals: ownerId } }, limit: 1000 }),
    payload.find({ collection: 'binding-prices', where: { owner: { equals: ownerId } }, limit: 1000 }),
  ]);

  const paperPrices = paperDocs.docs.map((d) => ({ id: d.id, size: d.size, weight: d.weight, price: d.price }));
  const inkPrices = inkDocs.docs.map((d) => ({
    id: d.id,
    format: d.format,
    percentage: d.percentage ?? null,
    price: d.price,
  }));
  const margins = marginDocs.docs.map((d) => ({
    id: d.id,
    format: d.format,
    quantityRange: d.quantityRange,
    margin: d.margin,
  }));
  const bindingPrices = bindingDocs.docs.map((d) => ({ id: d.id, quantityRange: d.quantityRange, price: d.price }));

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Precios</h1>
        <PricesClient paperPrices={paperPrices} inkPrices={inkPrices} margins={margins} bindingPrices={bindingPrices} />
      </div>
    </div>
  );
}
