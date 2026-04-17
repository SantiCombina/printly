'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { createProfitMarginAction, deleteProfitMarginAction } from '@/app/(frontend)/app/settings/prices/actions';
import { DeleteButton } from '@/components/app/settings/prices/delete-button';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface MarginRow {
  id: number;
  format: string;
  quantityRange: string;
  margin: number;
}

const marginSchema = z.object({
  format: z.string().min(1, 'Requerido'),
  quantityRange: z.string().min(1, 'Requerido'),
  margin: z.number().positive('Debe ser positivo'),
});

type MarginForm = z.infer<typeof marginSchema>;

export function MarginsTab({ rows }: { rows: MarginRow[] }) {
  const [open, setOpen] = useState(false);
  const [list, setList] = useState(rows);

  const form = useForm<MarginForm>({
    resolver: zodResolver(marginSchema),
    defaultValues: { format: '', quantityRange: '', margin: 0 },
  });

  const { executeAsync: create, isExecuting: isCreating } = useAction(createProfitMarginAction);
  const { executeAsync: remove, isExecuting: isDeleting } = useAction(deleteProfitMarginAction);

  const handleCreate = form.handleSubmit(async (data: MarginForm) => {
    const result = await create(data);
    if (result?.data) {
      setList((prev) => [...prev, { id: result.data.id, ...data }]);
      toast.success('Margen creado');
      form.reset();
      setOpen(false);
    } else {
      toast.error('Error al crear');
    }
  });

  const handleDelete = async (id: number) => {
    const result = await remove({ id });
    if (result?.data) {
      setList((prev) => prev.filter((r) => r.id !== id));
      toast.success('Eliminado');
    } else {
      toast.error('Error al eliminar');
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              type="button"
              className="flex items-center gap-1.5 px-5 h-9 rounded-full text-sm font-bold text-white transition-opacity hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #3525cd 0%, #4F46E5 100%)' }}
            >
              <PlusIcon className="size-3.5" /> Agregar
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nuevo margen de ganancia</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={handleCreate} className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="format"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Formato</FormLabel>
                      <FormControl>
                        <Input placeholder="blancoNegro" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="quantityRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rango de cantidad</FormLabel>
                      <FormControl>
                        <Input placeholder="1-50" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="margin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Margen (multiplicador)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          value={field.value}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit" disabled={isCreating} className="rounded-full">
                    Guardar
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Formato</TableHead>
            <TableHead>Rango</TableHead>
            <TableHead className="text-right">Margen</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {list.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="py-10 text-center text-sm text-gray-400">
                Sin registros
              </TableCell>
            </TableRow>
          )}
          {list.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.format}</TableCell>
              <TableCell>{row.quantityRange}</TableCell>
              <TableCell className="text-right">{row.margin}</TableCell>
              <TableCell>
                <DeleteButton onDelete={() => handleDelete(row.id)} isDeleting={isDeleting} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
