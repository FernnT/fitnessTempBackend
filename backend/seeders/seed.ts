import { db } from '../models/db';
import { user, exercises, workoutPlans, userWorkoutExercise } from '../models/schema';
import { hash } from 'bcrypt';

async function seed() {
    try {
        // Seed users
        const hashedPassword = await hash('password123', 10);
        const users = await db.insert(user).values([
            {
                username: 'john_doe',
                email: 'john@example.com',
                password: hashedPassword,
                age: 25,
                gender: 'Male',
                height: 180,
                weight: 75,
            },
            {
                username: 'jane_doe',
                email: 'jane@example.com',
                password: hashedPassword,
                age: 28,
                gender: 'Female',
                height: 165,
                weight: 60,
            },
        ]).returning();

        // Seed exercises
        const exercisesList = await db.insert(exercises).values([
            {
                name: 'Bench Press',
                exerciseType: 'Equipment',
                description: 'Lie on bench and press barbell upward',
                bodyPart: 'Chest',
                primaryMuscle: 'Pectoralis Major',
                secondaryMuscle: 'Triceps',
                metValue: 6.0,
                intensity: 'High',
            },
            {
                name: 'Squats',
                exerciseType: 'Equipment',
                description: 'Stand with barbell on shoulders and squat down',
                bodyPart: 'Legs',
                primaryMuscle: 'Quadriceps',
                secondaryMuscle: 'Hamstrings',
                metValue: 7.0,
                intensity: 'High',
            },
            {
                name: 'Push-ups',
                exerciseType: 'Reps Only',
                description: 'Push body up from ground',
                bodyPart: 'Chest',
                primaryMuscle: 'Pectoralis Major',
                secondaryMuscle: 'Triceps',
                metValue: 4.0,
                intensity: 'Medium',
            },
        ]).returning();

        // Seed workout plans
        const workoutPlansList = await db.insert(workoutPlans).values([
            {
                userId: users[0].userId,
                name: 'Strength Training',
                intensity: 'High',
                durationDays: 30,
                goal: 'Build Muscle',
            },
            {
                userId: users[0].userId,
                name: 'Weight Loss',
                intensity: 'Medium',
                durationDays: 60,
                goal: 'Lose Weight',
            },
        ]).returning();

        // Seed user workout exercises
        await db.insert(userWorkoutExercise).values([
            {
                planId: workoutPlansList[0].planId,
                exerciseId: exercisesList[0].exerciseId,
                sets: 3,
                reps: 12,
                weight: 60,
                durationMin: 0,
                restTimePerSec: 60,
                day: 'Monday',
            },
            {
                planId: workoutPlansList[0].planId,
                exerciseId: exercisesList[1].exerciseId,
                sets: 4,
                reps: 10,
                weight: 80,
                durationMin: 0,
                restTimePerSec: 90,
                day: 'Wednesday',
            },
            {
                planId: workoutPlansList[1].planId,
                exerciseId: exercisesList[2].exerciseId,
                sets: 3,
                reps: 15,
                durationMin: 0,
                restTimePerSec: 45,
                day: 'Friday',
            },
        ]);

        console.log('Seeding completed successfully');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await db.end();
    }
}

seed(); 