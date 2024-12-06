import { Request,Response } from "express";
import {db} from '../models/db';
import { workoutPlans } from "../models/schema";
import { eq, and } from 'drizzle-orm';
import { userWorkoutExercise } from "../models/schema";

interface AuthRequest extends Request {
    user?: {
        id: number;
    }
}

export const getWorkoutPlans = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        console.log(req.user);
        if (!userId) {
             res.status(401).send("User not authenticated");
             return
        }
        
        const result = await db.select()
            .from(workoutPlans)
            .where(eq(workoutPlans.userId, userId));

        if (!result.length) {
            res.status(404).send("No workout plans found for this user");
            return;
        }
        res.status(200).send(result);
        return;
    } catch (error) {
        res.status(500).send(error.message);
        return;
    }
};

export const deleteWorkoutPlan = (req: Request, res: Response) => {
    
}

export const getWorkoutPlanByID = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const result = await db.select().from(workoutPlans).where(eq(workoutPlans.planId, parseInt(id)));
         res.status(200).send(result);
         return;
    } catch (error) {
         res.status(500).send(error.message);
         return;
    }
}   

export const createWorkoutPlan = async(req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    try {
       await db.insert(workoutPlans).values({...req.body, userId});
         res.status(201).send("Workout Plan created successfully")
         return;    
    } catch (error) {
        res.status(500).send(error.message)
        return;
    }

}

export const getWorkoutPlanWithUserWorkoutExerciseById = async (req: AuthRequest, res: Response) => {
    try {
        const {id} = req.params;
        const userId = req.user?.id;
        if (!id) {
            res.status(400).send("Plan ID is required");
            return;
        }
        if (!userId) {
            res.status(401).send("User not authenticated");
            return;
        }

        const workoutPlansWithExercises = await db.select()
            .from(workoutPlans).leftJoin(userWorkoutExercise, eq(workoutPlans.planId, userWorkoutExercise.planId))
            .where(and(
                eq(workoutPlans.planId, parseInt(id)),
                eq(workoutPlans.userId, userId)
            ));
          //  console.log(workoutPlansWithExercises);
     
        res.status(200).send({workoutPlansWithExercises});
        return;
    } catch (error) {
        res.status(500).send(error.message);
        return;
    }
}

export const getWorkoutPlanWithUserWorkoutExerciseAll = async (req: AuthRequest, res: Response) => {
    //TODO: Implement this and test it
    try {
        const userId = req.user?.id;
        const result = await db.selectDistinctOn([workoutPlans.planId]).from(workoutPlans).leftJoin(userWorkoutExercise, eq(workoutPlans.planId, userWorkoutExercise.planId)).where(eq(workoutPlans.userId, userId));
        console.log(result);
        res.status(200).send(result);
        return;
    } catch (error) {
        res.status(500).send(error.message);
        return;
    }
}

export const updateWorkoutPlan = async (req: Request, res: Response) => {
    //TODO: Implement this and test it
    try {
        const {id} = req.params;
        await db.update(workoutPlans).set({...req.body}).where(eq(workoutPlans.planId, parseInt(id)));
        res.status(200).send("Workout Plan updated successfully");
        return;
    } catch (error) {
        res.status(500).send(error.message);
        return;
    }
}
