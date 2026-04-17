import type { CollectionConfig, Where } from 'payload';

import { getUserRole } from '@/lib/access';
import {
  DEFAULT_PAPER_PRICES,
  DEFAULT_INK_PRICES,
  DEFAULT_PROFIT_MARGINS,
  DEFAULT_BINDING_PRICES,
} from '@/lib/seed/default-prices';

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'username',
  },
  auth: {
    loginWithUsername: {
      allowEmailLogin: false,
      requireEmail: false,
    },
    tokenExpiration: 60 * 60 * 24 * 30,
  },
  access: {
    read: ({ req }) => {
      const user = req.user;
      if (!user) return false;
      const role = getUserRole(user);
      if (role === 'admin') return true;
      if (role === 'owner') {
        const selfClause: Where = { id: { equals: user.id } };
        const ownerClause: Where = { 'owner.value': { equals: user.id } };
        const result: Where = { or: [selfClause, ownerClause] };
        return result;
      }
      const result: Where = { id: { equals: user.id } };
      return result;
    },
    create: ({ req }) => {
      const user = req.user;
      if (!user) return true;
      const role = getUserRole(user);
      return role === 'admin' || role === 'owner';
    },
    update: ({ req }) => {
      const user = req.user;
      if (!user) return false;
      const role = getUserRole(user);
      if (role === 'admin') return true;
      if (role === 'owner') {
        const selfClause: Where = { id: { equals: user.id } };
        const ownerClause: Where = { 'owner.value': { equals: user.id } };
        const result: Where = { or: [selfClause, ownerClause] };
        return result;
      }
      const updateResult: Where = { id: { equals: user.id } };
      return updateResult;
    },
    delete: ({ req }) => {
      const user = req.user;
      if (!user) return false;
      const role = getUserRole(user);
      if (role === 'admin') return true;
      if (role === 'owner') {
        return { owner: { equals: user.id } };
      }
      return false;
    },
  },
  hooks: {
    beforeChange: [
      ({ data, req }) => {
        const creator = req.user;
        if (!creator) return data;
        const creatorRole = getUserRole(creator);
        if (creatorRole === 'owner' && data.role && data.role !== 'seller') {
          throw new Error('Owners can only create seller users');
        }
        return data;
      },
    ],
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation !== 'create' || doc.role !== 'owner') return;

        const ownerId = doc.id as number;

        for (const item of DEFAULT_PAPER_PRICES) {
          await req.payload.create({
            collection: 'paper-prices',
            data: { ...item, owner: ownerId },
            req,
          });
        }

        for (const item of DEFAULT_INK_PRICES) {
          await req.payload.create({
            collection: 'ink-prices',
            data: { ...item, owner: ownerId },
            req,
          });
        }

        for (const item of DEFAULT_PROFIT_MARGINS) {
          await req.payload.create({
            collection: 'profit-margins',
            data: { ...item, owner: ownerId },
            req,
          });
        }

        for (const item of DEFAULT_BINDING_PRICES) {
          await req.payload.create({
            collection: 'binding-prices',
            data: { ...item, owner: ownerId },
            req,
          });
        }
      },
    ],
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'seller',
      saveToJWT: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Owner', value: 'owner' },
        { label: 'Seller', value: 'seller' },
      ],
    },
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'users',
      saveToJWT: true,
      admin: {
        condition: (data) => data.role === 'seller',
      },
    },
    {
      name: 'localName',
      type: 'text',
      admin: {
        condition: (data) => data.role === 'owner',
      },
    },
    {
      name: 'localPhone',
      type: 'text',
      admin: {
        condition: (data) => data.role === 'owner',
      },
    },
    {
      name: 'localAddress',
      type: 'text',
      admin: {
        condition: (data) => data.role === 'owner',
      },
    },
    {
      name: 'email',
      type: 'email',
      admin: {
        hidden: true,
      },
    },
  ],
};
