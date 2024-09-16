const express = require("express");
const { isAdmin } = require("../middleware/auth");
const {
  createJob,
  getJobs,
  updateJob,
  deleteJob,
  listAllJobs,
} = require("../controllers/Job");

const router = express.Router();

router.post("", isAdmin, createJob);

router.get("", isAdmin, getJobs);

router.get("/all", listAllJobs);

router.patch("/:id", isAdmin, updateJob);

router.delete("/:id", isAdmin, deleteJob);

module.exports = router;
