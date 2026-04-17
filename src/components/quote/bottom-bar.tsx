'use client';

import { Button } from '@/components/ui/button';

const formatPrice = (amount: number) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amount);

interface BottomBarProps {
  total: number;
  onSale: () => void;
  onBudget: () => void;
  isLoading: boolean;
  isEmpty: boolean;
}

export function BottomBar({ total, onSale, onBudget, isLoading, isEmpty }: BottomBarProps) {
  const disabled = isEmpty || isLoading;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white shadow-[0_-4px_20px_rgba(25,28,29,0.06)]">
      <div className="container-custom py-4 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs text-gray-400 font-medium">Total</span>
          <span className="text-2xl font-bold text-gray-900">{formatPrice(total)}</span>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={onSale}
            disabled={disabled}
            className="rounded-full bg-emerald-500 hover:bg-emerald-600 text-white px-6 disabled:opacity-50"
          >
            Registrar Venta
          </Button>
          <Button
            onClick={onBudget}
            disabled={disabled}
            className="rounded-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white px-6 disabled:opacity-50"
          >
            Generar Presupuesto
          </Button>
        </div>
      </div>
    </div>
  );
}
