import express from "express";
import { Prisma, PrismaClient } from "@prisma/client";

import usersRouter from "./routes/users.router";

const PORT = 4000;
const app = express();
// const prisma = new PrismaClient();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/users", usersRouter);

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
