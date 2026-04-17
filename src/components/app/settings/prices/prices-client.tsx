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

const triggerClass =
  'rounded-none border-b-2 border-transparent data-[state=active]:border-[#3525cd] data-[state=active]:text-[#3525cd] data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 pb-3 pt-0 text-sm font-semibold text-[#777587] hover:text-[#191c1d] transition-colors';

export function PricesClient({ paperPrices, inkPrices, margins, bindingPrices }: PricesClientProps) {
  return (
    <div className="bg-white rounded-2xl" style={{ boxShadow: '0px 20px 40px rgba(25,28,29,0.06)' }}>
      <Tabs defaultValue="paper">
        <div className="px-6 pt-6" style={{ borderBottom: '1px solid rgba(199,196,216,0.2)' }}>
          <div className="flex items-center justify-between mb-4">
            <div />
          </div>
          <TabsList className="w-full justify-start rounded-none bg-transparent border-b-0 p-0 gap-0 -mb-px h-auto">
            <TabsTrigger value="paper" className={triggerClass}>
              Papel
            </TabsTrigger>
            <TabsTrigger value="ink" className={triggerClass}>
              Tinta
            </TabsTrigger>
            <TabsTrigger value="margins" className={triggerClass}>
              Márgenes
            </TabsTrigger>
            <TabsTrigger value="binding" className={triggerClass}>
              Anillado
            </TabsTrigger>
          </TabsList>
        </div>
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
  );
}
