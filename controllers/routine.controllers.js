import {
  getRoutineM,
  makeRoutineM,
  deleteRoutineM,
} from "../models/routine.model.js";

// 전체 루틴 목록 조회
export async function getRoutine(req, res) {
  try {
    const userId = req.session.userId;
    const routines = await getRoutineM(userId);

    return res.status(200).json({
      success: true,
      message: "Get routines successful.",
      data: routines,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Cannot find routines" });
  }
}

// 루틴 작성
export async function makeRoutine(req, res) {
  try {
    const userId = req.session.userId;
    const { title, category, startDate, endDate, times } = req.body;

    await makeRoutineM(userId, title, category, startDate, endDate, times);
    return res
      .status(200)
      .json({ success: true, message: "Make routine successful" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to create a routine" });
  }
}

// 루틴 삭제
export async function deleteRoutine(req, res) {
  try {
    const userId = req.session.userId;
    const routineId = req.body.routineId;
    await deleteRoutineM(userId, routineId);
    return res
      .status(200)
      .json({ success: true, message: "Delete routine successful" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: true, message: "Failed to delete a routine" });
  }
}
