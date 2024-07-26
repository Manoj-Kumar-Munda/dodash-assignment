import { Router } from "express";
import { login, register, updateUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const userRouter = Router();

userRouter.route("/").post(register);
userRouter.route("/login").post(login);
userRouter.route("/update").put(verifyJWT, updateUser);

export default userRouter;
