const { StatusCodes } = require("http-status-codes");
const { JWT_SECRET } = require("../config");
const jwt = require("jsonwebtoken");

const isUser = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer")) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Unauthorized access: no header" });
  }

  const token = header.split(" ")[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    console.log(payload)
    req.user = { ...payload };
    next();
  } catch (error) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Unauthorized access: invalid token" });
  }
};

const isAdmin = [
  isUser,
  async (req, res, next) => {
    try {
      if (req.user.userRole !== "admin" && req.user.userRole !== "super-admin") {
        return res
          .status(StatusCodes.FORBIDDEN)
          .json({ message: "Forbidden: insufficient privileges" });
      }
      next();
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  },
];

const isSuperAdmin = [
  isUser,
  async (req, res, next) => {
    try {
      if (req.user.userRole !== "super-admin") {
        return res
          .status(StatusCodes.FORBIDDEN)
          .json({ message: "Forbidden: insufficient privileges" });
      }
      next();
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  },
];

module.exports = { isUser, isAdmin, isSuperAdmin };
