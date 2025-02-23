import jwt from "jsonwebtoken";
import "dotenv/config";
export function generateToken(payload) {
  const token = jwt.sign(payload, process.env.JWT_SECRET);
  return token;
}

export function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Error(`Token invalid ${error}`);
  }
}

//Middleware para verificar el token en las peticiones por array del header
/*
  export function authenticate(req, res, next) {
    const token = req.headers.authorization.split(" ")[1]; //accede al segundo elemento del array
    req.headers["authorization"].split(" ")[1];
  
    try {
      const decoded = verifyToken(token);
      req.user = decoded;
      next();
    } catch (error) {
      console.log(error);
      res.status(401).json({ message: "Token invalid" });
    }
  }
  */
