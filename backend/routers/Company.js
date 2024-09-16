const express = require("express");
const { uploadImages } = require("../middleware/multer");
const {
  getCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
} = require("../controllers/Company");
const { isAdmin, isSuperAdmin } = require("../middleware/auth");
const router = express.Router();

router.get("/",isAdmin, getCompanies);
router.post("/", isAdmin, uploadImages.single("logo"), createCompany);
router.put("/:id", isAdmin, uploadImages.single("logo"), updateCompany);
router.delete("/:id", isSuperAdmin, deleteCompany);

module.exports = router;
