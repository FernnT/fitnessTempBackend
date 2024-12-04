import { Request,Response } from "express";
import {db} from '../models/db';
import { exercises } from "../models/schema";

export const getExercises = async (req: Request, res: Response) => {
    try {
        const result = await db.select().from(exercises);
        return res.status(200).send(result)
         
    } catch (error) {
        return  res.status(500).send(error.message);
        
    }
}

export const deleteExercise = (req: Request, res: Response) => {

}

export const getExerciseByID = (req: Request, res: Response) => {  
    
    }