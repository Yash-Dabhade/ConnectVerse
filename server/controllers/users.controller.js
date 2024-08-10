import { User } from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Register Route
// Method : POST
const registerUser = asyncHandler(async (req, res) => {
  // extract data
  const { email, fullName, password } = req.body;

  //validate data
  if (!fullName || !email || !password) {
    res.status(500).json(new ApiResponse(500, {}, "All fields are required"));
  }

  if (password.length < 6) {
    res
      .status(500)
      .json(new ApiResponse(500, {}, "Password of atleast 6 length required"));
  }

  // check if already user available with current email
  const existedUser = await User.findOne({ email });

  // if already available, send response
  if (existedUser) {
    res
      .status(409)
      .json(new ApiResponse(409, {}, "User with email already exist"));
  }

  // create new user
  const user = await User.create({
    email,
    fullName,
    password,
  });

  // get access and refersh token
  const { accessToken, refreshToken } = await generateAccessAndRefereshToken(
    user._id
  );

  // get current user excluding password field
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    res
      .status(500)
      .json(new ApiResponse(500, {}, "Something went wrong in creating User"));
  }

  // return createdUser, access and refresh token via json format
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: createdUser, accessToken, refreshToken },
        "User created successfully!"
      )
    );
});

// Login Route
// Method : POST
const loginUser = asyncHandler(async (req, res) => {
  // extract data from body
  const { email, password } = req.body;

  // check if email is empty
  if (!email || !password) {
    res
      .status(400)
      .json(new ApiResponse(400, {}, "Email and Password are required"));
  }

  // find user by email
  const user = await User.findOne({ email });

  // if user not found, send message to register
  if (!user) {
    res.status(400).json(new ApiResponse(400, {}, "User Not Registered"));
  }

  // validate password which was hased using isPasswordCorrect method in model
  const isValidPassword = await user.isPasswordCorrect(password);

  // if password is not valid return error
  if (!isValidPassword) {
    res.status(200).json(new ApiResponse(401, {}, "Invalid Password"));
  }

  // get access and refersh token
  const { accessToken, refreshToken } = await generateAccessAndRefereshToken(
    user._id
  );

  // get details of the user excluding password and referesh token
  const loggedinUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // return loggedInUser, access and refresh token via json format
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: loggedinUser,
        accessToken,
        refreshToken,
      },
      "User LoggedIn successfully"
    )
  );
});

// Function to generate Access and Refresh token based on given user ID
const generateAccessAndRefereshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error);
    res
      .status(200)
      .json(
        new ApiResponse(
          500,
          {},
          "Something went wrong while generating referesh and access token"
        )
      );
  }
};

export { registerUser, loginUser };
