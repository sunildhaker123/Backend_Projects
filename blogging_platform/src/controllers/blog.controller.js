const {
  createBlogWithUserId,
  findLatestBlogs,
  findBlogsByUserId,
  findBlogById,
  deleteBlogById,
  updateBlogById,
} = require("../repositories/blog.repository");

async function createBlog(req, res, next) {
  try {
    const { title, content } = req.body;
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
  }
}
async function getLatestBlogs(req, res, next) {
  try {
    const blogs = await findLatestBlogs(10);
    return res.status(200).json({ count: blogs.length, blogs });
  } catch (error) {
    return next(error);
  }
}
async function getBlogsByUser(req, res, next) {
  try {
    const { userId } = req.params;
    if (!userId || userId.trim() === "") {
      return res.status(400).json({ message: "Invalid User ID format" });
    }
    const blogs = await findBlogsByUserId(userId);
    return res.status(200).json({ count: blogs.length, blogs });
  } catch (error) {
    return next(error);
  }
}
async function getBlogById(req, res, next) {
  try {
    const { blogId } = req.params;
    const blog = await findBlogById(blogId);
    return res.status(200).json(blog);
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    return next(error);
  }
}
async function deleteBlog(req, res, next) {
  try {
    const { blogId } = req.params;
    await deleteBlogById(blogId, req.userId);
    return res.status(204).send();
  } catch (error) {
    if (error.status)
      return res.status(error.status).json({ message: error.message });
    return next(error);
  }
}
async function updateBlog(req, res, next) {
  try {
    const data = req.body;
    console.log(data);
    const updatedBlog = await updateBlogById({
      userId: req.userId,
      data: data,
      blogId: req.params.blogId,
    });
    return res.status(201).json({ updatedBlog });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    return next(error);
  }
}
module.exports = {
  createBlog,
  getLatestBlogs,
  getBlogsByUser,
  getBlogById,
  deleteBlog,
  updateBlog,
};
