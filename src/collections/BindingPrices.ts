import type { CollectionConfig } from 'payload';

import { tenantRead, tenantUpdate, adminOrOwner, getUserRole } from '@/lib/access';

export const BindingPrices: CollectionConfig = {
  slug: 'binding-prices',
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
        if (data.quantityRange) {
          data.displayName = `Anillado ${data.quantityRange}`;
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
      name: 'quantityRange',
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
