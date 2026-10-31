const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const userRouter = require("./src/routers/user.router");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
//routes goes here

app.use("/api/blogs/users", userRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});
module.exports = app;
