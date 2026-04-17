'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon, Trash2 } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { createSellerAction, deleteSellerAction } from '@/app/(frontend)/app/settings/sellers/actions';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface SellerRow {
  id: number;
  username: string;
  createdAt: string;
}

const sellerSchema = z.object({
  username: z.string().min(1, 'Requerido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

export function SellersClient({ sellers: initial }: { sellers: SellerRow[] }) {
  const [open, setOpen] = useState(false);
  const [list, setList] = useState(initial);

  const form = useForm<z.infer<typeof sellerSchema>>({
    resolver: zodResolver(sellerSchema),
    defaultValues: { username: '', password: '' },
  });

  const { executeAsync: create, isExecuting: isCreating } = useAction(createSellerAction);
  const { executeAsync: remove, isExecuting: isDeleting } = useAction(deleteSellerAction);

  const handleCreate = form.handleSubmit(async (data) => {
    const result = await create(data);
    if (result?.data) {
      setList((prev) => [
        ...prev,
        { id: result.data.id, username: data.username, createdAt: new Date().toISOString() },
      ]);
      toast.success('Vendedor creado');
      form.reset();
      setOpen(false);
    } else {
      toast.error('Error al crear vendedor');
    }
  });

  const handleDelete = async (id: number) => {
    const result = await remove({ id });
    if (result?.data) {
      setList((prev) => prev.filter((s) => s.id !== id));
      toast.success('Vendedor eliminado');
    } else {
      toast.error('Error al eliminar');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-[0px_20px_40px_rgba(25,28,29,0.06)] p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-semibold text-gray-800">Vendedores</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="rounded-full gap-1">
              <PlusIcon /> Agregar vendedor
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nuevo vendedor</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={handleCreate} className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Usuario</FormLabel>
                      <FormControl>
                        <Input placeholder="nombre.apellido" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contraseña</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit" disabled={isCreating}>
                    Crear vendedor
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
            <TableHead>Usuario</TableHead>
            <TableHead>Fecha de creación</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {list.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-gray-400">
                No hay vendedores
              </TableCell>
            </TableRow>
          )}
          {list.map((seller) => (
            <TableRow key={seller.id}>
              <TableCell className="font-medium">{seller.username}</TableCell>
              <TableCell className="text-gray-400 text-sm">
                {new Date(seller.createdAt).toLocaleDateString('es-AR')}
              </TableCell>
              <TableCell>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon-sm" className="text-gray-400 hover:text-red-500">
                      <Trash2 />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Eliminar vendedor?</AlertDialogTitle>
                      <AlertDialogDescription>
                        El usuario <strong>{seller.username}</strong> no podrá iniciar sesión. Esta acción no se puede
                        deshacer.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(seller.id)}
                        disabled={isDeleting}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Eliminar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
