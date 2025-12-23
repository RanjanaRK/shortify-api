import express from "express";
import {
  currentUser,
  getAllUsers,
  getUserActivity,
} from "../controllers/userController";
import { auth, optionalAuth } from "../middlewares/auth";
import { checkAnonUser } from "../middlewares/checkAnonId";

const router = express.Router();

router.get("/me", auth, currentUser);

router.get("/users", auth, getAllUsers);

router.get("/activity", auth, getUserActivity);

export default router;
