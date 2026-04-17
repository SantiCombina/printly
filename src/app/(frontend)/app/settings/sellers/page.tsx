import { headers } from 'next/headers';
import { getPayload } from 'payload';

import { SellersClient } from '@/components/app/settings/sellers/sellers-client';
import { getOwnerIdForUser } from '@/lib/access';
import type { User } from '@/payload-types';

import config from '@payload-config';

export default async function SellersPage() {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await headers() });

  if (!user) return null;

  const ownerId = getOwnerIdForUser(user as User);
  if (!ownerId) return null;

  const result = await payload.find({
    collection: 'users',
    where: {
      and: [{ owner: { equals: ownerId } }, { role: { equals: 'seller' } }],
    },
    limit: 1000,
  });

  const sellers = result.docs.map((s) => ({
    id: s.id,
    username: s.username ?? '',
    createdAt: s.createdAt,
  }));

  return <SellersClient sellers={sellers} />;
}
