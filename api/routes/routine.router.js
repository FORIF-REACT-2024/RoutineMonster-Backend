import express from "express";
import { authMiddleware } from "../middlewares/session.js";
import {
  getRoutine,
  makeRoutine,
  deleteRoutine,
} from "../controllers/routine.controllers.js";

export const routineRouter = new express.Router();

routineRouter.get("/", authMiddleware, getRoutine);
routineRouter.post("/write", authMiddleware, makeRoutine);
routineRouter.post("/delete", authMiddleware, deleteRoutine);
