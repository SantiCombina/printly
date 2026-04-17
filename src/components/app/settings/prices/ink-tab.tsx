'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { createInkPriceAction, deleteInkPriceAction } from '@/app/(frontend)/app/settings/prices/actions';
import { DeleteButton } from '@/components/app/settings/prices/delete-button';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface InkPriceRow {
  id: number;
  format: string;
  percentage: string | null;
  price: number;
}

const inkSchema = z.object({
  format: z.string().min(1, 'Requerido'),
  percentage: z.string().optional(),
  price: z.number().positive('Debe ser positivo'),
});

type InkForm = z.infer<typeof inkSchema>;

export function InkTab({ rows }: { rows: InkPriceRow[] }) {
  const [open, setOpen] = useState(false);
  const [list, setList] = useState(rows);

  const form = useForm<InkForm>({
    resolver: zodResolver(inkSchema),
    defaultValues: { format: '', percentage: '', price: 0 },
  });

  const { executeAsync: create, isExecuting: isCreating } = useAction(createInkPriceAction);
  const { executeAsync: remove, isExecuting: isDeleting } = useAction(deleteInkPriceAction);

  const handleCreate = form.handleSubmit(async (data: InkForm) => {
    const result = await create({ format: data.format, percentage: data.percentage ?? null, price: data.price });
    if (result?.data) {
      setList((prev) => [
        ...prev,
        { id: result.data.id, format: data.format, percentage: data.percentage ?? null, price: data.price },
      ]);
      toast.success('Precio creado');
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
            <Button size="sm" className="rounded-full gap-1">
              <PlusIcon /> Agregar
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nuevo precio de tinta</DialogTitle>
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
                  name="percentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Porcentaje (solo color)</FormLabel>
                      <FormControl>
                        <Input placeholder="100%" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Precio</FormLabel>
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
                  <Button type="submit" disabled={isCreating}>
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
            <TableHead>Porcentaje</TableHead>
            <TableHead className="text-right">Precio</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {list.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-gray-400">
                Sin registros
              </TableCell>
            </TableRow>
          )}
          {list.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.format}</TableCell>
              <TableCell>{row.percentage ?? '-'}</TableCell>
              <TableCell className="text-right">{row.price}</TableCell>
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
