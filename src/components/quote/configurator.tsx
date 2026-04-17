'use client';

import { zodResolver } from '@hookform/resolvers/zod';
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
  return <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">{children}</h3>;
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
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Configurar trabajo</h2>
        <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-2">
          <span className="text-xs text-indigo-500 font-medium">Total</span>
          <span className="text-2xl font-bold text-indigo-600">{formatPrice(calculation.totalPrice)}</span>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <SectionTitle>Páginas</SectionTitle>
            <FormField
              control={form.control}
              name="pages"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={9999}
                      className="text-4xl font-bold h-16 text-center w-32"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 1)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <SectionTitle>Papel</SectionTitle>
            <div className="flex flex-col gap-3">
              <div>
                <Label className="text-xs text-gray-400 mb-2 block">Tamaño</Label>
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
                <Label className="text-xs text-gray-400 mb-2 block">Gramaje</Label>
                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex flex-wrap gap-2">
                          {currentWeights.map((w) => (
                            <PillToggle
                              key={w}
                              value={w}
                              active={field.value === w}
                              onClick={() => field.onChange(w)}
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
          </div>

          <div>
            <SectionTitle>Impresión</SectionTitle>
            <div className="flex flex-col gap-3">
              <div>
                <Label className="text-xs text-gray-400 mb-2 block">Formato</Label>
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

              {selectedFormat === 'color' && colorPercentages.length > 0 && (
                <div>
                  <Label className="text-xs text-gray-400 mb-2 block">Porcentaje de color</Label>
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
                <Label className="text-xs text-gray-400 mb-2 block">Faz</Label>
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
          </div>

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

          <div className="flex gap-3 pt-2">
            <Button type="submit" className="flex-1 rounded-full bg-linear-to-r from-[#3525cd] to-[#4F46E5] text-white">
              Agregar trabajo
            </Button>
            <Button type="button" variant="outline" className="rounded-full" onClick={handleClear}>
              Limpiar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
