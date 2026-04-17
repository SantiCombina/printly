import { z } from 'zod';

export const printSchema = z
  .object({
    pages: z.number().int().min(1).max(9999),
    size: z.string().min(1),
    weight: z.string().min(1),
    format: z.string().min(1),
    side: z.enum(['simple', 'double']),
    percentage: z.string().nullable().default(null),
    bindingQuantity: z.number().int().min(0).default(0),
    additional: z.number().min(0).default(0),
    remarks: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.format === 'color' && !data.percentage) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'El porcentaje es requerido para impresión a color',
        path: ['percentage'],
      });
    }
  });

export type PrintParams = z.infer<typeof printSchema>;
