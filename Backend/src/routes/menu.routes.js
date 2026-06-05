import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

import {
  createMenu,
  getMyMenus,
  updateMenu,
  deleteMenu,
  updateMenuAvailability,
} from "../controllers/menu.controller.js";

import {
  createMenuSchema,
  updateMenuSchema,
  updateMenuAvailabilitySchema,
} from "../validators/menu.validators.js";

const router = Router();

router.use(authenticate, authorize("CANTEEN_ADMIN"));

router.get("/my", getMyMenus);

router.post("/", validate(createMenuSchema), createMenu);

router.patch("/:id", validate(updateMenuSchema), updateMenu);

router.patch(
  "/:id/availability",
  validate(updateMenuAvailabilitySchema),
  updateMenuAvailability,
);

router.delete("/:id", deleteMenu);

export default router;
