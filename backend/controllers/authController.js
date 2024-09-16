const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { JWT_SECRET } = require("../config");

const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      userRole: user.role,
    },
    JWT_SECRET,
    { expiresIn: "1d" }
  );
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("no user")
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid email or password" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      console.log("Password", password, user.password)
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user);

    res.status(StatusCodes.OK).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

module.exports = { login };
