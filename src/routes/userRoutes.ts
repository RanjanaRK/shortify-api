import express from "express";
import { currentUser, getAllUsers } from "../controllers/userController";
import { auth } from "../middlewares/auth";

const router = express.Router();

router.get("/me", auth, currentUser);

router.get("/users", auth, getAllUsers);

export default router;
