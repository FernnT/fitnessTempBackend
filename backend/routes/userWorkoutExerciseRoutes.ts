import { Router } from "express";
import { addExercise, getUserWorkoutExerciseByID, deleteUserWorkoutExercise, completeExercise } from "../controllers/userWorkoutExerciseController";
import { authMiddleware } from "../middlewares/authMiddleware";
const userWorkoutExerciseRouter = Router();

// userWorkoutExerciseRouter.get("/:id", getUserWorkoutExerciseByID);//TODO: add authMiddleware    
// userWorkoutExerciseRouter.post("/addExercise", addExercise);//TODO: add authMiddleware
// userWorkoutExerciseRouter.delete("/:id", deleteUserWorkoutExercise);//TODO: add authMiddleware
// userWorkoutExerciseRouter.post("/:id/complete", completeExercise);//TODO: add authMiddleware


userWorkoutExerciseRouter.get("/:id", authMiddleware,  getUserWorkoutExerciseByID);
userWorkoutExerciseRouter.post("/addExercise", authMiddleware, addExercise);
userWorkoutExerciseRouter.delete("/:id", authMiddleware, deleteUserWorkoutExercise);
userWorkoutExerciseRouter.post("/:id/complete", authMiddleware, completeExercise);

export default userWorkoutExerciseRouter;
