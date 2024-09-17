require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;
const PORT = process.env.PORT;
const MONGOSE_URI = process.env.MONGOSE_URI;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION;
const PASSWORD = process.env.ADMIN_PASSWORD;
const EMAIL = process.env.ADMIN_EMAIL;
const CLOUDINARY_URL = process.env.CLOUDINARY_URL;
const API_SECRET = process.env.API_SECRET;
const API_KEY = process.env.API_KEY;
const CLOUD_NAME = process.env.CLOUD_NAME;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

module.exports = {
  CLOUD_NAME,
  CLOUDINARY_URL,
  API_SECRET,
  API_KEY,
  JWT_SECRET,
  PORT,
  MONGOSE_URI,
  JWT_EXPIRATION,
  EMAIL,
  PASSWORD,
};
