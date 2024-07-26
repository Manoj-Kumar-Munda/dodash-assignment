import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    console.log(
      "generated tokens: ",
      accessToken,
      " refreshToken:",
      refreshToken
    );

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error.message);
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

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

    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
      throw new ApiError(400, "Password didn't match");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, user, "User logged in successfully"));
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  const { firstName, lastName, email } = req.body;
  try {
    if (!firstName || !lastName || !email) {
      throw new ApiError(400, "All fields are reuired");
    }

    const isEmailExist = await User.findOne({ email });
    if (isEmailExist) {
      throw new ApiError(400, "Email already registered");
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        firstName,
        lastName,
        email,
      },
      {
        new: true,
      }
    ).select("-password -refreshToken");
    return res
      .status(200)
      .json(new ApiResponse(200, updatedUser, "User details updated"));
  } catch (error) {
    next(error);
  }
};

export { register, login, updateUser };
