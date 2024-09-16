const User = require("./models/User");
const { PASSWORD, EMAIL } = require("./config");
const bcrypt = require("bcryptjs");

const seed = async () => {
  try {
    const superAdmin = await User.findOne({ role: "super-admin" });

    if (!superAdmin) {
      const newSuperAdmin = new User({
        name: "super-admin",
        email: EMAIL,
        password: PASSWORD,
        role: "super-admin",
      });

      await newSuperAdmin.save();
      console.log("Super-admin user created successfully.");
    } else {
      console.log("Super-admin user already exists.");
    }
  } catch (error) {
    console.error("Error creating super-admin user:", error.message);
  }
};

module.exports = seed;
