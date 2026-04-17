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
    <Button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wide transition-all',
        active ? 'text-white shadow-sm' : 'text-[#464555] hover:bg-[#d9dadb]',
      )}
      style={active ? { background: 'linear-gradient(135deg, #3525cd 0%, #4F46E5 100%)' } : { background: '#e7e8e9' }}
    >
      {value}
    </Button>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#9ca3af' }}>
      {children}
    </p>
  );
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
    <div
      className="bg-white rounded-2xl p-8 flex flex-col gap-6"
      style={{ boxShadow: '0px 20px 40px rgba(25,28,29,0.06)' }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight" style={{ color: '#191c1d' }}>
            Nuevo trabajo
          </h2>
        </div>
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl" style={{ background: 'rgba(79,70,229,0.08)' }}>
          <span className="text-xs font-bold tracking-widest" style={{ color: '#4F46E5' }}>
            SUBTOTAL
          </span>
          <span className="text-2xl font-black" style={{ color: '#3525cd' }}>
            {formatPrice(calculation.totalPrice)}
          </span>
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
                        className="text-4xl font-black h-16 text-center w-36 border-none rounded-xl"
                        style={{ background: '#f3f4f5', color: '#191c1d' }}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 1)}
                      />
                      <Button
                        type="submit"
                        className="h-14 px-8 rounded-full text-sm font-bold text-white transition-opacity hover:opacity-90 flex items-center gap-2 shadow-md"
                        style={{ background: 'linear-gradient(135deg, #3525cd 0%, #4F46E5 100%)' }}
                      >
                        + Agregar
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={handleClear}
                        className="h-14 w-14 rounded-full shrink-0"
                        style={{ background: '#e7e8e9', color: '#464555' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#d9dadb';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#e7e8e9';
                        }}
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-8">
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

          <div className="grid grid-cols-2 gap-8">
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
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2.5">
                <Checkbox
                  id="binding-toggle"
                  checked={hasBinding}
                  onCheckedChange={(checked) => {
                    form.setValue('bindingQuantity', checked ? 1 : 0);
                  }}
                />
                <Label
                  htmlFor="binding-toggle"
                  className="cursor-pointer text-sm font-medium"
                  style={{ color: '#191c1d' }}
                >
                  Incluir anillado
                </Label>
              </div>
              {hasBinding && (
                <FormField
                  control={form.control}
                  name="bindingQuantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-widest" style={{ color: '#9ca3af' }}>
                        Cantidad de anillados
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          className="w-28 border-none rounded-xl"
                          style={{ background: '#f3f4f5' }}
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
                  <FormLabel className="text-xs font-bold uppercase tracking-widest" style={{ color: '#9ca3af' }}>
                    Adicional ($)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      className="border-none rounded-xl"
                      style={{ background: '#f3f4f5' }}
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
                  <FormLabel className="text-xs font-bold uppercase tracking-widest" style={{ color: '#9ca3af' }}>
                    Observaciones
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Opcional..."
                      className="border-none rounded-xl"
                      style={{ background: '#f3f4f5' }}
                      {...field}
                      value={field.value ?? ''}
                    />
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
