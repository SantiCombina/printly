export const DEFAULT_PAPER_PRICES: Array<{
  size: string;
  weight: string;
  price: number;
}> = [
  { size: 'A4', weight: '75g', price: 0 },
  { size: 'A4', weight: '80g', price: 0 },
  { size: 'A4', weight: '90g', price: 0 },
  { size: 'A4', weight: '100g', price: 0 },
  { size: 'A4', weight: '150g', price: 0 },
  { size: 'Oficio', weight: '75g', price: 0 },
  { size: 'Oficio', weight: '80g', price: 0 },
  { size: 'Oficio', weight: '90g', price: 0 },
  { size: 'Oficio', weight: '100g', price: 0 },
  { size: 'Oficio', weight: '150g', price: 0 },
  { size: 'A3', weight: '75g', price: 0 },
  { size: 'A3', weight: '80g', price: 0 },
  { size: 'A3', weight: '90g', price: 0 },
  { size: 'A3', weight: '100g', price: 0 },
  { size: 'A3', weight: '150g', price: 0 },
];

export const DEFAULT_INK_PRICES: Array<{
  format: string;
  percentage?: string;
  price: number;
}> = [
  { format: 'blancoNegro', price: 0 },
  { format: 'color', percentage: '10%', price: 0 },
  { format: 'color', percentage: '50%', price: 0 },
  { format: 'color', percentage: '100%', price: 0 },
];

export const DEFAULT_PROFIT_MARGINS: Array<{
  format: string;
  quantityRange: string;
  margin: number;
}> = [
  { format: 'blancoNegro', quantityRange: '1', margin: 2.0 },
  { format: 'blancoNegro', quantityRange: '2-9', margin: 1.8 },
  { format: 'blancoNegro', quantityRange: '10-49', margin: 1.6 },
  { format: 'blancoNegro', quantityRange: '50-99', margin: 1.4 },
  { format: 'blancoNegro', quantityRange: '100-499', margin: 1.2 },
  { format: 'blancoNegro', quantityRange: '500+', margin: 1.0 },
  { format: 'color', quantityRange: '1', margin: 2.0 },
  { format: 'color', quantityRange: '2-9', margin: 1.8 },
  { format: 'color', quantityRange: '10-49', margin: 1.6 },
  { format: 'color', quantityRange: '50-99', margin: 1.4 },
  { format: 'color', quantityRange: '100-499', margin: 1.2 },
  { format: 'color', quantityRange: '500+', margin: 1.0 },
];

export const DEFAULT_BINDING_PRICES: Array<{
  quantityRange: string;
  price: number;
}> = [
  { quantityRange: '1-99', price: 0 },
  { quantityRange: '100-199', price: 0 },
  { quantityRange: '200-499', price: 0 },
  { quantityRange: '500+', price: 0 },
];
