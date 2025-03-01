import { usersDao } from "../dao/mongoDao/users.dao.js";
import { cartDao } from "../dao/mongoDao/carts.dao.js";
import { generateToken } from "../utils/jwt.js";
import passport from "passport";
import { mailDao } from "../dao/mongoDao/mails.dao.js";

class SessionController {
  async login(req, res, next) {
    passport.authenticate("login", async (error, user, info) => {
      if (error)
        return res.status(500).json({ message: "Internal server error" });
      if (!user)
        return res.status(401).json({ message: "Invalid credentials" });

      // Verificar si el usuario tiene un carrito
      if (!user.cart) {
        const cart = await cartDao.create({ user: user._id });
        await usersDao.update(user._id, { cart: cart._id });
      }

      const token = generateToken({ email: user.email, role: user.role });
      res.cookie("token", token, { httpOnly: true, secure: false });

      res.json({ message: "Login successful", token });
    })(req, res, next);
  }

  async register(req, res, next) {
    passport.authenticate("register", async (error, user, info) => {
      if (error) {
        return res.status(500).json({ message: "Internal server error" });
      }
      if (!user) {
        return res.status(400).json({ message: info.message });
      }

      // Crear un carrito para el nuevo usuario
      const cart = await cartDao.create({ user: user._id });
      await usersDao.update(user._id, { cart: cart._id });

      await mailDao.sendMail({
        to: user.email,
        subject: "Bienvenido a la tienda",
        type: "welcome",
      });

      res.status(201).json({ message: "User registered successfully", user });
    })(req, res, next);
  }

  async current(req, res, next) {
    passport.authenticate(
      "current",
      { session: false },
      (error, user, info) => {
        if (error) {
          return res.status(500).json({ message: "Internal server error" });
        }
        if (!user) {
          return res.status(401).json({ message: "Unauthorized" });
        }

        // Si la autenticación es exitosa, enviar los datos del usuario
        res.json({ user });
      }
    )(req, res, next);
  }

  async logout(req, res) {
    res.clearCookie("token");
    console.log("Logout successful");
    req.session.destroy();
    res.json({ message: "Logout successful" });
  }

  async checkUserRole(req, res, next) {
    const user = req.user; // El usuario se obtiene de la estrategia "current" de Passport
    console.log(user);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized. Please login." });
    }

    if (user.role !== "user") {
      return res.status(403).json({
        message: "Access denied. Only users can perform this action.",
      });
    }
    next();
  }
}

export const sessionController = new SessionController();
