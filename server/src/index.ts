import express from "express";
import type { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import "./config/mongoClient.ts";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send("Matchmaking Devfolio API is running");
});


const PORT = process.env.PORT || 3007;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
