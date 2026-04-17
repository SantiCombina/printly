import type { Access } from 'payload';

import type { User } from '@/payload-types';

export function getUserRole(user: User): 'admin' | 'owner' | 'seller' | null {
  if (!user) return null;
  return user.role ?? null;
}

export function getOwnerIdForUser(user: User): number | null {
  const role = getUserRole(user);
  if (role === 'admin' || role === 'owner') return user.id;
  if (role === 'seller') {
    const owner = user.owner;
    if (typeof owner === 'number') return owner;
    if (typeof owner === 'object' && owner !== null) return owner.id;
  }
  return null;
}

export const isAdmin: Access = ({ req }) => {
  const user = req.user as User | null;
  if (!user) return false;
  return getUserRole(user) === 'admin';
};

export const tenantRead: Access = ({ req }) => {
  const user = req.user as User | null;
  if (!user) return false;
  const role = getUserRole(user);
  if (role === 'admin') return true;
  if (role === 'owner') return { owner: { equals: user.id } };
  if (role === 'seller') {
    const owner = user.owner;
    const ownerId = typeof owner === 'number' ? owner : owner?.id;
    if (!ownerId) return false;
    return { owner: { equals: ownerId } };
  }
  return false;
};

export const tenantUpdate: Access = ({ req }) => {
  const user = req.user as User | null;
  if (!user) return false;
  const role = getUserRole(user);
  if (role === 'admin') return true;
  if (role === 'owner') return { owner: { equals: user.id } };
  return false;
};

export const adminOrOwner: Access = ({ req }) => {
  const user = req.user as User | null;
  if (!user) return false;
  const role = getUserRole(user);
  return role === 'admin' || role === 'owner';
};
