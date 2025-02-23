import { Router } from "express";

export const viewsRouter = Router();

//🛴Sesión con GitHub
viewsRouter.get("/homegithub", (req, res) => {
  res.render("homeGitHub", { user: req.session.user });
});
//🛴Sesión con GitHub
viewsRouter.get("/logingithub", (req, res) => {
  res.render("loginGitHub");
});

//🌍Vistas Generales de la WEB

viewsRouter.get("/", (req, res) => {
  const isSession = req.user ? true : false;
  res.render("index", {
    title: "Inicio",
    isSession,
  });
});

viewsRouter.get("/login", (req, res) => {
  const isSession = req.user ? true : false;

  if (isSession) return res.redirect("/profile");

  res.render("login", { title: "Iniciar Sesión" });
});

viewsRouter.get("/register", (req, res) => {
  const isSession = req.user ? true : false;

  if (isSession) return res.redirect("/profile");

  res.render("register", { title: "Registro" });
});

viewsRouter.get("/profile", (req, res) => {
  console.log("Usuario autenticado:", req.user); // Verificar qué datos llegan

  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }

  res.render("profile", { title: "Perfil", user: req.user });
});

viewsRouter.get("/restore-password", (req, res) => {
  const isSession = req.user ? true : false;

  if (isSession) return res.redirect("/profile");

  res.render("restore-password", { title: "Restablecer Contraseña" });
});
