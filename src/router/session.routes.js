import { Router } from "express";
import { userModel } from "../dao/models/users.model.js";
import { hashPassword, verifyPassword } from "../utils/password.utils.js";
import { generateToken } from "../utils/jwt.js";
import passport from "passport";

export const router = Router();

// 🚨 Ruta Login (Genera Token y almacena en cookie)
router.get("/login", async (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    if (err) return res.status(500).json({ message: "Internal server error" });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken({ email: user.email, role: user.role });
    res.cookie("token", token, { httpOnly: true, secure: false });

    res.json({ message: "Login successful", token });
  })(req, res, next);
});

// 🚨 Ruta Register
router.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/register" }),
  (req, res) => {
    res.json({ message: "User registered successfully" });
  }
);

// 🚨 Ruta Logout (Elimina la cookie)
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  console.log("Logout successful");
  req.session.destroy();
  res.redirect("/");
});

// 🚨 Ruta Current (Obtiene los datos del usuario autenticado por JWT)
router.get(
  "/current",
  passport.authenticate("current", { session: false }),
  (req, res) => {
    res.json({ user: req.user });
  }
);

//🚨Restore Password, pendiente
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

//🚨ruta de autenticacion para redirigir a GitHub
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user: email"] }),
  async (req, res) => {}
);
//🚨ruta de callback para manejar respuesta de GitHub
router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    console.log("req.user");

    if (req.user) {
      req.session.user = req.user;
      return res.redirect("/");
    }
    res.redirect("/login");
  }
);

export default router;

/*//🚨Ruta current
router.get(
  "/current",
  passport.authenticate("current", {
    failureRedirect: "/register",
    successRedirect: "/",
  })
);
*/
/*//🚨Ruta Logout
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});
*/
/*//🚨Ruta "/"
router.get("/", (req, res) => {
  const contador = req.session.contador;
  if (req.session.contador) {
    req.session.contador++;
    res.render("index", { contador });
  } else {
    req.session.contador = 1;
    res.render("index", { contador });
  }
});
*/
/*//🚨Ruta Profile
router.get("/profile", authenticate, (req, res) => {
  const user = users.find((user) => user.email === req.user.email);

  if (!user) {
    return res.status(401).json({ error: "Usuario no encontrado" });
  }

  res.json({
    user,
    message: "Profile successful",
  });
});
*/
/*//🚨Ruta register
router.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/register",
    successRedirect: "/login",
  })
);
*/
/*//🚨Restore Password, pendiente
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
/*//🚨Ruta Login
router.get(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/login",
    successRedirect: "/api/session/current",
  }),
  (req, res) => res.redirect("/current")
);
*/
