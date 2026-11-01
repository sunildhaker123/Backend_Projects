const { createBlogWithUserId } = require("../repositories/blog.repository");

async function createBlog(req, res, next) {
  //   console.log(req.body);
  try {
    const blogId = await createBlogWithUserId({
      blogBody: req.body,
      userId: req.userId,
    });
    return res.status(201).json({
      blogId: blogId,
      message: "blog posted",
    });
  } catch (error) {
    next(error);
  }
}
module.exports = { createBlog };
