import express from "express";
import { signin, signout } from "../controllers/users.controllers.js";

export const usersRouter = express.Router();

usersRouter.post("/signin", signin); // 로그인, 회원가입
usersRouter.post("/signout", signout); // 로그아웃
