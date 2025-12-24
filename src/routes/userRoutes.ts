import express from "express";
import {
  currentUser,
  getAllUsers,
  getUserActivity,
} from "../controllers/userController";
import { auth } from "../middlewares/auth";

const router = express.Router();

router.get("/me", auth, currentUser);

router.get("/users", auth, getAllUsers);

router.get("/activity", auth, getUserActivity);

export default router;
