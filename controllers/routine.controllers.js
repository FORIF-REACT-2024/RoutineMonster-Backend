import {
  getRoutineM,
  makeRoutineM,
  deleteRoutineM,
} from "../models/routine.model.js";

// 전체 루틴 목록 조회
export async function getRoutine(req, res) {
  try {
    const userId = req.session.userId;
    const { pageId } = req.params;
    const parsedPageId = parseInt(pageId, 10);

    if (isNaN(parsedPageId) || parsedPageId < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid pageId. Must be a positive number.",
      });
    }

    const routines = await getRoutineM(userId, parsedPageId);

    return res.status(200).json({
      success: true,
      message: "Get routines successful.",
      data: routines,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Cannot find routines", error: error });
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
      return res
        .status(400)
        .json({ success: false, message: "Invalid input data" });
    }

    await makeRoutineM(title, category, startDate, endDate, times, userId);
    return res
      .status(200)
      .json({ success: true, message: "Make routine successful" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create a routine",
      error: error,
    });
  }
}

// 루틴 삭제
export async function deleteRoutine(req, res) {
  try {
    const userId = req.session.userId;
    const { routineId } = req.body;

    if (!routineId) {
      return res.status(400).json({
        success: false,
        message: "Routine ID is required",
      });
    }

    const result = await deleteRoutineM(userId, routineId);

    // 삭제 결과 확인
    if (result.deletedRoutine && result.deletedChecks) {
      return res.status(200).json({
        success: true,
        message: "Delete routine successful",
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Routine not found or not deleted",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete a routine",
      error: error,
    });
  }
}
