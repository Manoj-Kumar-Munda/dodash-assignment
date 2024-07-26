import { Router } from "express";
import { login, register } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.route("/").post(register);
userRouter.route("/login").post(login)

export default userRouter;
