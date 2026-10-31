function validateUserData(req, res, next) {
  const { email, password } = req.body || {}; // if user sends req without content-type it will bypass urlencoded() or exprss.json
  // console.log(req.body);

  if (!email || !password) {
    return res.status(400).json({
      error: "Bad Request",
      message: "Email and passwords are required",
    });
  }
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      error: "Bad Request",
      message: "Please enter valid Email structure",
    });
  }
  if (password.length < 8) {
    return res.status(400).json({
      error: "Bad Request",
      message: "Password must be atleast 8 character long",
    });
  }
  next();
}
module.exports = { validateUserData };
