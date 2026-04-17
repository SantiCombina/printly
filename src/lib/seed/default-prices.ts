export const DEFAULT_PAPER_PRICES: Array<{
  size: string;
  weight: string;
  price: number;
}> = [
  { size: 'A4', weight: '75g', price: 15 },
  { size: 'A4', weight: '80g-90g', price: 30 },
  { size: 'A4', weight: '100g-150g', price: 45 },
  { size: 'A4', weight: '160g-200g', price: 60 },
  { size: 'A4', weight: '210g-250g', price: 80 },
  { size: 'A4', weight: 'especial-epson', price: 95 },
  { size: 'Oficio', weight: '75g', price: 20 },
  { size: 'Oficio', weight: '80g-90g', price: 20 },
  { size: 'A3', weight: '75g', price: 35 },
  { size: 'A3', weight: '100g-150g', price: 90 },
  { size: 'A3', weight: '160g-200g', price: 120 },
  { size: 'A3', weight: '210g-250g', price: 160 },
  { size: 'Comercial', weight: '75g', price: 40 },
  { size: 'Comercial', weight: '80g-90g', price: 40 },
  { size: 'Adhesivo', weight: '75g', price: 150 },
  { size: 'Adhesivo', weight: '80g-90g', price: 150 },
];

export const DEFAULT_INK_PRICES: Array<{
  format: string;
  percentage?: string;
  price: number;
}> = [
  { format: 'blancoNegro', price: 15 },
  { format: 'color', percentage: '10%', price: 50 },
  { format: 'color', percentage: '50%', price: 100 },
  { format: 'color', percentage: '100%', price: 200 },
];

export const DEFAULT_PROFIT_MARGINS: Array<{
  format: string;
  quantityRange: string;
  margin: number;
}> = [
  { format: 'blancoNegro', quantityRange: '1', margin: 11 },
  { format: 'blancoNegro', quantityRange: '2', margin: 9 },
  { format: 'blancoNegro', quantityRange: '3-9', margin: 5 },
  { format: 'blancoNegro', quantityRange: '10-49', margin: 3 },
  { format: 'blancoNegro', quantityRange: '50-99', margin: 2 },
  { format: 'blancoNegro', quantityRange: '100-499', margin: 1.8 },
  { format: 'blancoNegro', quantityRange: '500', margin: 1.7 },
  { format: 'color', quantityRange: '1', margin: 4 },
  { format: 'color', quantityRange: '2', margin: 3 },
  { format: 'color', quantityRange: '3-9', margin: 2.5 },
  { format: 'color', quantityRange: '10-49', margin: 2 },
  { format: 'color', quantityRange: '50-99', margin: 1.9 },
  { format: 'color', quantityRange: '100-499', margin: 1.6 },
  { format: 'color', quantityRange: '500', margin: 1.5 },
];

export const DEFAULT_BINDING_PRICES: Array<{
  quantityRange: string;
  price: number;
}> = [
  { quantityRange: '1-99', price: 2900 },
  { quantityRange: '100-199', price: 3500 },
  { quantityRange: '200-499', price: 3900 },
  { quantityRange: '500', price: 4500 },
];
