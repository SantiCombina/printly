import { unstable_cache } from 'next/cache';
import { getPayload } from 'payload';

import config from '@payload-config';

export interface SettingsData {
  paperPrices: { id: number; size: string; weight: string; price: number }[];
  inkPrices: { id: number; format: string; percentage: string | null; price: number }[];
  margins: { id: number; format: string; quantityRange: string; margin: number }[];
  bindingPrices: { id: number; quantityRange: string; price: number }[];
  sellers: { id: number; username: string; createdAt: string }[];
}

async function fetchSettingsData(ownerId: number): Promise<SettingsData> {
  const payload = await getPayload({ config });

  const [paperDocs, inkDocs, marginDocs, bindingDocs, sellerDocs] = await Promise.all([
    payload.find({ collection: 'paper-prices', where: { owner: { equals: ownerId } }, limit: 1000 }),
    payload.find({ collection: 'ink-prices', where: { owner: { equals: ownerId } }, limit: 1000 }),
    payload.find({ collection: 'profit-margins', where: { owner: { equals: ownerId } }, limit: 1000 }),
    payload.find({ collection: 'binding-prices', where: { owner: { equals: ownerId } }, limit: 1000 }),
    payload.find({
      collection: 'users',
      where: { and: [{ owner: { equals: ownerId } }, { role: { equals: 'seller' } }] },
      limit: 1000,
    }),
  ]);

  return {
    paperPrices: paperDocs.docs.map((d) => ({ id: d.id, size: d.size, weight: d.weight, price: d.price })),
    inkPrices: inkDocs.docs.map((d) => ({ id: d.id, format: d.format, percentage: d.percentage ?? null, price: d.price })),
    margins: marginDocs.docs.map((d) => ({ id: d.id, format: d.format, quantityRange: d.quantityRange, margin: d.margin })),
    bindingPrices: bindingDocs.docs.map((d) => ({ id: d.id, quantityRange: d.quantityRange, price: d.price })),
    sellers: sellerDocs.docs.map((s) => ({ id: s.id, username: s.username ?? '', createdAt: s.createdAt })),
  };
}

export function getSettingsData(ownerId: number): Promise<SettingsData> {
  return unstable_cache(
    () => fetchSettingsData(ownerId),
    ['settings-data', String(ownerId)],
    { revalidate: 60, tags: [`settings-${ownerId}`] },
  )();
}
