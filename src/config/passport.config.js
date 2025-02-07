import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { userModel } from "../dao/models/users.model.js";
import { verifyPassword, hashPassword } from "../utils/password.utils.js";
//import session from "express-session";

export function initializePassport() {
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
          if (!first_name || !last_name || !age)
            return done(null, false, { message: "All fields are required" });

          const userExists = await userModel.findOne({ email }).lean();

          if (userExists)
            return done(null, false, { message: "Email already exists" });
          const hashedPassword = await hashPassword(password);
          const user = await userModel.create({
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

  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
      },
      async (email, password, done) => {
        try {
          const user = await userModel.findOne({ email });
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

  passport.use(
    "restore-password",
    new LocalStrategy(
      {
        usernameField: "email",
      },
      async (email, password, done) => {
        try {
          const user = await userModel.findOne({ email }).lean();
          if (!user) return done(null, false, { message: "User not found" });
          const hashedPassword = await hashPassword(password);
          await userModel.updateOne(
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

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await userModel.findById(id).lean();
    done(null, user);
  });
}
