const express = require("express");
const { createBlog } = require("../controllers/blog.controller");
const verifyUser = require("../middlewares/verifyUser.middleware");
const router = express.Router();

router.post("/", verifyUser, createBlog);

module.exports = router;
