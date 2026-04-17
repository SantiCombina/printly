'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { RotateCcw } from 'lucide-react';
import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

import type { AvailableOptions, PriceConfig } from '@/app/services/prices';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usePriceCalculation } from '@/lib/hooks/use-price-calculation';
import { printSchema, type PrintParams } from '@/lib/schemas/print-schema';
import { cn } from '@/lib/utils';

type PrintInput = z.input<typeof printSchema>;

const formatPrice = (amount: number) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amount);

interface WorkPrices {
  printingCost: number;
  bindingPrice: number;
  totalPrice: number;
}

interface ConfiguratorProps {
  priceConfig: PriceConfig;
  availableOptions: AvailableOptions;
  onAdd: (params: PrintParams & WorkPrices) => void;
}

function PillToggle({ value, active, onClick }: { value: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full px-4 py-2 text-sm font-medium transition-colors',
        active ? 'bg-[#4F46E5] text-white' : 'bg-[#e7e8e9] text-[#191c1d] hover:bg-gray-200',
      )}
    >
      {value}
    </button>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">{children}</h3>;
}

export function Configurator({ priceConfig, availableOptions, onAdd }: ConfiguratorProps) {
  const form = useForm<PrintInput>({
    resolver: zodResolver(printSchema),
    defaultValues: {
      pages: 1,
      size: availableOptions.sizes[0] ?? '',
      weight: '',
      format: availableOptions.inkFormats[0] ?? '',
      side: 'simple',
      percentage: null,
      bindingQuantity: 0,
      additional: 0,
      remarks: '',
    },
  });

  const selectedSize = useWatch({ control: form.control, name: 'size' });
  const selectedFormat = useWatch({ control: form.control, name: 'format' });
  const bindingQuantity = useWatch({ control: form.control, name: 'bindingQuantity' }) ?? 0;
  const hasBinding = bindingQuantity > 0;

  useEffect(() => {
    const weights = availableOptions.weightsBySize[selectedSize] ?? [];
    const current = form.getValues('weight');
    if (!weights.includes(current ?? '')) {
      form.setValue('weight', weights[0] ?? '');
    }
  }, [selectedSize, availableOptions.weightsBySize, form]);

  useEffect(() => {
    if (selectedFormat !== 'color') {
      form.setValue('percentage', null);
    }
  }, [selectedFormat, form]);

  const watchedValues = useWatch({ control: form.control });
  const calculation = usePriceCalculation({
    params: watchedValues,
    config: priceConfig,
  });

  const currentWeights = availableOptions.weightsBySize[selectedSize] ?? [];
  const colorPercentages = availableOptions.percentagesByFormat['color'] ?? [];

  const handleSubmit = form.handleSubmit((data) => {
    const parsed = printSchema.parse(data);
    onAdd({
      ...parsed,
      printingCost: calculation.printingCost,
      bindingPrice: calculation.bindingPrice,
      totalPrice: calculation.totalPrice,
    });
  });

  const handleClear = () => {
    form.reset({
      pages: 1,
      size: availableOptions.sizes[0] ?? '',
      weight: availableOptions.weightsBySize[availableOptions.sizes[0] ?? '']?.[0] ?? '',
      format: availableOptions.inkFormats[0] ?? '',
      side: 'simple',
      percentage: null,
      bindingQuantity: 0,
      additional: 0,
      remarks: '',
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-[0px_20px_40px_rgba(25,28,29,0.06)] p-6 flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Cotizador Rápido</span>
          <h2 className="text-2xl font-bold text-gray-900">Nueva Configuración</h2>
        </div>
        <div className="flex items-center gap-3 bg-indigo-50 rounded-2xl px-5 py-3">
          <span className="text-xs font-bold tracking-widest text-indigo-500">SUBTOTAL TRABAJO</span>
          <span className="text-2xl font-bold text-indigo-700">{formatPrice(calculation.totalPrice)}</span>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <SectionTitle>Cantidad de páginas</SectionTitle>
            <FormField
              control={form.control}
              name="pages"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center gap-3">
                      <Input
                        type="number"
                        min={1}
                        max={9999}
                        className="text-4xl font-bold h-16 text-center w-32"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 1)}
                      />
                      <Button
                        type="submit"
                        className="rounded-full bg-[#4F46E5] hover:bg-[#4338ca] text-white px-8 h-12 text-base font-semibold"
                      >
                        + Agregar
                      </Button>
                      <button
                        type="button"
                        onClick={handleClear}
                        className="h-12 w-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors shrink-0"
                      >
                        <RotateCcw className="h-4 w-4 text-gray-500" />
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <SectionTitle>Tamaño</SectionTitle>
              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex flex-wrap gap-2">
                        {availableOptions.sizes.map((size) => (
                          <PillToggle
                            key={size}
                            value={size}
                            active={field.value === size}
                            onClick={() => field.onChange(size)}
                          />
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <SectionTitle>Tinta</SectionTitle>
              <FormField
                control={form.control}
                name="format"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex flex-wrap gap-2">
                        {availableOptions.inkFormats.map((fmt) => (
                          <PillToggle
                            key={fmt}
                            value={fmt === 'blancoNegro' ? 'B/N' : 'Color'}
                            active={field.value === fmt}
                            onClick={() => field.onChange(fmt)}
                          />
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <SectionTitle>Gramaje</SectionTitle>
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex flex-wrap gap-2">
                        {currentWeights.map((w) => (
                          <PillToggle key={w} value={w} active={field.value === w} onClick={() => field.onChange(w)} />
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <SectionTitle>Faz</SectionTitle>
              <FormField
                control={form.control}
                name="side"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex flex-wrap gap-2">
                        <PillToggle
                          value="Simple faz"
                          active={field.value === 'simple'}
                          onClick={() => field.onChange('simple')}
                        />
                        <PillToggle
                          value="Doble faz"
                          active={field.value === 'double'}
                          onClick={() => field.onChange('double')}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {selectedFormat === 'color' && colorPercentages.length > 0 && (
            <div>
              <SectionTitle>Porcentaje de color</SectionTitle>
              <FormField
                control={form.control}
                name="percentage"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex flex-wrap gap-2">
                        {colorPercentages.map((pct) => (
                          <PillToggle
                            key={pct}
                            value={pct}
                            active={field.value === pct}
                            onClick={() => field.onChange(pct)}
                          />
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          <div>
            <SectionTitle>Anillado</SectionTitle>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="binding-toggle"
                  checked={hasBinding}
                  onCheckedChange={(checked) => {
                    form.setValue('bindingQuantity', checked ? 1 : 0);
                  }}
                />
                <Label htmlFor="binding-toggle" className="cursor-pointer">
                  Incluir anillado
                </Label>
              </div>
              {hasBinding && (
                <FormField
                  control={form.control}
                  name="bindingQuantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cantidad de anillados</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          className="w-28"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="additional"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adicional ($)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="remarks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observaciones</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Opcional..." {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </div>
  );
}
