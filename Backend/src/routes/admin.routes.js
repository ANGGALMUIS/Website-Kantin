import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

import {
  getPendingCanteens,
  approveCanteen,
  rejectCanteen,
  getAdminStats,
  approveRequest,
  getPendingRequests,
  rejectRequest
} from "../controllers/admin.controller.js";

const router = Router();

router.use(authenticate, authorize("SUPER_ADMIN"));

router.get("/stats", getAdminStats);

router.get("/requests", getPendingRequests);

router.patch("/requests/:id/approve", approveRequest);

router.patch("/requests/:id/reject", rejectRequest);

router.get("/canteens/pending", getPendingCanteens);

router.patch("/canteens/:id/approve", approveCanteen);

router.patch("/canteens/:id/reject", rejectCanteen);

export default router;
