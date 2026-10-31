const express = require("express");
const {
  handleRegisterUser,
  handleLoginUser,
} = require("../controllers/users.controller");
const {
  validateUserData,
} = require("../middlewares/userDataValidation.middleware");

const router = express.Router();

router.post("/register", validateUserData, handleRegisterUser);
router.post("/login", validateUserData, handleLoginUser);
module.exports = router;
