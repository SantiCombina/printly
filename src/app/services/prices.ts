import { unstable_cache } from 'next/cache';
import { getPayload } from 'payload';

import config from '@payload-config';

export interface PriceConfig {
  paperPrices: Record<string, Record<string, number>>;
  inkPrices: { blancoNegro?: number; color?: Record<string, number> };
  profitMargins: Record<string, Record<string, number>>;
  bindingPrices: Record<string, number>;
}

export interface AvailableOptions {
  sizes: string[];
  weightsBySize: Record<string, string[]>;
  inkFormats: string[];
  percentagesByFormat: Record<string, string[]>;
  bindingRanges: string[];
}

async function fetchPriceConfig(ownerId: number): Promise<PriceConfig> {
  const payload = await getPayload({ config });

  const [paperDocs, inkDocs, marginDocs, bindingDocs] = await Promise.all([
    payload.find({
      collection: 'paper-prices',
      where: { owner: { equals: ownerId } },
      limit: 1000,
    }),
    payload.find({
      collection: 'ink-prices',
      where: { owner: { equals: ownerId } },
      limit: 1000,
    }),
    payload.find({
      collection: 'profit-margins',
      where: { owner: { equals: ownerId } },
      limit: 1000,
    }),
    payload.find({
      collection: 'binding-prices',
      where: { owner: { equals: ownerId } },
      limit: 1000,
    }),
  ]);

  const paperPrices: Record<string, Record<string, number>> = {};
  for (const doc of paperDocs.docs) {
    if (!paperPrices[doc.size]) {
      paperPrices[doc.size] = {};
    }
    paperPrices[doc.size][doc.weight] = doc.price;
  }

  const inkPrices: PriceConfig['inkPrices'] = {};
  for (const doc of inkDocs.docs) {
    if (doc.format === 'blancoNegro') {
      inkPrices.blancoNegro = doc.price;
    } else if (doc.format === 'color' && doc.percentage) {
      if (!inkPrices.color) {
        inkPrices.color = {};
      }
      inkPrices.color[doc.percentage] = doc.price;
    }
  }

  const profitMargins: Record<string, Record<string, number>> = {};
  for (const doc of marginDocs.docs) {
    if (!profitMargins[doc.format]) {
      profitMargins[doc.format] = {};
    }
    profitMargins[doc.format][doc.quantityRange] = doc.margin;
  }

  const bindingPrices: Record<string, number> = {};
  for (const doc of bindingDocs.docs) {
    bindingPrices[doc.quantityRange] = doc.price;
  }

  return { paperPrices, inkPrices, profitMargins, bindingPrices };
}

export function getPriceConfig(ownerId: number): Promise<PriceConfig> {
  return unstable_cache(
    () => fetchPriceConfig(ownerId),
    ['price-config', String(ownerId)],
    { revalidate: 300, tags: [`price-config-${ownerId}`] },
  )();
}

export function deriveAvailableOptions(config: PriceConfig): AvailableOptions {
  const sizes = Object.entries(config.paperPrices)
    .filter(([, weights]) => Object.keys(weights).length > 0)
    .map(([size]) => size);

  const weightsBySize: Record<string, string[]> = {};
  for (const size of sizes) {
    weightsBySize[size] = Object.keys(config.paperPrices[size]);
  }

  const inkFormats: string[] = [];
  if (config.inkPrices.blancoNegro !== undefined) {
    inkFormats.push('blancoNegro');
  }
  if (config.inkPrices.color !== undefined) {
    inkFormats.push('color');
  }

  const percentagesByFormat: Record<string, string[]> = {};
  for (const format of inkFormats) {
    if (format === 'color' && config.inkPrices.color) {
      percentagesByFormat[format] = Object.keys(config.inkPrices.color);
    } else {
      percentagesByFormat[format] = [];
    }
  }

  const bindingRanges = Object.keys(config.bindingPrices);

  return { sizes, weightsBySize, inkFormats, percentagesByFormat, bindingRanges };
}
