const express = require("express");
const {
  createBlog,
  getLatestBlogs,
  getBlogById,
} = require("../controllers/blog.controller");
const verifyUser = require("../middlewares/verifyUser.middleware");

const router = express.Router();

router.post("/", verifyUser, createBlog);
router.get("/", getLatestBlogs);
router.get("/:blogId", getBlogById);
module.exports = router;
