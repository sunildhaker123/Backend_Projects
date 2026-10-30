const express = require("express");
const path = require("path");
const app = express();
const userRouter = require("./src/routers/user.router");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//routes goes here

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./index.html"));
});

app.use("/api/blogs/users", userRouter);
module.exports = app;
