import { Request,Response } from "express";
import {db} from '../models/db';
import { records, userWorkoutExercise, workoutPlans } from "../models/schema";
import { eq } from 'drizzle-orm';

export const getUserWorkoutExerciseByID = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const result = await db.select().from(userWorkoutExercise).where(eq(userWorkoutExercise.planId,parseInt(id)));
         res.status(200).send(result);
         return;
    } catch (error) {
        res.status(500).send(error.message);
        return;
    }
}

// export const updateUserWorkoutExercise = async (req: Request, res: Response) => {
//     try {
//         const {id} = req.params;
//         const {sets, reps, weight, durationMin, restTimePerSec} = req.body;
//         const result = await db.update(userWorkoutExercise).set({sets, reps, weight, durationMin, restTimePerSec}).where(eq(userWorkoutExercise.id, parseInt(id)));
//         return res.status(200).send(result);
//     } catch (error) {
//         return res.status(500).send(error.message);
//     }
// }

export const addExercise = async (req: Request, res: Response) => {
    console.log(req.body);
    try {
        const result = await db.insert(userWorkoutExercise).values(req.body);
         res.status(201).send(result);
         return;
    } catch (error) {
         res.status(500).send(error.message);
         return
    }
}

export const deleteUserWorkoutExercise = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await db.delete(userWorkoutExercise)
            .where(eq(userWorkoutExercise.workoutExerciseId, parseInt(id)));
         res.status(200).send({ message: "Exercise deleted successfully" });
         return;
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export const completeExercise = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const exercise = await db.select()
            .from(userWorkoutExercise)
            .where(eq(userWorkoutExercise.workoutExerciseId, parseInt(id)));

        if (!exercise[0]) {
             res.status(404).send("Exercise not found");
             return;    
        }

        // Update exercise to completed
        await db.update(userWorkoutExercise)
            .set({ completed: true})
            .where(eq(userWorkoutExercise.workoutExerciseId, parseInt(id)));

        // Get workout plan to get userId
        const plan = await db.select()
            .from(workoutPlans)
            .where(eq(workoutPlans.planId, exercise[0].planId));

        // Create record
        const record = await db.insert(records).values({
            userId: plan[0].userId,
            exerciseId: exercise[0].exerciseId,
            date: new Date().toISOString(),
            setsCompleted: exercise[0].sets,
            repsCompleted: exercise[0].reps,
            durationMin: exercise[0].durationMin,
            weight: exercise[0].weight || 0,
            distance: exercise[0].distance || 0,
            caloriesBurned: 0, // TODO: calculate this based on exercise details
        });

         res.status(200).send({ message: "Exercise completed and recorded" });
         return;
    } catch (error) {
        res.status(500).send(error.message);
        return;
    }
}


