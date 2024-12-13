import { Router } from "express";
import { addExercise, getUserWorkoutExerciseByID, deleteUserWorkoutExercise, completeExercise } from "../controllers/userWorkoutExerciseController";
import { authMiddleware } from "../middlewares/authMiddleware";
const userWorkoutExerciseRouter = Router();

userWorkoutExerciseRouter.get("/getUserWorkoutExerciseByID/:id", authMiddleware,  getUserWorkoutExerciseByID);
userWorkoutExerciseRouter.post("/addExercise", authMiddleware, addExercise);
userWorkoutExerciseRouter.delete("/:id", authMiddleware, deleteUserWorkoutExercise);
userWorkoutExerciseRouter.post("/:id/complete", authMiddleware, completeExercise);

export default userWorkoutExerciseRouter;
