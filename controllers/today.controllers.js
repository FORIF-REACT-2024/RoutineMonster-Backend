import { getTodayRoutine, checkRoutine } from "../models/routineList.model";

// 오늘의 루틴 가져오기
export async function getTodayRoutine(req, res) {
  const userId = req.session.userId;
  try {
    const todayRoutines = await getTodayRoutine(userId);
    return res.status(200).json(todayRoutines);
  } catch (error) {
    return res.status(500).json("Failed to find today routine list");
  }
}

// 루틴 체크
export async function checkRoutine(req, res) {
  const userId = req.session.userId;
  const { date, checkedRoutineId } = req.body;
  try {
    const check = checkRoutine(date, checkedRoutineId);
    res.status(200).json("Routine Checking succeed");
  } catch (error) {
    res.status(500).json("Routine Checking failed");
  }
}
