'use client';

import { ShoppingCart, FileText } from 'lucide-react';

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
    <div
      className="fixed bottom-0 left-0 right-0 z-40"
      style={{
        background: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(24px)',
        borderTop: '1px solid rgba(199,196,216,0.15)',
        boxShadow: '0px -4px 24px rgba(25,28,29,0.06)',
      }}
    >
      <div className="container-custom py-4 flex items-center justify-between gap-6">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#3525cd' }}>
            Total presupuesto
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black" style={{ color: '#191c1d' }}>
              {formatPrice(total)}
            </span>
            {isEmpty && (
              <span className="text-xs" style={{ color: '#777587' }}>
                Sin trabajos
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            onClick={onSale}
            disabled={disabled}
            className="flex items-center gap-2 px-6 h-12 rounded-full text-sm font-bold text-white transition-opacity disabled:opacity-40 shadow-lg"
            style={{
              background: '#10B981',
              boxShadow: disabled ? 'none' : '0px 8px 20px rgba(16,185,129,0.25)',
            }}
          >
            <ShoppingCart className="size-4" />
            Registrar Venta
          </Button>
          <Button
            type="button"
            onClick={onBudget}
            disabled={disabled}
            className="flex items-center gap-2 px-6 h-12 rounded-full text-sm font-bold text-white transition-opacity disabled:opacity-40"
            style={{
              background: disabled ? '#e7e8e9' : 'linear-gradient(135deg, #3525cd 0%, #4F46E5 100%)',
              color: disabled ? '#464555' : '#ffffff',
              boxShadow: disabled ? 'none' : '0px 8px 20px rgba(53,37,205,0.25)',
            }}
          >
            <FileText className="size-4" />
            Generar Presupuesto
          </Button>
        </div>
      </div>
    </div>
  );
}
