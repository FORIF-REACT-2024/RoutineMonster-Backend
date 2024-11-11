import express from "express";
import { authMiddleware } from "../middlewares/session.js";
import {
  getDateRoutine,
  checkRoutine,
  updateComment,
  getCalendar,
} from "../controllers/date.controllers.js";

export const dateRouter = new express.Router();

dateRouter.get("/", authMiddleware, getDateRoutine); // 오늘의 루틴 가져오기
dateRouter.patch("/check", authMiddleware, checkRoutine); // 루틴 체크 수정하기
dateRouter.put("/comment", authMiddleware, updateComment); // 코멘트 저장하기
dateRouter.put("/calendar", authMiddleware, getCalendar); // 전체 캘린더 루틴 가져오기
