import express, { Request, Response } from "express";

const app = express();

app.get("/", (req: Request, res: Response) => {
  res.send("server is running");
});

app.get("/cookie-test", (req, res) => {
  console.log("RAW:", req.headers.cookie);
  console.log("PARSED:", req.cookies);
  res.sendStatus(200);
});

export default app;
