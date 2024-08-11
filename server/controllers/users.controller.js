import { User } from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { sendMail } from "../utils/mailHelper.js";

// Register Route
// Method : POST
const registerUser = asyncHandler(async (req, res) => {
  // extract data
  const { email, fullName, password } = req.body;

  //validate data
  if (!fullName || !email || !password) {
    return res
      .status(500)
      .json(new ApiResponse(500, {}, "All fields are required"));
  }

  if (password.length < 6) {
    return res
      .status(200)
      .json(new ApiResponse(500, {}, "Password of atleast 6 length required"));
  }

  // check if already user available with current email
  const existedUser = await User.findOne({ email });

  // if already available, send response
  if (existedUser) {
    return res
      .status(200)
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
    return res
      .status(500)
      .json(new ApiResponse(500, {}, "Something went wrong in creating User"));
  }

  // email verification (in test mode)  mails can only be sent to dabhadeyash1111@gmail.com while in test mode

  // send mail regarding verification of the user

  //get token from user model methods
  const verificationToken = user.getVerificationToken();

  //save user fileds in databse
  await user.save({ validateBeforeSave: false });

  //create a URL
  const myUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/verify/${verificationToken}`;

  //craft a message
  const message = `Copy paste this link in URL and hit enter \n\n ${myUrl}`;

  //attempt to send email
  try {
    await sendMail(user.email, "ConnectVerse - Verify Email", message);

    //send json response for success
    res.status(200).json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    await user.save({ validateBeforeSave: false });
    //send error response
    return res.status(200).json(new ApiResponse(500, {}, "Error occured"));
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
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "Email and Password are required"));
  }

  // find user by email
  const user = await User.findOne({ email });

  // if user not found, send message to register
  if (!user) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "User Not Registered"));
  }

  // validate password which was hased using isPasswordCorrect method in model
  const isValidPassword = await user.isPasswordCorrect(password);

  // if password is not valid return error
  if (!isValidPassword) {
    return res.status(200).json(new ApiResponse(401, {}, "Invalid Password"));
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
    return res
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

//forget password
const forgotpassword = asyncHandler(async (req, res, next) => {
  //collect email
  const { email } = req.body;

  if (!email) {
    return res.status(400).json(new ApiResponse(400, {}, "Invalid Email"));
  }

  //find user in db
  const user = await User.findOne({ email });

  //if user not found in database
  if (!user) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "No user found with given email"));
  }

  //get token from user model methods
  const forgotToken = user.getForgotPasswordToken();

  //save user fileds in databse
  await user.save({ validateBeforeSave: false });

  //create a URL
  const myUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${forgotToken}`;

  //craft a message
  const message = `Copy paste this link in URL and hit enter \n\n ${myUrl}`;

  //attempt to send email
  try {
    const verdict = await sendMail(
      user.email,
      "ConnectVerse - Password Reset",
      message
    );

    if (verdict) {
      //send json response for success
      res.status(200).json({
        success: true,
        message: "Email sent successfully",
      });
    } else {
      return res
        .status(200)
        .json(new ApiResponse(500, {}, "Error occured while sending mail"));
    }
  } catch (error) {
    //reset user fields if not success
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;
    await user.save({ validateBeforeSave: false });

    //send error response
    return res.status(200).json(new ApiResponse(500, {}, "Error occured"));
  }
});

//password reset
const passwordReset = asyncHandler(async (req, res, next) => {
  //get token from params
  const token = req.params.token;

  // hash the token as db also stores the hashed version
  const encryToken = crypto.createHash("sha256").update(token).digest("hex");

  // find user based on hased on token and time in future
  const user = await User.findOne({
    encryToken,
    forgotPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return res
      .status(500)
      .json(new ApiResponse(500, {}, "Token is invalid or expired"));
  }

  // check if password and conf password matched
  if (req.body.password !== req.body.confirmPassword) {
    return res
      .status(200)
      .json(new ApiResponse(500, {}, "Passwords don't match "));
  }

  // update password field in DB
  user.password = req.body.password;

  // reset token fields
  user.forgotPasswordToken = undefined;
  user.forgotPasswordExpiry = undefined;

  // save the user
  await user.save();

  // send a JSON response OR send token
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user,
      },
      "Success"
    )
  );
});

export { registerUser, loginUser, forgotpassword, passwordReset };
