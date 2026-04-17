import { cache } from 'react';
import { headers } from 'next/headers';
import { getPayload } from 'payload';

import config from '@payload-config';

export const getAuthUser = cache(async () => {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await headers() });
  return user;
});
