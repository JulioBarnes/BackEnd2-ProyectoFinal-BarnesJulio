import { Router } from "express";
import { cartController } from "../middlewares/carts.middleware.js";
import { sessionController } from "../middlewares/session.middleware.js";
import passport from "passport";

export const router = Router();

//🚨 Buscar todos los carritos
router.get("/", cartController.getAll);

//🚨 Buscar carrito por ID
router.get("/:cid", cartController.getById);

//🚨 Crea un carrito
router.post("/", cartController.create);

//🚨 Agregar productos al carrito
router.put("/:cid/product/:pid", cartController.update);

//🚨 Eliminar producto del carrito
router.delete("/:cid/product/:pid", cartController.delete);

//🚨 Finalizar compra
router.post(
  "/:cid/purchase",
  passport.authenticate("current", { session: false }), // Autenticar al usuario
  sessionController.checkUserRole,
  cartController.purchase
);

export default router;
