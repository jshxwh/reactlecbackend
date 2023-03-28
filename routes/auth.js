const express = require("express");

const router = express.Router();

const getProducts = require("../models/product");

const upload = require("../utils/multer");

const {
  registerUser,

  loginUser,

  logout,

  forgotPassword,

  resetPassword,

  getUserProfile,

  allUsers,

  updateProfile,

  updatePassword,

  getUserDetails,

  updateUser,

  deleteUser,
} = require("../controllers/authController");

const {
  isAuthenticatedUser,

  authorizeRoles,
} = require("../middlewares/auth");

router
  .route("/admin/user/:id")

  .get(isAuthenticatedUser, authorizeRoles("admin"), getUserDetails)

  .put(isAuthenticatedUser, authorizeRoles("admin"), updateUser)

  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);

router
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizeRoles("admin"), allUsers);

router.put(
  "/me/update",
  isAuthenticatedUser,
  upload.single("avatar"),
  updateProfile
);

router
  .route("/admin/user/:id")

  .get(isAuthenticatedUser, authorizeRoles("admin"), getUserDetails)

  .put(isAuthenticatedUser, authorizeRoles("admin"), updateUser)

  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);

router.put("/password/update", isAuthenticatedUser, updatePassword);

router.get("/me", isAuthenticatedUser, getUserProfile);

router.post("/register", upload.single("avatar"), registerUser);

router.post("/login", loginUser);

router.route("/password/forgot").post(forgotPassword);

router.route("/password/reset/:token").put(resetPassword);

router.route("/logout").get(logout);

module.exports = router;
