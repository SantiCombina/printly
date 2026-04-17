import type { CollectionConfig } from 'payload';

import { tenantRead, tenantUpdate, adminOrOwner, getUserRole } from '@/lib/access';

export const InkPrices: CollectionConfig = {
  slug: 'ink-prices',
  admin: {
    useAsTitle: 'displayName',
  },
  access: {
    read: tenantRead,
    create: adminOrOwner,
    update: tenantUpdate,
    delete: ({ req }) => {
      const user = req.user;
      if (!user) return false;
      const role = getUserRole(user);
      if (role === 'admin') return true;
      if (role === 'owner') return { owner: { equals: user.id } };
      return false;
    },
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data) return data;
        if (data.format === 'blancoNegro') {
          data.displayName = 'B/N';
        } else if (data.format === 'color' && data.percentage) {
          data.displayName = `Color ${data.percentage}`;
        }
        return data;
      },
    ],
  },
  fields: [
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        condition: (_, siblingData, { user }) => {
          if (!user) return false;
          return getUserRole(user) === 'admin';
        },
      },
    },
    {
      name: 'format',
      type: 'text',
      required: true,
    },
    {
      name: 'percentage',
      type: 'text',
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'displayName',
      type: 'text',
      admin: {
        hidden: true,
      },
    },
  ],
};
