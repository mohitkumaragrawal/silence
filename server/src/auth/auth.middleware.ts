import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthPayload {
  name: string;
  username: string;
  email: string;
  _id: string;
}

export default function AuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authToken = req.header("Authorization");
  if (!authToken) {
    req.auth = undefined;
    return next();
  }

  try {
    const decoded = <AuthPayload>(
      jwt.verify(authToken, process.env.JWT_KEY || "123456")
    );

    req.auth = {
      name: decoded.name,
      email: decoded.email,
      username: decoded.username,
    };
  } catch (e) {
    req.auth = undefined;
  }

  return next();
}
