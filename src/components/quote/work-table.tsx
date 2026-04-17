'use client';

import { Edit2, FileText, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
  return `${params.pages} pág. ${params.size} ${params.weight} ${format} ${side}${binding}`;
}

interface WorkTableProps {
  items: WorkItem[];
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

export function WorkTable({ items, onDelete, onEdit }: WorkTableProps) {
  if (items.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-[0px_20px_40px_rgba(25,28,29,0.06)] flex flex-col items-center justify-center py-20 gap-4">
        <FileText className="size-16 text-gray-200" />
        <p className="text-gray-400 text-sm font-medium">Agregá trabajos para comenzar</p>
      </div>
    );
  }

  const grandTotal = items.reduce((acc, item) => acc + item.params.totalPrice, 0);

  return (
    <div className="bg-white rounded-xl shadow-[0px_20px_40px_rgba(25,28,29,0.06)] overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-0 bg-gray-50">
            <TableHead className="w-8 text-xs">#</TableHead>
            <TableHead className="text-xs">Descripción</TableHead>
            <TableHead className="text-right text-xs">Costo</TableHead>
            <TableHead className="text-right text-xs">Precio</TableHead>
            <TableHead className="w-20 text-xs"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={item.id} className="border-0">
              <TableCell className="text-gray-400 text-xs">{index + 1}</TableCell>
              <TableCell>
                <p className="text-sm text-gray-800">{buildDescription(item.params)}</p>
                {item.params.remarks && <p className="text-xs text-gray-400 mt-0.5">{item.params.remarks}</p>}
              </TableCell>
              <TableCell className="text-right text-sm text-gray-500">
                {formatPrice(item.params.printingCost)}
              </TableCell>
              <TableCell className="text-right text-sm font-medium text-gray-900">
                {formatPrice(item.params.totalPrice)}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1 justify-end">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onEdit(item.id)}
                    className="text-gray-400 hover:text-indigo-600"
                  >
                    <Edit2 />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onDelete(item.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <tfoot>
          <tr className="border-t bg-gray-50">
            <td colSpan={3} className="px-4 py-3 text-sm font-semibold text-gray-700">
              Total
            </td>
            <td className="px-4 py-3 text-right text-sm font-bold text-gray-900">{formatPrice(grandTotal)}</td>
            <td />
          </tr>
        </tfoot>
      </Table>
    </div>
  );
}
