import express from "express";
import { signin, signout } from "../controllers/users.controllers.js";

export const usersRouter = express.Router();

usersRouter.post("/signin", signin);
usersRouter.post("/signout", signout);
