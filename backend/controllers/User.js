const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");

const createAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Name, email, and password are required" });
  }

  try {
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Admin with this email already exists" });
    }

    const newAdmin = await User.create({
      name,
      email,
      password,
      role: "admin",
    });

    res.status(StatusCodes.CREATED).json(newAdmin);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const getAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" }).select("-password");
    res.status(StatusCodes.OK).json(admins);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const getAdminById = async (req, res) => {
  const { id } = req.params;

  try {
    const admin = await User.findById(id).select("-password");

    if (!admin || admin.role !== "admin") {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Admin not found" });
    }

    res.status(StatusCodes.OK).json(admin);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const updateAdmin = async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  try {
    const updateData = { name, email };

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 12);
      updateData.password = hashedPassword;
    }

    const updatedAdmin = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedAdmin || updatedAdmin.role !== "admin") {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Admin not found" });
    }

    res.status(StatusCodes.OK).json(updatedAdmin);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const deleteAdmin = async (req, res) => {
  const { id } = req.params;

  try {
    const admin = await User.findById(id);

    if (!admin || admin.role !== "admin") {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Admin not found" });
    }

    await User.findByIdAndDelete(id);
    res.status(StatusCodes.NO_CONTENT).send();
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

module.exports = {
  createAdmin,
  getAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
};
