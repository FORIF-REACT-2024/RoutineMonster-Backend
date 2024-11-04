import express from "express";
import { signin, signup } from "../controllers/users.controllers";

const usersRouter = express.Router();

usersRouter.get("/signin", signin);
usersRouter.post("/signup", signup);
usersRouter.post("/signout", signout);
