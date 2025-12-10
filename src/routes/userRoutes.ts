import express, { Request, Response } from "express";
import { auth } from "../middlewares/auth";
import { currentUser, getAllUsers } from "../controllers/userController";

const router = express.Router();

router.get("/me", auth, currentUser);

router.get("/users", auth, getAllUsers);

export default router;
