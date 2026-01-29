import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import dbConnection from "./config/db";
import authRoutes from "./routes/authRoutes";
import qrRoute from "./routes/qrRoutes";
import urlRoutes from "./routes/urlRoutes";
import userRoutes from "./routes/userRoutes";
import app from "./server";

dotenv.config();

dbConnection();

app.use(
  cors({
    origin: "https://shortify-ui-r215.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(helmet());

app.use("/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api", urlRoutes);
app.use("/api/qr", qrRoute);

app.listen(8000, () => {
  console.log("server is running okay");
});
