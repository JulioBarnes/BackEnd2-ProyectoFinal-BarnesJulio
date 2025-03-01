import { Router } from "express";
import { sessionController } from "../middlewares/session.middleware.js";
import { sessionRegisterDto, sessionLoginDto } from "../dtos/session.dto.js";
import { validate } from "../middlewares/validate.middleware.js";

export const router = Router();

// 🚨 Ruta Login (Genera Token y almacena en cookie)
router.get("/login", validate(sessionLoginDto), sessionController.login);

// 🚨 Ruta Register
router.post(
  "/register",
  validate(sessionRegisterDto),
  sessionController.register
);

// 🚨 Ruta Logout (Elimina la cookie y la session)
router.get("/logout", sessionController.logout);

// 🚨 Ruta Current (Obtiene los datos del usuario autenticado por JWT)
router.get("/current", sessionController.current);

export default router;
