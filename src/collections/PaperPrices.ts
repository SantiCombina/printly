import type { CollectionConfig } from 'payload';

import { adminOrOwner, getUserRole, tenantRead, tenantUpdate } from '@/lib/access';

export const PaperPrices: CollectionConfig = {
  slug: 'paper-prices',
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
        if (data && data.size && data.weight) {
          data.displayName = `${data.size} - ${data.weight}`;
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
      name: 'size',
      type: 'text',
      required: true,
    },
    {
      name: 'weight',
      type: 'text',
      required: true,
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
