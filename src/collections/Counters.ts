import type { CollectionConfig } from 'payload';

import { isAdmin, getUserRole } from '@/lib/access';

export const Counters: CollectionConfig = {
  slug: 'counters',
  admin: {
    useAsTitle: 'date',
  },
  access: {
    read: () => true,
    create: ({ req }) => {
      if (!req.user) return true;
      return getUserRole(req.user) === 'admin';
    },
    update: ({ req }) => {
      if (!req.user) return true;
      return getUserRole(req.user) === 'admin';
    },
    delete: isAdmin,
  },
  fields: [
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'date',
      type: 'text',
      required: true,
      admin: {
        readOnly: true,
        description: 'Formato DD-MM-YYYY',
      },
    },
    {
      name: 'salesCount',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'budgetsCount',
      type: 'number',
      defaultValue: 0,
    },
  ],
};
