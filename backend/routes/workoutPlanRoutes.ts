import { Router } from 'express';
import { login, register } from '../controllers/authController';
import { authMiddleware } from '../middlewares/authMiddleware';

const workoutPlanRoutes = Router()

