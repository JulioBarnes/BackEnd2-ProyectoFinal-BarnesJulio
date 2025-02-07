import express from "express";
import cartsRoutes from "./router/carts.routes.js";
import productsRoutes from "./router/products.routes.js";
import usersRoutes from "./router/users.routes.js";
import session from "express-session";
import sessionRoutes from "./router/session.routes.js";
import { connectMongoDB } from "./config/mongoDB.config.js";
import cookieParser from "cookie-parser";
//import { auth } from "./auth.js";
import mongoStore from "connect-mongo";
import passport from "passport";
import { initializePassport } from "./config/passport.config.js";

connectMongoDB();

const PORT = 8080;

const app = express();

const SECRETO = "secreto";
const mongoUser = "julito";
const mongoPassword = "1234";
const mongoUrl = `mongodb+srv://${mongoUser}:${mongoPassword}@proyectofinal.ref4y.mongodb.net/session-base?retryWrites=true&w=majority&appName=ProyectoFinal`;
const sessionMiddleware = session({
  secret: SECRETO,
  store: mongoStore.create({
    mongoUrl, //url de la base de datos
    ttl: 60 * 60 * 24, // tiempo de vida de las cookies en segundos (60 segundos * 60 minutos * 24 horas)
  }),
  resave: false,
  saveUninitialized: false, // si es false, no guarda cookies cuando no hay sesiones iniciadas
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessionMiddleware);
app.use("/api/carts", cartsRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/session", sessionRoutes);
app.use(express.static("public"));
app.use(cookieParser());

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.get("/api/setCookie", (req, res) => {
  res.cookie("cookieName", "cookieValue"); //{ maxAge: 900000 } tiempo de vida de cookie
  res.send("Cookie creada correctamente");
});

app.get("/api/getCookie", (req, res) => {
  res.send(req.cookies.cookieName); //req.cookies para obtener todas las cookies sino req.cookies.cookieName para una especifica
});

app.get("/api/deleteCookie", (req, res) => {
  res.clearCookie("cookieName").send("Cookie removed");
});

/*
app.get("/session", (req, res) => {
  if (req.session.contador) {
    req.session.contador++;
    res.send(`Contador: ${req.session.contador}`);
  } else {
    req.session.contador = 1;
    res.send(`Bienvenido al sitio! Contador: ${req.session.contador}`);
  }
});
app.get("/session/logout", (req, res) => {
  req.session.destroy();
  res.status(200).send("Session removed");
});
*/

app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
export { sessionMiddleware };
