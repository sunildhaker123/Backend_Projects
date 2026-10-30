require("dotenv").config();

const app = require("./app");
const connectDb = require("./src/config/db");
async function startServer() {
  await connectDb();
  app.listen(process.env.PORT || 4000, () => {
    console.log(
      `server is listening at http://localhost:${process.env.PORT || 4000} `,
    );
  });
}
startServer();
