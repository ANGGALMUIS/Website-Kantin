import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware.js";

import {
  createCanteenRequest,
  getMyRequest,
} from "../controllers/canteenRequest.controller.js";

const router = Router();

router.use(authenticate);

router.post("/", createCanteenRequest);

router.get("/me", getMyRequest);

export default router;
