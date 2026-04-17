'use client';

import type { PrintParams } from '@/lib/schemas/print-schema';

interface PriceConfig {
  paperPrices: Record<string, Record<string, number>>;
  inkPrices: { blancoNegro?: number; color?: Record<string, number> };
  profitMargins: Record<string, Record<string, number>>;
  bindingPrices: Record<string, number>;
}

interface PriceCalculation {
  printingCost: number;
  bindingPrice: number;
  printingPrice: number;
  totalPrice: number;
}

function roundToNearest50(value: number): number {
  return Math.round(value / 50) * 50;
}

function pageCountInRange(pages: number, range: string): boolean {
  const plusMatch = range.match(/^(\d+)\+$/);
  if (plusMatch) {
    return pages >= parseInt(plusMatch[1], 10);
  }
  const rangeMatch = range.match(/^(\d+)-(\d+)$/);
  if (rangeMatch) {
    return pages >= parseInt(rangeMatch[1], 10) && pages <= parseInt(rangeMatch[2], 10);
  }
  const exactMatch = range.match(/^(\d+)$/);
  if (exactMatch) {
    return pages === parseInt(exactMatch[1], 10);
  }
  return false;
}

function getValueForPages<T>(pages: number, entries: Array<[string, T]>): T | undefined {
  for (const [range, value] of entries) {
    if (pageCountInRange(pages, range)) return value;
  }
  let fallbackValue: T | undefined;
  let fallbackFloor = -1;
  for (const [range, value] of entries) {
    const exactMatch = range.match(/^(\d+)$/);
    if (exactMatch) {
      const floor = parseInt(exactMatch[1], 10);
      if (pages >= floor && floor > fallbackFloor) {
        fallbackFloor = floor;
        fallbackValue = value;
      }
    }
  }
  return fallbackValue;
}

function getMarginForPages(
  pages: number,
  format: string,
  profitMargins: Record<string, Record<string, number>>,
): number {
  const formatMargins = profitMargins[format];
  if (!formatMargins) return 1;
  const result = getValueForPages(pages, Object.entries(formatMargins));
  return result ?? 1;
}

function getBindingPrice(pages: number, bindingQuantity: number, bindingPrices: Record<string, number>): number {
  if (bindingQuantity === 0) return 0;
  const sheetsPerCopy = pages / bindingQuantity;
  const result = getValueForPages(sheetsPerCopy, Object.entries(bindingPrices));
  if (result === undefined) return 0;
  return result * bindingQuantity;
}

interface UsePriceCalculationInput {
  params: Partial<PrintParams>;
  config: PriceConfig | undefined;
}

export function usePriceCalculation({ params, config }: UsePriceCalculationInput): PriceCalculation {
  const empty: PriceCalculation = { printingCost: 0, bindingPrice: 0, printingPrice: 0, totalPrice: 0 };

  if (!config || params.pages === undefined || !params.size || !params.weight || !params.format || !params.side) {
    return empty;
  }

  const { pages, size, weight, format, side, percentage, bindingQuantity = 0, additional = 0 } = params;

  const paperSizePrices = config.paperPrices[size];
  if (!paperSizePrices) return empty;
  const paperUnitPrice = paperSizePrices[weight];
  if (paperUnitPrice === undefined) return empty;

  const hojas = side === 'double' ? pages / 2 : pages;
  const costoPapel = paperUnitPrice * hojas;

  let costoTintaBase: number;
  if (format === 'color') {
    if (!percentage || !config.inkPrices.color) return empty;
    const colorPrice = config.inkPrices.color[percentage];
    if (colorPrice === undefined) return empty;
    costoTintaBase = colorPrice;
  } else {
    if (config.inkPrices.blancoNegro === undefined) return empty;
    costoTintaBase = config.inkPrices.blancoNegro;
  }

  const isA3 = size.toLowerCase().includes('a3');
  const costoTinta = costoTintaBase * pages * (isA3 ? 2 : 1);

  const printingCost = costoPapel + costoTinta;
  const margen = getMarginForPages(pages, format, config.profitMargins);
  const printingPrice = roundToNearest50(printingCost * margen);
  const bindingPrice = getBindingPrice(pages, bindingQuantity, config.bindingPrices);
  const totalPrice = printingPrice + bindingPrice + additional;

  return { printingCost, bindingPrice, printingPrice, totalPrice };
}
