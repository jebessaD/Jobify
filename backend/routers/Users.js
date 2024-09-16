const express = require("express");
const { isSuperAdmin } = require("../middleware/auth");
const {
  createAdmin,
  getAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
} = require("../controllers/User");

const router = express.Router();

router.post("", isSuperAdmin, createAdmin);

router.get("", isSuperAdmin, getAdmins);

router.get("/:id", isSuperAdmin, getAdminById);

router.patch("/:id", isSuperAdmin, updateAdmin);

router.delete("/:id", isSuperAdmin, deleteAdmin);

module.exports = router;
