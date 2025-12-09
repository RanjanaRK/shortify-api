import dotenv from "dotenv";
import express from "express";
import dbConnection from "./config/db";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import app from "./server";
import cookieParser from "cookie-parser";
import helmet from "helmet";

dotenv.config();

dbConnection();

app.use(express.json());
app.use(cookieParser());
// app.use(helmet());

app.use("/api", authRoutes);
app.use("/api", userRoutes);

app.listen(8000, () => {
  console.log("server is running okay");
});
