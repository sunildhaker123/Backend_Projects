const blogModel = require("../models/blog.model");
async function createBlogWithUserId({ blogBody, userId }) {
  const blog = await blogModel.create({
    title: blogBody.title,
    author: userId,
    content: blogBody.content,
  });
  return blog._id;
}
module.exports = { createBlogWithUserId };
