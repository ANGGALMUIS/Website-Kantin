import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

import {
  createOrder,
  getMyOrders,
  getCanteenOrders,
  updateOrderStatus,
  getOrderHistory,
} from "../controllers/order.controller.js";

import { validate } from "../middleware/validate.middleware.js";

import { createOrderSchema } from "../validators/order.validators.js";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize("BUYER"),
  validate(createOrderSchema),
  createOrder,
);

router.get("/my", authenticate, authorize("BUYER"), getMyOrders);

router.get(
  "/canteen",
  authenticate,
  authorize("CANTEEN_ADMIN"),
  getCanteenOrders,
);

router.get("/history", authenticate, authorize("BUYER"), getOrderHistory);

router.patch(
  "/:id/status",
  authenticate,
  authorize("CANTEEN_ADMIN"),
  updateOrderStatus,
);
export default router;
