const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const authRoutes = require("./src/routers/auth.router");
const blogRoutes = require("./src/routers/blog.router");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
//routes goes here

app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});
module.exports = app;
