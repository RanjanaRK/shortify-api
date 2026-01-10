import express from "express";
import {
  currentUser,
  deleteUserAccount,
  getAllUsers,
  getUserActivity,
} from "../controllers/userController";
import { requireAuth } from "../middlewares/authToken";

const router = express.Router();

router.get("/me", requireAuth, currentUser);

router.delete("/deleteAccount", requireAuth, deleteUserAccount);

router.get("/users", requireAuth, getAllUsers);

router.get("/activity", requireAuth, getUserActivity);

export default router;
