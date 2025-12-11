import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import dbConnection from "./config/db";
import authRoutes from "./routes/authRoutes";
import qrRoute from "./routes/qrRoutes";
import urlRoutes from "./routes/urlRoutes";
import userRoutes from "./routes/userRoutes";
import app from "./server";
import helmet from "helmet";

dotenv.config();

dbConnection();

app.use(express.json());
app.use(cookieParser());
app.use(helmet());

app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", urlRoutes);
app.use("/api/qr", qrRoute);

app.listen(8000, () => {
  console.log("server is running okay");
});
