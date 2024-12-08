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



export const getWorkoutPlanWithUserWorkoutExerciseAll = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res
                .status(400)
                .send({ error: "User ID is missing from the request." });
        }

        // Fetch workout plans and associated exercises
        const result = await db
            .select()
            .from(workoutPlans)
            .leftJoin(
                userWorkoutExercise,
                eq(workoutPlans.planId, userWorkoutExercise.planId)
            )
            .where(eq(workoutPlans.userId, userId));

        if (result.length === 0) {
            return res
                .status(404)
                .send({ message: "No workout plans or exercises found for the user." });
        }

        // Group exercises by workout plan
        const groupedData = result.reduce((acc, curr) => {
            const planId = curr["Workout Plans"].planId;

            if (!acc[planId]) {
                acc[planId] = {
                    planId: curr["Workout Plans"].planId,
                    name: curr["Workout Plans"].name,
                    intensity: curr["Workout Plans"].intensity,
                    durationDays: curr["Workout Plans"].durationDays,
                    goal: curr["Workout Plans"].goal,
                    progress: curr["Workout Plans"].progress,
                    completed: curr["Workout Plans"].completed,
                    createdAt: curr["Workout Plans"].createdAt,
                    exercises: [],
                };
            }

            // Add the exercise to the workout plan if it exists
            if (curr["User Workout Exercise"]) {
                acc[planId].exercises.push({
                    planId: curr["Workout Plans"].planId,
                    workoutExerciseId: curr["User Workout Exercise"].workoutExerciseId,
                    exerciseId: curr["User Workout Exercise"].exerciseId,
                    sets: curr["User Workout Exercise"].sets,
                    reps: curr["User Workout Exercise"].reps,
                    durationMin: curr["User Workout Exercise"].durationMin,
                    weight: curr["User Workout Exercise"].weight,
                    distance: curr["User Workout Exercise"].distance,
                    restTimePerSec: curr["User Workout Exercise"].restTimePerSec,
                    day: curr["User Workout Exercise"].day,
                    completed: curr["User Workout Exercise"].completed,
                    createdAt: curr["User Workout Exercise"].createdAt,
                });
            }

            return acc;
        }, {} as Record<number, any>);

        // Convert the grouped object into an array
        const response = Object.values(groupedData);

        console.log("Fetched workout plans with exercises:", response);
        res.status(200).json(response);
    } catch (error: any) {
        console.error("Error fetching workout plans and exercises:", error);
        res.status(500).send({ error: "An unexpected error occurred." });
    }
};

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
