import { Router } from "express";
import { Url } from "../models/Url";

const router = Router();

router.get("/test", (req, res) => {
  res.send("OK");
});
router.get("/db-read", async (req, res) => {
  const url = await Url.findOne().select("shortCode");
  res.json(url);
});
export default router;
