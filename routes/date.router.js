import express from "express";
import { authMiddleware } from "../middlewares/session.js";
import {
  getDateRoutine,
  checkRoutine,
  updateComment,
  getCalendar,
} from "../controllers/date.controllers.js";

export const dateRouter = new express.Router();

dateRouter.get("/", authMiddleware, getDateRoutine); // 일별 루틴 조회
dateRouter.patch("/check", authMiddleware, checkRoutine); // 루틴 체크 수정
dateRouter.put("/comment", authMiddleware, updateComment); // 코멘트 저장
dateRouter.put("/calendar", authMiddleware, getCalendar); // 전체 캘린더 루틴 조회
