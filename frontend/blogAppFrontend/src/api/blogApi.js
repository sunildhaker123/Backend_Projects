import api from "./axios";

export const getBlogs = async () => (await api.get("/blogs")).data;
export const getBlog = async (blogId) => (await api.get(`/blogs/${blogId}`)).data;
export const createBlog = async (blog) => (await api.post("/blogs", blog)).data;
export const getBlogsByUser = async (userId) => (await api.get(`/users/${userId}/blogs`)).data;
