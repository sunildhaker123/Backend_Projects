const express = require("express");
const {
  createBlog,
  getLatestBlogs,
  getBlogsByUser,
} = require("../controllers/blog.controller");
const verifyUser = require("../middlewares/verifyUser.middleware");

const router = express.Router();

router.post("/", verifyUser, createBlog);
router.get("/", getLatestBlogs);
module.exports = router;
