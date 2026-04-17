'use server';

import { revalidateTag } from 'next/cache';
import { headers } from 'next/headers';
import { getPayload } from 'payload';
import { z } from 'zod';

import { getOwnerIdForUser } from '@/lib/access';
import { actionClient } from '@/lib/safe-action-client';
import type { User } from '@/payload-types';

import config from '@payload-config';

export const createSellerAction = actionClient
  .schema(z.object({ username: z.string().min(1), password: z.string().min(6) }))
  .action(async ({ parsedInput }) => {
    const payload = await getPayload({ config });
    const { user } = await payload.auth({ headers: await headers() });
    if (!user) throw new Error('No autenticado');
    const ownerId = getOwnerIdForUser(user as User);
    if (!ownerId) throw new Error('Owner no encontrado');
    const seller = await payload.create({
      collection: 'users',
      data: {
        username: parsedInput.username,
        password: parsedInput.password,
        role: 'seller',
        owner: ownerId,
      },
    });
    revalidateTag(`settings-${ownerId}`);
    return { id: seller.id };
  });

export const deleteSellerAction = actionClient.schema(z.object({ id: z.number() })).action(async ({ parsedInput }) => {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await headers() });
  if (!user) throw new Error('No autenticado');
  const ownerId = getOwnerIdForUser(user as User);
  if (!ownerId) throw new Error('Owner no encontrado');
  const seller = await payload.findByID({ collection: 'users', id: parsedInput.id, depth: 0 });
  const sellerOwnerId = typeof seller.owner === 'number' ? seller.owner : seller.owner?.id;
  if (sellerOwnerId !== ownerId) throw new Error('No autorizado');
  await payload.delete({ collection: 'users', id: parsedInput.id });
  revalidateTag(`settings-${ownerId}`);
  return { success: true };
});
