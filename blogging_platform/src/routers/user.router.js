const express = require("express");
const { handleRegisterUser } = require("../controllers/users.controller");
const {
  validateUserData,
} = require("../middlewares/userDataValidation.middleware");

const router = express.Router();

router.post("/register", validateUserData, handleRegisterUser);
module.exports = router;
