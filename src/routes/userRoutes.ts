import express from "express";
import {
  currentUser,
  getAllUsers,
  getUserActivity,
} from "../controllers/userController";
import { requireAuth } from "../middlewares/authToken";
// import { requireAuth } from "../middlewares/auth";

const router = express.Router();

router.get("/me", requireAuth, currentUser);

router.get("/users", requireAuth, getAllUsers);

router.get("/activity", requireAuth, getUserActivity);

export default router;
