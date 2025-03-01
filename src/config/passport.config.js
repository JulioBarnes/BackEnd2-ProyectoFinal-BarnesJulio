import passport from "passport";
import "dotenv/config";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import { usersModel } from "../dao/models/users.model.js";
import { verifyPassword, hashPassword } from "../utils/password.utils.js";
import GithubStrategy from "passport-github2";

export function initializePassport() {
  // 🚨 Registro
  passport.use(
    "register",
    new LocalStrategy(
      {
        usernameField: "email",
        passReqToCallback: true,
        passwordField: "password",
      },
      async (req, email, password, done) => {
        try {
          const { first_name, last_name, age } = req.body;

          const userExists = await usersModel.findOne({ email }).lean();
          if (userExists)
            return done(null, false, { message: "Email already exists" });

          const hashedPassword = await hashPassword(password);
          const user = await usersModel.create({
            first_name,
            last_name,
            age,
            email,
            password: hashedPassword,
          });

          done(null, user);
        } catch (error) {
          done(error);
        }
      }
    )
  );

  // 🚨 Login
  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await usersModel.findOne({ email });
          if (!user) return done(null, false, { message: "User not found" });

          const isPasswordCorrect = await verifyPassword(
            password,
            user.password
          );
          if (!isPasswordCorrect)
            return done(null, false, { message: "Invalid password" });

          done(null, user);
        } catch (error) {
          done(error);
        }
      }
    )
  );

  // 🚨 Estrategia "current" con JWT
  passport.use(
    "current",
    new JWTStrategy(
      {
        secretOrKey: process.env.JWT_SECRET,
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      },
      async (payload, done) => {
        try {
          const user = await usersModel
            .findOne({ email: payload.email })
            .lean();
          if (!user) return done(null, false, { message: "User not found" });

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user._id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await usersModel.findById(id).lean();
      return done(null, user);
    } catch (error) {
      return done(`Hubo un error: ${error.message}`);
    }
  });
}

// 🚨 Función para extraer token de cookies ✅
function cookieExtractor(req) {
  return req?.cookies?.token || null;
}

//���Recuperar contraseña
passport.use(
  "restore-password",
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (email, password, done) => {
      try {
        const user = await usersModel.findOne({ email }).lean();
        if (!user) return done(null, false, { message: "User not found" });
        const hashedPassword = await hashPassword(password);
        await usersModel.updateOne(
          { _id: user._id },
          { password: hashedPassword }
        );
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

//���Método github
passport.use(
  "github",
  new GithubStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:8080/api/session/githubcallback",
    },

    async (access_token, refresh_token, profile, done) => {
      try {
        console.log(profile);
        const email = profile.emails?.[0].value || "Correo no disponible";

        let user = await usersModel.findOne({
          email,
        });

        if (user) {
          return done(null, user);
        }

        const newUser = await usersModel.create({
          first_name: profile.displayName,
          email,
          age: profile.age || 0,
          githubId: profile.id,
        });
        return done(null, newUser);
      } catch (error) {
        return done(error);
      }
    }
  )
);
