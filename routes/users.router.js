import express from "express";
import { signin, signup, signout } from "../controllers/users.controllers";

const usersRouter = express.Router();

usersRouter.post("/signin", signin);
usersRouter.post("/signup", signup);
usersRouter.post("/signout", signout);
