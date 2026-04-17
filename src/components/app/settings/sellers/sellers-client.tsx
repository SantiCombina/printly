'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon, Trash2, Users } from 'lucide-react';
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
    <div className="bg-white rounded-2xl" style={{ boxShadow: '0px 20px 40px rgba(25,28,29,0.06)' }}>
      <div
        className="px-6 pt-6 pb-4 flex items-center justify-between"
        style={{ borderBottom: '1px solid rgba(199,196,216,0.2)' }}
      >
        <div />
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              type="button"
              className="flex items-center gap-1.5 px-5 h-9 rounded-full text-sm font-bold text-white transition-opacity hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #3525cd 0%, #4F46E5 100%)' }}
            >
              <PlusIcon className="size-3.5" />
              Agregar vendedor
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
                  <Button type="submit" disabled={isCreating} className="rounded-full">
                    Crear vendedor
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="p-6">
        {list.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="size-16 rounded-2xl flex items-center justify-center" style={{ background: '#f3f4f5' }}>
              <Users className="size-7" style={{ color: '#c7c4d8' }} />
            </div>
            <p className="text-sm font-medium" style={{ color: '#777587' }}>
              No hay vendedores registrados
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow style={{ borderBottom: '1px solid rgba(199,196,216,0.2)' }}>
                <TableHead className="text-xs font-bold uppercase tracking-widest" style={{ color: '#9ca3af' }}>
                  Usuario
                </TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-widest" style={{ color: '#9ca3af' }}>
                  Fecha de creación
                </TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map((seller) => (
                <TableRow key={seller.id} className="border-0 hover:bg-[#f8f9fa]">
                  <TableCell className="font-semibold" style={{ color: '#191c1d' }}>
                    {seller.username}
                  </TableCell>
                  <TableCell className="text-sm" style={{ color: '#777587' }}>
                    {new Date(seller.createdAt).toLocaleDateString('es-AR')}
                  </TableCell>
                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-8 rounded-full"
                          style={{ color: '#777587' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#ffdad6';
                            e.currentTarget.style.color = '#ba1a1a';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = '#777587';
                          }}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Eliminar vendedor?</AlertDialogTitle>
                          <AlertDialogDescription>
                            El usuario <strong>{seller.username}</strong> no podrá iniciar sesión. Esta acción no se
                            puede deshacer.
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
        )}
      </div>
    </div>
  );
}
