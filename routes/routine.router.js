import express from "express";
import authMiddleware from "../middlewares/session";
import {
  getRoutine,
  makeRoutine,
  deleteRoutine,
} from "../controllers/routine.controllers";

const routineRouter = new express.Router();

routineRouter.get("/", authMiddleware, getRoutine);
routineRouter.post("/write", authMiddleware, makeRoutine);
routineRouter.delete("/delete", authMiddleware, deleteRoutine);
