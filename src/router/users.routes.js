import { Router } from "express";
import { usersController } from "../middlewares/users.middleware.js";

const router = Router();

router.get("/", usersController.getAll);

router.get("/:uid", usersController.getById);

export default router;
