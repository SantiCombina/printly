'use client';

import { Edit2, FileText, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { PrintParams } from '@/lib/schemas/print-schema';

const formatPrice = (amount: number) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amount);

interface WorkItem {
  id: string;
  params: PrintParams & { printingCost: number; bindingPrice: number; totalPrice: number };
}

function buildDescription(params: WorkItem['params']): string {
  const side = params.side === 'double' ? 'Doble faz' : 'Simple faz';
  const format = params.format === 'blancoNegro' ? 'B/N' : `Color ${params.percentage ?? ''}`.trim();
  const binding = params.bindingQuantity > 0 ? ` + ${params.bindingQuantity} anillado(s)` : '';
  return `${params.pages} pág. · ${params.size} ${params.weight} · ${format} · ${side}${binding}`;
}

interface WorkTableProps {
  items: WorkItem[];
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

export function WorkTable({ items, onDelete, onEdit }: WorkTableProps) {
  if (items.length === 0) {
    return (
      <div
        className="bg-white rounded-2xl flex flex-col items-center justify-center py-20 gap-4"
        style={{ boxShadow: '0px 20px 40px rgba(25,28,29,0.06)' }}
      >
        <div className="size-20 rounded-2xl flex items-center justify-center" style={{ background: '#f3f4f5' }}>
          <FileText className="size-9" style={{ color: '#c7c4d8' }} />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold" style={{ color: '#191c1d' }}>
            Sin trabajos en curso
          </p>
          <p className="text-xs mt-1" style={{ color: '#777587' }}>
            Configurá un trabajo y agregalo para comenzar
          </p>
        </div>
      </div>
    );
  }

  const grandTotal = items.reduce((acc, item) => acc + item.params.totalPrice, 0);

  return (
    <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0px 20px 40px rgba(25,28,29,0.06)' }}>
      <div className="px-6 pt-6 pb-4 flex items-center justify-between">
        <h3 className="text-base font-bold tracking-tight" style={{ color: '#191c1d' }}>
          Trabajos en curso
        </h3>
        <span
          className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase"
          style={{ background: '#e2dfff', color: '#3323cc' }}
        >
          {items.length} {items.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      <div className="flex flex-col divide-y-0">
        {items.map((item, index) => (
          <div key={item.id} className="px-6 py-4 transition-colors hover:bg-[#f8f9fa] group">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div
                  className="size-7 rounded-full flex items-center justify-center text-[11px] font-black shrink-0 mt-0.5"
                  style={{ background: 'rgba(79,70,229,0.08)', color: '#3525cd' }}
                >
                  {index + 1}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-snug" style={{ color: '#191c1d' }}>
                    {buildDescription(item.params)}
                  </p>
                  {item.params.remarks && (
                    <p className="text-xs mt-0.5 italic" style={{ color: '#777587' }}>
                      {item.params.remarks}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-xs" style={{ color: '#777587' }}>
                      Costo: {formatPrice(item.params.printingCost)}
                    </span>
                    {item.params.bindingPrice > 0 && (
                      <span className="text-xs" style={{ color: '#777587' }}>
                        Anillado: {formatPrice(item.params.bindingPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <span className="text-base font-black mr-2" style={{ color: '#3525cd' }}>
                  {formatPrice(item.params.totalPrice)}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(item.id)}
                  className="size-8 rounded-full opacity-0 group-hover:opacity-100"
                  style={{ color: '#464555' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#e7e8e9';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <Edit2 className="size-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(item.id)}
                  className="size-8 rounded-full opacity-0 group-hover:opacity-100"
                  style={{ color: '#464555' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#ffdad6';
                    e.currentTarget.style.color = '#ba1a1a';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#464555';
                  }}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        className="px-6 py-4 flex items-center justify-between"
        style={{ background: '#f8f9fa', borderTop: '1px solid rgba(199,196,216,0.2)' }}
      >
        <span className="text-sm font-bold" style={{ color: '#464555' }}>
          Total acumulado
        </span>
        <span className="text-xl font-black" style={{ color: '#191c1d' }}>
          {formatPrice(grandTotal)}
        </span>
      </div>
    </div>
  );
}
