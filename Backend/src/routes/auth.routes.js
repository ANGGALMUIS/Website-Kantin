/**
 *  @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register User
 *     tags:
 *       - Auth
 *     responses:
 *       201:
 *         description: Registrasi berhasil
 */

import { Router } from "express";
import { register, login } from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { me } from "../controllers/auth.controller.js";
import { registerSchema, loginSchema } from "../validators/auth.validators.js";
import { getMe } from "../controllers/auth.controller.js";
import { googleLogin } from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/google", googleLogin);
router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticate, me, getMe);

export default router;
