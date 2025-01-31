import express from "express";
import cartsRoutes from "./router/carts.routes.js";
import productsRoutes from "./router/products.routes.js";
import { connectMongoDB } from "./config/mongoDB.config.js";

connectMongoDB();

const PORT = 8080;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/carts", cartsRoutes);
app.use("/api/products", productsRoutes);
app.use(express.static("public"));

app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
