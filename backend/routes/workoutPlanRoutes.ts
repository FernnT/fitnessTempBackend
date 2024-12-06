import { Router } from 'express';
import { login, register } from '../controllers/authController';
import { authMiddleware } from '../middlewares/authMiddleware';
import {createWorkoutPlan, getWorkoutPlanByID, getWorkoutPlans, getWorkoutPlanWithUserWorkoutExerciseById, getWorkoutPlanWithUserWorkoutExerciseAll, updateWorkoutPlan } from '../controllers/workoutPlanController'

const workoutPlanRoutes = Router()

// workoutPlanRoutes.post('/createWorkoutPlan', createWorkoutPlan) 
// workoutPlanRoutes.get('/getWorkoutPlans', getWorkoutPlans) 
// workoutPlanRoutes.get('/getWorkoutPlanWithUserWorkoutExercise/:id', getWorkoutPlanWithUserWorkoutExercise) 
// workoutPlanRoutes.get('/:id', getWorkoutPlanByID) //


workoutPlanRoutes.post('/createWorkoutPlan',authMiddleware, createWorkoutPlan) 
workoutPlanRoutes.get('/getWorkoutPlans',authMiddleware, getWorkoutPlans) 
workoutPlanRoutes.get('/getWorkoutPlanWithUserWorkoutExercise/:id',authMiddleware, getWorkoutPlanWithUserWorkoutExerciseById)
workoutPlanRoutes.get('/getWorkoutPlanWithUserWorkoutExerciseAll',authMiddleware, getWorkoutPlanWithUserWorkoutExerciseAll)
workoutPlanRoutes.get('/:id',authMiddleware, getWorkoutPlanByID) 
//workoutPlanRoutes.put('/:id',authMiddleware, updateWorkoutPlan)

export default workoutPlanRoutes;