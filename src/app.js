// 🌐 Carga de variables de entorno
import "dotenv/config";

// 📦 Módulos externos
import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import passport from "passport";
import cookieParser from "cookie-parser";
import mongoStore from "connect-mongo";
import handlebars from "express-handlebars";
import path from "path";

// 📌 Módulos internos (propios del proyecto)
import { initializePassport } from "./config/passport.config.js";
import __dirname from "./utils/utils.js";
import { viewsRouter } from "./router/views.routes.js";
import cartsRoutes from "./router/carts.routes.js";
import productsRoutes from "./router/products.routes.js";
import usersRoutes from "./router/users.routes.js";
import sessionRoutes from "./router/session.routes.js";

// 🔗 Conexión a MongoDB principal

mongoose
  .connect(process.env.MONGODB_CNN)
  .then(() => console.log("✅ Conectado a MongoDB con Mongoose"))
  .catch((error) => console.error("❌ Error en la conexión a MongoDB:", error));

// 🌍 Configuración del servidor
const app = express();
const PORT = process.env.PORT || 8080;

// 🔑 Configuración de sesión con MongoDB
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  store: mongoStore.create({
    mongoUrl: process.env.MONGO_SESSION_URL,
    ttl: 60 * 60 * 24, // 24 horas
  }),
  resave: false,
  saveUninitialized: false,
});

// 🖥️ Configuración de Handlebars
app.engine("hbs", handlebars.engine());
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "hbs");

// 🛠️ Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, "../public")));
app.use(cookieParser());

// 🔐 Inicialización de Passport
initializePassport();

// 🚀 Rutas principales
app.use("/", viewsRouter);
app.use("/api/carts", cartsRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/session", sessionRoutes);

// 🚀 Inicialización del servidor
app.listen(PORT, () => {
  console.log(`🔥 Servidor corriendo en http://localhost:${PORT}`);
});
