import express from "express";
import userRouter from "./routers/user.router.js";


const app = express();

app.use(express.json());
app.use("/api/v1/user", userRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});
export default app;