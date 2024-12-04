import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { getExercises } from "../controllers/exerciseControllers";

const exerciseRoutes = Router();

exerciseRoutes.get("/getExercises", getExercises); //TODO: add middleware

export default exerciseRoutes;