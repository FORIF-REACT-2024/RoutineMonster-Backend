import express from "express";
import { authMiddleware } from "../middlewares/session.js";
import {
  getRoutine,
  makeRoutine,
  deleteRoutine,
} from "../controllers/routine.controllers.js";

export const routineRouter = new express.Router();

routineRouter.get("/", authMiddleware, getRoutine); // 전체 루틴 목록 조회
routineRouter.post("/write", authMiddleware, makeRoutine); // 루틴 작성
routineRouter.post("/delete", authMiddleware, deleteRoutine); // 루틴 삭제
