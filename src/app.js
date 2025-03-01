import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import passport from "passport";
import cookieParser from "cookie-parser";
import mongoStore from "connect-mongo";
import path from "path";
import { initializePassport } from "./config/passport.config.js";
import __dirname from "./utils/utils.js";
import indexRoutes from "./router/index.routes.js";

mongoose
  .connect(process.env.MONGODB_CNN)
  .then(() => console.log("✅ Conectado a MongoDB con Mongoose"))
  .catch((error) => console.error("❌ Error en la conexión a MongoDB:", error));

const app = express();
const PORT = process.env.PORT || 8080;

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  store: mongoStore.create({
    mongoUrl: process.env.MONGO_SESSION_URL,
    ttl: 60 * 60 * 24, // 24 horas
  }),
  resave: false,
  saveUninitialized: false,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, "../public")));
app.use(cookieParser());

initializePassport();

app.use("/api", indexRoutes);

app.listen(PORT, () => {
  console.log(`🔥 Servidor corriendo en http://localhost:${PORT}`);
});
