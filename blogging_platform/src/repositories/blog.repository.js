const blogModel = require("../models/blog.model");
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
module.exports = { createBlogWithUserId, findLatestBlogs, findBlogsByUserId };
