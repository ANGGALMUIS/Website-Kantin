import { z } from "zod";

export const createOrderSchema = z.object({
  canteenId: z.uuid("canteenId harus berupa UUID yang valid"),

  items: z
    .array(
      z.object({
        menuId: z.uuid("menuId harus berupa UUID yang valid"),

        quantity: z.coerce.number().int().min(1, "Quantity minimal 1"),
      }),
    )
    .min(1, "Minimal harus ada 1 item"),
});
