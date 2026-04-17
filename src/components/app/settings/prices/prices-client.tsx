'use client';

import { BindingTab } from '@/components/app/settings/prices/binding-tab';
import { InkTab } from '@/components/app/settings/prices/ink-tab';
import { MarginsTab } from '@/components/app/settings/prices/margins-tab';
import { PaperTab } from '@/components/app/settings/prices/paper-tab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PaperPriceRow {
  id: number;
  size: string;
  weight: string;
  price: number;
}
interface InkPriceRow {
  id: number;
  format: string;
  percentage: string | null;
  price: number;
}
interface MarginRow {
  id: number;
  format: string;
  quantityRange: string;
  margin: number;
}
interface BindingPriceRow {
  id: number;
  quantityRange: string;
  price: number;
}

interface PricesClientProps {
  paperPrices: PaperPriceRow[];
  inkPrices: InkPriceRow[];
  margins: MarginRow[];
  bindingPrices: BindingPriceRow[];
}

export function PricesClient({ paperPrices, inkPrices, margins, bindingPrices }: PricesClientProps) {
  return (
    <div className="bg-white rounded-xl shadow-[0px_20px_40px_rgba(25,28,29,0.06)]">
      <div className="px-6 pt-6 pb-0 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Precios</h2>
        <Tabs defaultValue="paper">
          <TabsList className="w-full justify-start rounded-none bg-transparent border-b-0 p-0 gap-0 -mb-px">
            <TabsTrigger
              value="paper"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-700 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 pb-3 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
            >
              Papel
            </TabsTrigger>
            <TabsTrigger
              value="ink"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-700 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 pb-3 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
            >
              Tinta
            </TabsTrigger>
            <TabsTrigger
              value="margins"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-700 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 pb-3 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
            >
              Márgenes
            </TabsTrigger>
            <TabsTrigger
              value="binding"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-700 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 pb-3 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
            >
              Anillado
            </TabsTrigger>
          </TabsList>
          <div className="p-6">
            <TabsContent value="paper" className="mt-0">
              <PaperTab rows={paperPrices} />
            </TabsContent>
            <TabsContent value="ink" className="mt-0">
              <InkTab rows={inkPrices} />
            </TabsContent>
            <TabsContent value="margins" className="mt-0">
              <MarginsTab rows={margins} />
            </TabsContent>
            <TabsContent value="binding" className="mt-0">
              <BindingTab rows={bindingPrices} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
