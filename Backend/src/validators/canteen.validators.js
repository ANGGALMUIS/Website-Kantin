import { z } from "zod";

export const createCanteenSchema = z.object({
  name: z
    .string()
    .min(3, "Nama kantin minimal 3 karakter")
    .max(100, "Nama kantin maksimal 100 karakter"),

  description: z
    .string()
    .min(5, "Deskripsi minimal 5 karakter")
    .max(500, "Deskripsi maksimal 500 karakter"),
});

export const updateCanteenSchema = z.object({
  name: z
    .string()
    .min(3, "Nama kantin minimal 3 karakter")
    .max(100, "Nama kantin maksimal 100 karakter")
    .optional(),

  description: z
    .string()
    .min(5, "Deskripsi minimal 5 karakter")
    .max(500, "Deskripsi maksimal 500 karakter")
    .optional(),
});

export const updateCanteenStatusSchema = z.object({
  isOpen: z.boolean({
    message: "isOpen harus berupa true atau false",
  }),
});
