const { createBlogWithUserId } = require("../repositories/blog.repository");

async function createBlog(req, res, next) {
  //   console.log(req.body);
  try {
    const { title, content } = req.body;
    console.log(title, content);
    if (typeof title !== "string" || typeof content !== "string") {
      return res
        .status(400)
        .json({ message: "title and content must be strings" });
    }
    const blogId = await createBlogWithUserId({
      blogBody: { title, content },
      userId: req.userId,
    });
    return res.status(201).json({
      blogId: blogId.toString(),
      message: "blog posted",
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    return next(error);
    next(error);
  }
}
module.exports = { createBlog };
