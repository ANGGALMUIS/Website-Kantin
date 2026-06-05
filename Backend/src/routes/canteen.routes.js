import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

import {
  createCanteen,
  getMyCanteen,
  updateMyCanteen,
  updateCanteenStatus,
  getAllCanteens,
  getCanteenById,
  getCanteenMenus,
  getCanteenStats,
  getRevenueChart,
} from "../controllers/canteen.controller.js";

import { validate } from "../middleware/validate.middleware.js";
import { getDashboardStats } from "../controllers/canteen.controller.js";
import {
  createCanteenSchema,
  updateCanteenSchema,
  updateCanteenStatusSchema,
} from "../validators/canteen.validators.js";

const router = Router();
router.get(
  "/dashboard/chart",
  authenticate,
  authorize("CANTEEN_ADMIN"),
  getRevenueChart,
);
router.get("/dashboard/stats", getDashboardStats);
router.get("/stats", authenticate, authorize("CANTEEN_ADMIN"), getCanteenStats);
router.get("/profile", authenticate, authorize("CANTEEN_ADMIN"), getMyCanteen);

router.patch(
  "/profile",
  authenticate,
  authorize("CANTEEN_ADMIN"),
  updateMyCanteen,
);
// Public
router.get("/", getAllCanteens);
router.get("/:id/menus", getCanteenMenus);
router.get("/:id", getCanteenById);

// Canteen Admin
router.post(
  "/",
  authenticate,
  authorize("CANTEEN_ADMIN"),
  validate(createCanteenSchema),
  createCanteen,
);

router.get("/me", authenticate, authorize("CANTEEN_ADMIN"), getMyCanteen);

router.patch(
  "/me",
  authenticate,
  authorize("CANTEEN_ADMIN"),
  validate(updateCanteenSchema),
  updateMyCanteen,
);

router.patch(
  "/me/status",
  authenticate,
  authorize("CANTEEN_ADMIN"),
  validate(updateCanteenStatusSchema),
  updateCanteenStatus,
);

export default router;
