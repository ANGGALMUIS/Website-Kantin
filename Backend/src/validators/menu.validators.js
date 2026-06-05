import { z } from "zod";

export const createMenuSchema = z.object({
  name: z
    .string()
    .min(3, "Nama menu minimal 3 karakter")
    .max(100, "Nama menu maksimal 100 karakter"),

  description: z
    .string()
    .min(3, "Deskripsi minimal 3 karakter")
    .max(500, "Deskripsi maksimal 500 karakter"),

  price: z.coerce.number().positive("Harga harus lebih dari 0"),

  imageUrl: z.string().optional(),

  categoryId: z.string().uuid().optional().nullable(),
});

export const updateMenuSchema = z.object({
  name: z.string().min(3).max(100).optional(),

  description: z.string().min(3).max(500).optional(),

  price: z.coerce.number().positive().optional(),

  imageUrl: z.string().optional(),

  categoryId: z.string().uuid().optional().nullable(),
});

export const updateMenuAvailabilitySchema = z.object({
  isAvailable: z.boolean(),
});
