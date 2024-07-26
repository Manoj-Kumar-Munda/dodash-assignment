import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../utils/constants.js";

const verifyJWT = async (req, res, next) => {
  console.log("Verifying Tokens");
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }
    const decodedToken = jwt.verify(ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(500, "Something went wrong");
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export { verifyJWT };
