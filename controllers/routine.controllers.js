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
    const userId = req.session?.userId; // 세션이 없을 경우를 대비한 안전한 접근
    if (!userId) {
      console.error("Unauthorized: userId is missing in session");
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const { title, category, startDate, endDate, times } = req.body;

    if (!title || !category || !startDate || !endDate || !times) {
      console.error("Invalid input data:", req.body);
      return res
        .status(400)
        .json({ success: false, message: "Invalid input data" });
    }

    // 디버깅: 요청 데이터 로그
    console.log("Received data:", {
      title,
      category,
      startDate,
      endDate,
      times,
      userId,
    });

    await makeRoutineM(title, category, startDate, endDate, times, userId);
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
