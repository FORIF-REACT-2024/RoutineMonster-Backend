import {
  getRoutine,
  makeRoutine,
  deleteRoutine,
  getDeletedRoutine,
} from "../models/routineList.model";

// 전체 루틴 가져오기
export async function getRoutine(req, res) {
  try {
    const routines = await getRoutine(req.session.userId);
    return res.status(200).json(routines);
  } catch (error) {
    return res.status(500).json("Cannot find routines");
  }
}

// 루틴 작성하기
export async function makeRoutine(req, res) {
  const { title, category, startData, endDate, times } = req.body;
  try {
    const making = await makeRoutine(
      req.session.userId,
      title,
      category,
      startData,
      endDate,
      times
    );
    return res.status(200).json("Success making routine");
  } catch (error) {
    return res.status(500).json("Failed to create a routine");
  }
}

// 루틴 삭제하기
export async function deleteRoutine(req, res) {
  const routineId = req.body.routineId;
  try {
    const response = await deleteRoutine(routineId);
    const deletedRoutine = await getDeletedRoutine(routineId);
    return res.status(200).json(deletedRoutine);
  } catch (error) {
    return res.status(500).json("Cannot delete routines");
  }
}
