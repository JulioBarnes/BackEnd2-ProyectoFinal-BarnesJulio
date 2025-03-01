import { Router } from "express";
import { productController } from "../middlewares/products.middleware.js";

const router = Router();

router.get("/", productController.getAll);

router.get("/:pid", productController.getById);

router.post("/", productController.create);

router.put("/:pid", productController.update);

router.delete("/:pid", productController.deleteById);

export default router;
