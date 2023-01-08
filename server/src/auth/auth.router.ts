import { Router } from "express";
import * as AuthController from "./auth.controller";
import AuthMiddleware from "./auth.middleware";

const AuthRouter = Router();

// BODY: {name, username, email, password}
AuthRouter.post("/signup", AuthController.SignupUser);

// BODY: {username, password}
AuthRouter.post("/login", AuthController.LoginUser);

AuthRouter.post("/verify-token", AuthMiddleware, AuthController.VerifyToken);

export default AuthRouter;
