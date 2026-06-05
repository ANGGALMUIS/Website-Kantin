import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

import {
  getMyCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";

import {
  createCategorySchema,
  updateCategorySchema,
} from "../validators/category.validators.js";

const router = Router();

router.use(authenticate, authorize("CANTEEN_ADMIN"));

router.get("/", getMyCategories);

router.post("/", validate(createCategorySchema), createCategory);

router.patch("/:id", validate(updateCategorySchema), updateCategory);

router.delete("/:id", deleteCategory);

export default router;
