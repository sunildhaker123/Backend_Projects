const mongoose = require("mongoose");

async function connectDb() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database Successfully Connected");
  } catch (err) {
    console.error("Database connection failed", err.message);
    process.exit(1);
  }
}
module.exports = connectDb;
