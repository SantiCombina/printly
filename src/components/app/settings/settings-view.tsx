'use client';

import { useState } from 'react';

import { PricesClient } from '@/components/app/settings/prices/prices-client';
import { SellersClient } from '@/components/app/settings/sellers/sellers-client';
import { SettingsNav } from '@/components/app/settings/settings-nav';

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

interface SellerRow {
  id: number;
  username: string;
  createdAt: string;
}

interface SettingsViewProps {
  paperPrices: PaperPriceRow[];
  inkPrices: InkPriceRow[];
  margins: MarginRow[];
  bindingPrices: BindingPriceRow[];
  sellers: SellerRow[];
}

export function SettingsView({ paperPrices, inkPrices, margins, bindingPrices, sellers }: SettingsViewProps) {
  const [section, setSection] = useState<'prices' | 'sellers'>('prices');

  return (
    <div className="flex gap-6 items-start">
      <SettingsNav activeSection={section} onSectionChange={setSection} />
      <main className="flex-1 min-w-0">
        {section === 'prices' ? (
          <PricesClient paperPrices={paperPrices} inkPrices={inkPrices} margins={margins} bindingPrices={bindingPrices} />
        ) : (
          <SellersClient sellers={sellers} />
        )}
      </main>
    </div>
  );
}
