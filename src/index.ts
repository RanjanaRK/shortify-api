import dotenv from "dotenv";
import dbConnection from "./config/db";
import app from "./server";
import router from "./routes/authRoutes";

dotenv.config();

dbConnection();

app.listen(8000, () => {
  console.log("server is running okay");
});
