import { z } from "zod";

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(3, "Nama kategori minimal 3 karakter")
    .max(50, "Nama kategori maksimal 50 karakter"),
});

export const updateCategorySchema = z.object({
  name: z
    .string()
    .min(3, "Nama kategori minimal 3 karakter")
    .max(50, "Nama kategori maksimal 50 karakter"),
});
