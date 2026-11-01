const express = require("express");
const { getBlogsByUser } = require("../controllers/blog.controller");
const router = express.Router();

router.get("/:userId/blogs", getBlogsByUser);
module.exports = router;
