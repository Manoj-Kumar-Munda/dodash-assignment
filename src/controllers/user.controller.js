import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";

const register = async (req, res, next) => {
  const { firstName, lastName, username, email, password } = req.body;

  try {
    if (!firstName || !username || !email || !password) {
      throw new ApiError(400, "Fill all the required fields");
    }
    const isUserNameExist = await User.find({ username });
    console.log(isUserNameExist);
    if (isUserNameExist) {
      throw new ApiError(400, "Username already taken");
    }
    const isEmailExist = await User.find({ email });
    if (isEmailExist) {
      throw new ApiError(400, "Email already registerd");
    }
  } catch (error) {
    next(error);
  }
};
