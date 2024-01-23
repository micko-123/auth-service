const jwt = require("jsonwebtoken");
const User = require("../models/User");

const signToken = (id) => {
  try {
    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    return token;
  } catch (error) {
    return error.message;
  }
};

const verifyToken = (token) => {};

const signUp = async (req, res) => {
  try {
    //check if email is taken
    const userPresent = await User.findOne({ email: req.body.email });

    if (userPresent) {
      return res.status(400).json({
        status: "fail",
        message: "user allready exists",
      });
    }

    // get user info
    const user = await User.create(req.body);
    const token = signToken(user.id);

    res.status(201).json({
      status: "succuss",
      data: token,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

const signIn = async (req, res) => {
  // check email and pass are present
  const { email, password } = req.body;

  if (!(email && password)) {
    return res.status(400).json({
      status: "fail",
      message: "please provide email and password",
    });
  }

  // check if email exist and password is correct
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(400).json({
      status: "fail",
      message: "email not found",
    });
  } else if (!(await user.correctPassword(password, user.password))) {
    return res.status(400).json({
      status: "fail",
      message: "incorrect password",
    });
  }

  // sign and send token
  const token = signToken(user.id);

  res.status(200).json({
    status: "success",
    data: { token: `Bearer ${token}` },
  });
};

module.exports = {
  signIn,
  signUp,
};
