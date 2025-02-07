import { Router } from "express";
import { userModel } from "../dao/models/users.model.js";
import { hashPassword, verifyPassword } from "../utils/password.utils.js";
import passport from "passport";

export const router = Router();

router.get("/", (req, res) => {
  if (req.session.contador) {
    req.session.contador++;
    res.send(`Contador: ${req.session.contador}`);
  } else {
    req.session.contador = 1;
    res.send(`Bienvenido al sitio! Contador: ${req.session.contador}`);
  }
});
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.status(200).send("Session removed");
});

router.post(
  "/register",
  passport.authenticate("register", { failureMessage: true }),
  (req, res) => {
    if (!req.user) {
      return res.status(400).json({ error: "Error en el registro" });
    }
    res.json({ message: "Registro exitoso", user: req.user });
  }
);

router.get(
  "/login",
  passport.authenticate("login", { session: true }),
  (req, res) => {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Usuario o contraseña incorrectos" });
    }
    res.json({ message: "Login exitoso", user: req.user });
  }
);

/*
router.post(
  "/register",
  passport.authenticate("register", {
    //success: "Successfully registered",
    //failure: "Failed to register",
    failureRedirect: "/register",
    succcessRedirect: "/login",
  }),
  (req, res) => res.redirect("/login")
);

router.get(
  "/login",
  passport.authenticate("login",{

    failureRedirect: "/login",
    succcessRedirect: "/",
  }),
  (req, res) => res.redirect("/")
);


router.post("/restore-password", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).send("User not found");
    const hashedPassword = await hashPassword(password);
    await userModel.updateOne({ _id: user._id }, { password: hashedPassword });
    res.status(200).send("Password reset successful");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
});
*/

router.post(
  "/restore-password",
  passport.authenticate("restore-password", { failureMessage: true }),
  async (req, res) => {
    if (!req.user) {
      return res
        .status(400)
        .json({ error: "Error al restablecer la contraseña" });
    }
    res.status(200).json({ message: "Contraseña restablecida con éxito" });
  }
);
export default router;
