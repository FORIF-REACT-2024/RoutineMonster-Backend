import express from "express";
import authMiddleware from "../middlewares/session";
import {
  getTodayRoutine,
  checkRoutine,
} from "../controllers/today.controllers";

const todayRouter = new express.Router();

todayRouter.get("/", authMiddleware, getTodayRoutine);
todayRouter.patch("/", authMiddleware, checkRoutine);
