import { Router } from "express";
import cartsRoutes from "./carts.routes.js";
import productsRoutes from "./products.routes.js";
import usersRoutes from "./users.routes.js";
import sessionRoutes from "./session.routes.js";

const routes = Router();

routes.use("/carts", cartsRoutes);
routes.use("/products", productsRoutes);
routes.use("/users", usersRoutes);
routes.use("/session", sessionRoutes);

export default routes;
