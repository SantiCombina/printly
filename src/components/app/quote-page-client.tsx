'use client';

import { useAction } from 'next-safe-action/hooks';
import { useState } from 'react';
import { toast } from 'sonner';

import { incrementSaleAction, incrementBudgetAction } from '@/app/(frontend)/app/actions';
import type { AvailableOptions, PriceConfig } from '@/app/services/prices';
import { BottomBar } from '@/components/quote/bottom-bar';
import { Configurator } from '@/components/quote/configurator';
import { WorkTable } from '@/components/quote/work-table';
import type { PrintParams } from '@/lib/schemas/print-schema';

interface WorkItem {
  id: string;
  params: PrintParams & { printingCost: number; bindingPrice: number; totalPrice: number };
}

interface QuotePageClientProps {
  priceConfig: PriceConfig;
  availableOptions: AvailableOptions;
}

export function QuotePageClient({ priceConfig, availableOptions }: QuotePageClientProps) {
  const [items, setItems] = useState<WorkItem[]>([]);

  const { executeAsync: execSale, isExecuting: isSelling } = useAction(incrementSaleAction);
  const { executeAsync: execBudget, isExecuting: isBudgeting } = useAction(incrementBudgetAction);

  const isLoading = isSelling || isBudgeting;

  const handleAdd = (params: PrintParams & { printingCost: number; bindingPrice: number; totalPrice: number }) => {
    setItems((prev) => [...prev, { id: crypto.randomUUID(), params }]);
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleEdit = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    toast.info('Trabajo removido para edición. Reconfiguralo y agregalo nuevamente.');
  };

  const handleSale = async () => {
    const result = await execSale({});
    if (result?.data) {
      toast.success('Venta registrada correctamente');
      setItems([]);
    } else {
      toast.error('Error al registrar la venta');
    }
  };

  const handleBudget = async () => {
    const result = await execBudget({});
    if (result?.data) {
      toast.success('Presupuesto generado correctamente');
      setItems([]);
    } else {
      toast.error('Error al generar el presupuesto');
    }
  };

  const total = items.reduce((acc, item) => acc + item.params.totalPrice, 0);

  return (
    <>
      <div className="grid grid-cols-12 gap-6 items-start">
        <div className="col-span-12 lg:col-span-7">
          <Configurator priceConfig={priceConfig} availableOptions={availableOptions} onAdd={handleAdd} />
        </div>
        <div className="col-span-12 lg:col-span-5 sticky top-20">
          <WorkTable items={items} onDelete={handleDelete} onEdit={handleEdit} />
        </div>
      </div>
      <BottomBar
        total={total}
        onSale={handleSale}
        onBudget={handleBudget}
        isLoading={isLoading}
        isEmpty={items.length === 0}
      />
    </>
  );
}
