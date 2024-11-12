import {
  getDateRoutineM,
  checkRoutineM,
  updateCommentM,
  getCalendarM,
} from "../models/date.model.js";

// 일별 루틴 조회
export async function getDateRoutine(req, res) {
  try {
    const userId = req.session.userId;
    const date = req.body.date;
    const dateRoutines = await getDateRoutineM(userId, date);

    return res.status(200).json({
      success: true,
      message: "Get routines of date successful",
      data: dateRoutines,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to get routines of date" });
  }
}

// 루틴 체크 수정하기
export async function checkRoutine(req, res) {
  try {
    const userId = req.session.userId;
    const { date, checkedRoutineId } = req.body;
    await checkRoutineM(checkedRoutineId, date, userId);
    res
      .status(200)
      .json({ success: true, message: "Checked routines successful" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to check routines" });
  }
}

// 코멘트 저장하기
export async function updateComment(req, res) {
  try {
    const userId = req.session.userId;
    const { date, comment } = req.body;
    await updateCommentM(userId, date, comment);
    res
      .status(200)
      .json({ success: true, message: "Updated comment successful" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to update comment" });
  }
}

// 전체 캘린더 루틴 가져오기
export async function getCalendar(req, res) {
  try {
    const userId = req.session.userId;
    const { year, month } = req.body;
    const calendar = await getCalendarM(userId, year, month);
    return res.status(200).json({
      success: true,
      message: "Got calendar data successful",
      data: calendar,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get calendar data",
    });
  }
}