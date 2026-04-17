'use server';

import { getPayload } from 'payload';
import { z } from 'zod';

import { incrementCounter } from '@/app/services/counters';
import { getPriceConfig, deriveAvailableOptions } from '@/app/services/prices';
import { getOwnerIdForUser } from '@/lib/access';
import { actionClient } from '@/lib/safe-action-client';
import type { User } from '@/payload-types';

import config from '@payload-config';

export const getPriceConfigAction = actionClient.schema(z.object({})).action(async () => {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: new Headers() });
  if (!user) throw new Error('No autenticado');
  const ownerId = getOwnerIdForUser(user as User);
  if (!ownerId) throw new Error('Owner no encontrado');
  const priceConfig = await getPriceConfig(ownerId);
  const options = deriveAvailableOptions(priceConfig);
  return { config: priceConfig, options };
});

export const incrementSaleAction = actionClient.schema(z.object({})).action(async () => {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: new Headers() });
  if (!user) throw new Error('No autenticado');
  const ownerId = getOwnerIdForUser(user as User);
  if (!ownerId) throw new Error('Owner no encontrado');
  const count = await incrementCounter(ownerId, 'sales');
  return { count };
});

export const incrementBudgetAction = actionClient.schema(z.object({})).action(async () => {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: new Headers() });
  if (!user) throw new Error('No autenticado');
  const ownerId = getOwnerIdForUser(user as User);
  if (!ownerId) throw new Error('Owner no encontrado');
  const count = await incrementCounter(ownerId, 'budgets');
  return { count };
});
