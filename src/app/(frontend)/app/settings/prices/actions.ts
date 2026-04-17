'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { headers } from 'next/headers';
import { getPayload } from 'payload';
import { z } from 'zod';

import { getOwnerIdForUser } from '@/lib/access';
import { actionClient } from '@/lib/safe-action-client';
import type { User } from '@/payload-types';

import config from '@payload-config';

async function resolveOwnerId(): Promise<{ payload: Awaited<ReturnType<typeof getPayload>>; ownerId: number }> {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await headers() });
  if (!user) throw new Error('No autenticado');
  const ownerId = getOwnerIdForUser(user as User);
  if (!ownerId) throw new Error('Owner no encontrado');
  return { payload, ownerId };
}

function invalidatePriceCache(ownerId: number) {
  revalidateTag(`price-config-${ownerId}`);
  revalidateTag(`settings-${ownerId}`);
  revalidatePath('/app');
}

export const createPaperPriceAction = actionClient
  .schema(z.object({ size: z.string().min(1), weight: z.string().min(1), price: z.number().positive() }))
  .action(async ({ parsedInput }) => {
    const { payload, ownerId } = await resolveOwnerId();
    const doc = await payload.create({
      collection: 'paper-prices',
      data: { size: parsedInput.size, weight: parsedInput.weight, price: parsedInput.price, owner: ownerId },
    });
    invalidatePriceCache(ownerId);
    return { id: doc.id };
  });

export const updatePaperPriceAction = actionClient
  .schema(z.object({ id: z.number(), price: z.number().positive() }))
  .action(async ({ parsedInput }) => {
    const { payload, ownerId } = await resolveOwnerId();
    await payload.update({ collection: 'paper-prices', id: parsedInput.id, data: { price: parsedInput.price } });
    invalidatePriceCache(ownerId);
    return { success: true };
  });

export const deletePaperPriceAction = actionClient
  .schema(z.object({ id: z.number() }))
  .action(async ({ parsedInput }) => {
    const { payload, ownerId } = await resolveOwnerId();
    await payload.delete({ collection: 'paper-prices', id: parsedInput.id });
    invalidatePriceCache(ownerId);
    return { success: true };
  });

export const createInkPriceAction = actionClient
  .schema(
    z.object({ format: z.string().min(1), percentage: z.string().nullable().optional(), price: z.number().positive() }),
  )
  .action(async ({ parsedInput }) => {
    const { payload, ownerId } = await resolveOwnerId();
    const doc = await payload.create({
      collection: 'ink-prices',
      data: {
        format: parsedInput.format,
        percentage: parsedInput.percentage ?? null,
        price: parsedInput.price,
        owner: ownerId,
      },
    });
    invalidatePriceCache(ownerId);
    return { id: doc.id };
  });

export const updateInkPriceAction = actionClient
  .schema(z.object({ id: z.number(), price: z.number().positive() }))
  .action(async ({ parsedInput }) => {
    const { payload, ownerId } = await resolveOwnerId();
    await payload.update({ collection: 'ink-prices', id: parsedInput.id, data: { price: parsedInput.price } });
    invalidatePriceCache(ownerId);
    return { success: true };
  });

export const deleteInkPriceAction = actionClient
  .schema(z.object({ id: z.number() }))
  .action(async ({ parsedInput }) => {
    const { payload, ownerId } = await resolveOwnerId();
    await payload.delete({ collection: 'ink-prices', id: parsedInput.id });
    invalidatePriceCache(ownerId);
    return { success: true };
  });

export const createProfitMarginAction = actionClient
  .schema(z.object({ format: z.string().min(1), quantityRange: z.string().min(1), margin: z.number().positive() }))
  .action(async ({ parsedInput }) => {
    const { payload, ownerId } = await resolveOwnerId();
    const doc = await payload.create({
      collection: 'profit-margins',
      data: {
        format: parsedInput.format,
        quantityRange: parsedInput.quantityRange,
        margin: parsedInput.margin,
        owner: ownerId,
      },
    });
    invalidatePriceCache(ownerId);
    return { id: doc.id };
  });

export const updateProfitMarginAction = actionClient
  .schema(z.object({ id: z.number(), margin: z.number().positive() }))
  .action(async ({ parsedInput }) => {
    const { payload, ownerId } = await resolveOwnerId();
    await payload.update({ collection: 'profit-margins', id: parsedInput.id, data: { margin: parsedInput.margin } });
    invalidatePriceCache(ownerId);
    return { success: true };
  });

export const deleteProfitMarginAction = actionClient
  .schema(z.object({ id: z.number() }))
  .action(async ({ parsedInput }) => {
    const { payload, ownerId } = await resolveOwnerId();
    await payload.delete({ collection: 'profit-margins', id: parsedInput.id });
    invalidatePriceCache(ownerId);
    return { success: true };
  });

export const createBindingPriceAction = actionClient
  .schema(z.object({ quantityRange: z.string().min(1), price: z.number().positive() }))
  .action(async ({ parsedInput }) => {
    const { payload, ownerId } = await resolveOwnerId();
    const doc = await payload.create({
      collection: 'binding-prices',
      data: { quantityRange: parsedInput.quantityRange, price: parsedInput.price, owner: ownerId },
    });
    invalidatePriceCache(ownerId);
    return { id: doc.id };
  });

export const updateBindingPriceAction = actionClient
  .schema(z.object({ id: z.number(), price: z.number().positive() }))
  .action(async ({ parsedInput }) => {
    const { payload, ownerId } = await resolveOwnerId();
    await payload.update({ collection: 'binding-prices', id: parsedInput.id, data: { price: parsedInput.price } });
    invalidatePriceCache(ownerId);
    return { success: true };
  });

export const deleteBindingPriceAction = actionClient
  .schema(z.object({ id: z.number() }))
  .action(async ({ parsedInput }) => {
    const { payload, ownerId } = await resolveOwnerId();
    await payload.delete({ collection: 'binding-prices', id: parsedInput.id });
    invalidatePriceCache(ownerId);
    return { success: true };
  });
