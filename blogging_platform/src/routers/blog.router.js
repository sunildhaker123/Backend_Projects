const express = require("express");
const {
  createBlog,
  getLatestBlogs,
  getBlogById,
  deleteBlog,
} = require("../controllers/blog.controller");
const verifyUser = require("../middlewares/verifyUser.middleware");

const router = express.Router();

router.post("/", verifyUser, createBlog);
router.get("/", getLatestBlogs);
router.get("/:blogId", getBlogById);
router.delete("/:blogId", verifyUser, deleteBlog);

module.exports = router;
