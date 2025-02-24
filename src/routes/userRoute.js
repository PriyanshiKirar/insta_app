import { Router } from "express";
const router = Router();

import * as userController from "../controllers/userController.js";
import * as userMiddleware from "../middlewares/userMiddleware.js";
router.post(
  "/register",

  userMiddleware.registerMiddleware,
  userController.createUserController
);

export default router;
