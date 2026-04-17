import { getPayload } from 'payload';

import config from '@payload-config';

function getTodayDate(): string {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = String(now.getFullYear());
  return `${day}-${month}-${year}`;
}

export async function incrementCounter(ownerId: number, type: 'sales' | 'budgets'): Promise<number> {
  const payload = await getPayload({ config });
  const today = getTodayDate();

  const existing = await payload.find({
    collection: 'counters',
    where: {
      and: [{ owner: { equals: ownerId } }, { date: { equals: today } }],
    },
    limit: 1,
  });

  if (existing.docs.length === 0) {
    const salesCount = type === 'sales' ? 1 : 0;
    const budgetsCount = type === 'budgets' ? 1 : 0;

    await payload.create({
      collection: 'counters',
      data: {
        owner: ownerId,
        date: today,
        salesCount,
        budgetsCount,
      },
    });

    return type === 'sales' ? salesCount : budgetsCount;
  }

  const counter = existing.docs[0];
  const currentSales = counter.salesCount ?? 0;
  const currentBudgets = counter.budgetsCount ?? 0;

  const newSales = type === 'sales' ? currentSales + 1 : currentSales;
  const newBudgets = type === 'budgets' ? currentBudgets + 1 : currentBudgets;

  await payload.update({
    collection: 'counters',
    id: counter.id,
    data: {
      salesCount: newSales,
      budgetsCount: newBudgets,
    },
  });

  return type === 'sales' ? newSales : newBudgets;
}
