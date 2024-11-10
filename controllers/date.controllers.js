import {
  getDateRoutineM,
  checkRoutineM,
  updateCommentM,
} from "../models/date.model.js";

// 일별 루틴 가져오기
export async function getDateRoutine(req, res) {
  const userId = req.session.userId;
  try {
    const todayRoutines = await getDateRoutineM(userId);
    return res.status(200).json(todayRoutines);
  } catch (error) {
    return res.status(500).json("Finding today's routines failed");
  }
}

// 루틴 체크 수정하기
export async function checkRoutine(req, res) {
  const { date, checkedRoutineId } = req.body;
  try {
    await checkRoutineM(date, checkedRoutineId);
    res.status(200).json("Routine checking was successful");
  } catch (error) {
    res.status(500).json("Routine checking failed");
  }
}

// 코멘트 저장하기
export async function updateComment(req, res) {
  const { date, comment } = req.body;

  try {
    await updateCommentM(date, comment);
    res.status(200).json("Updating comment was successful");
  } catch (error) {
    res.status(500).json("Updating comment faild");
  }
}

// 전체 캘린더 루틴 가져오기
export async function getCalendar(req, res) {}
