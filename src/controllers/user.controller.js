import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const register = async (req, res, next) => {
  const { firstName, lastName = "", username, email, password } = req.body;
  try {
    if (!firstName || !username || !email || !password) {
      throw new ApiError(400, "Fill all the required fields");
    }
    const isUserNameExist = await User.findOne({ username });

    if (isUserNameExist) {
      throw new ApiError(400, "Username already taken");
    }
    const isEmailExist = await User.findOne({ email });
    if (isEmailExist) {
      throw new ApiError(400, "Email already registerd");
    }
    const user = await User.create({
      firstName,
      lastName,
      username,
      email,
      password,
    });
    console.log("created user: ", user);

    const newUser = await User.findById(user._id).select(
      "-password -refershToken"
    );

    return res
      .status(200)
      .json(new ApiResponse(200, newUser, "User successfully registered"));
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      throw new ApiError(400, "All fields are required");
    }
    const user = await User.findOne({ username });
    if (!user) {
      throw new ApiError(404, "User doesn't exist");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, user, "User logged in successfully"));
  } catch (error) {
    next(error);
  }
};

export { register };
