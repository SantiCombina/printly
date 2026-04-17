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
    <div className="bg-white rounded-xl shadow-[0px_20px_40px_rgba(25,28,29,0.06)] p-6">
      <Tabs defaultValue="paper">
        <TabsList className="mb-6">
          <TabsTrigger value="paper">Papel</TabsTrigger>
          <TabsTrigger value="ink">Tinta</TabsTrigger>
          <TabsTrigger value="margins">Márgenes</TabsTrigger>
          <TabsTrigger value="binding">Anillado</TabsTrigger>
        </TabsList>
        <TabsContent value="paper">
          <PaperTab rows={paperPrices} />
        </TabsContent>
        <TabsContent value="ink">
          <InkTab rows={inkPrices} />
        </TabsContent>
        <TabsContent value="margins">
          <MarginsTab rows={margins} />
        </TabsContent>
        <TabsContent value="binding">
          <BindingTab rows={bindingPrices} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
