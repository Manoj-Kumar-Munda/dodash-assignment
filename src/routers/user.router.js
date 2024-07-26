import { Router } from "express";

const userRouter = Router();

userRouter.route("/register").post();

export default userRouter;
