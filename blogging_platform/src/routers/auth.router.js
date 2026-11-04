const express = require("express");
const {
  handleRegisterUser,
  handleLoginUser,
} = require("../controllers/auth.controller");
const {
  validateUserData,
} = require("../middlewares/userDataValidation.middleware");
const verifyUser = require("../middlewares/verifyUser.middleware");

const router = express.Router();

router.post("/register", validateUserData, handleRegisterUser);
router.post("/login", validateUserData, handleLoginUser);
router.get("/me", verifyUser, (req, res) => {
  res.status(200).json({ userId: req.userId });
});
module.exports = router;
