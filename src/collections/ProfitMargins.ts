import type { CollectionConfig } from 'payload';

import { tenantRead, tenantUpdate, adminOrOwner, getUserRole } from '@/lib/access';

export const ProfitMargins: CollectionConfig = {
  slug: 'profit-margins',
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
        if (data.format && data.quantityRange) {
          data.displayName = `${data.format} - ${data.quantityRange}`;
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
      name: 'quantityRange',
      type: 'text',
      required: true,
    },
    {
      name: 'margin',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Multiplicador de precio (ej: 1.5 = 50% de margen)',
      },
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
