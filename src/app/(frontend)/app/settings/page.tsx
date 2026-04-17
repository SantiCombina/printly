import { SettingsView } from '@/components/app/settings/settings-view';
import { getSettingsData } from '@/app/services/settings';
import { getAuthUser } from '@/lib/auth-cache';
import { getOwnerIdForUser } from '@/lib/access';
import type { User } from '@/payload-types';

export default async function SettingsPage() {
  const user = await getAuthUser();

  if (!user) return null;

  const ownerId = getOwnerIdForUser(user as User);
  if (!ownerId) return null;

  const data = await getSettingsData(ownerId);

  return <SettingsView {...data} />;
}
