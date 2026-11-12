const { updateBlog } = require("../controllers/blog.controller");
const blogModel = require("../models/blog.model");
class dataNotFoundError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
async function createBlogWithUserId({ blogBody, userId }) {
  const blog = await blogModel.create({
    title: blogBody.title,
    author: userId,
    content: blogBody.content,
  });
  return blog._id;
}
async function findLatestBlogs(limit = 10) {
  const blogs = await blogModel
    .find({})
    .sort({ createdAt: -1, _id: -1 })
    .limit(limit)
    .select("title content author createdAt")
    .lean();
  return blogs;
}
async function findBlogsByUserId(id) {
  const blogs = await blogModel
    .find({ author: id })
    .sort({ createdAt: -1, _id: -1 })
    .select("title content author createdAt")
    .lean();
  return blogs;
}
async function findBlogById(blogId) {
  const blog = await blogModel
    .find({ _id: blogId })
    .select("title content author createdAt")
    .lean();
  if (blog.length == 0) {
    throw new dataNotFoundError(404, "no data was found");
  }
  return blog;
}
async function deleteBlogById(blogId, userId) {
  try {
    const result = await blogModel.deleteOne({ _id: blogId, author: userId });

    if (result.deletedCount === 0) {
      throw new dataNotFoundError(404, "Blog doesn't exist");
    }
  } catch (error) {
    if (error.name === "CastError") {
      throw new dataNotFoundError(404, "Blog doesn't exist");
    }
    throw error;
  }
}

async function updateBlogById({ userId, blogId, data }) {
  try {
    const updatedBlog = await blogModel.findOneAndUpdate(
      { _id: blogId, author: userId },
      { $set: data }, // Update payload
      { returnDocument: "after", runValidators: true }, // Returns updated doc & runs schema validations
    );
    if (!updatedBlog) {
      throw new dataNotFoundError(404, "Blog doesnt exists");
    }
    return updatedBlog;
  } catch (error) {
    throw error;
  }
}
module.exports = {
  createBlogWithUserId,
  findLatestBlogs,
  findBlogsByUserId,
  findBlogById,
  deleteBlogById,
  updateBlogById,
};
