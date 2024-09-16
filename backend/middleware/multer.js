const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
const { CLOUD_NAME, API_SECRET, API_KEY } = require("../config");
const path = require("path");

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
  secure: true,
});

const imageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Jobify/images",
  },
});

const pdfStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Jobify/pdfs",
  },
});

const imageFileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};

const pdfFileFilter = (req, file, cb) => {
  const fileExtension = path.extname(file.originalname).toLowerCase();
  if (fileExtension !== ".pdf") {
    return cb(new Error("Only PDF files are allowed!"), false);
  }
  cb(null, true);
};

const uploadImages = multer({
  storage: imageStorage,
  fileFilter: imageFileFilter,
});

const uploadPDFs = multer({
  storage: pdfStorage,
  fileFilter: pdfFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

const uploadSingleImage = uploadImages.single("image");

module.exports = {
  uploadImages,
  uploadPDFs,
  uploadSingleImage,
};
