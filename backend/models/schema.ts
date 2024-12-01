import { pgTable, bigint, varchar, smallint, real, timestamp, text, foreignKey, date, boolean } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const user = pgTable("User", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	userId: bigint("user_id", { mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "User_id_seq", startWith: 1, increment: 1, minValue: 1 }),
	username: varchar().notNull(),
	email: varchar().notNull(),
	password: varchar().notNull(),
	age: smallint().notNull(),
	gender: varchar().notNull(),
	height: real().notNull(),
	weight: real().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const workout = pgTable("Workout", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	workoutId: bigint("workout_id", { mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "Workout_id_seq", startWith: 1, increment: 1, minValue: 1}),
	name: varchar().notNull(),
	category: varchar().notNull(),
	description: text().notNull(),
	equipment: varchar(),
	primaryMuscle: varchar("primary_muscle").notNull(),
	secondaryMuscle: varchar("secondary_muscle").notNull(),
	difficulty: varchar().notNull(),
	caloriesPerMinutes: real("calories_per_minutes").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const workoutPlans = pgTable("Workout Plans", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	planId: bigint("plan_id", { mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "Workout Plans_plan_id_seq", startWith: 1, increment: 1, minValue: 1}),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	userId: bigint("user_id", { mode: "number" }).notNull(),
	name: varchar().notNull(),
	level: varchar().notNull(),
	durationDays: smallint("duration_days").notNull(),
	goal: varchar().notNull(),
	progress: smallint().notNull(),
	startDate: date("start_date").notNull(),
	endDate: date("end_date").notNull(),
	completed: boolean().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => {
	return {
		workoutPlansUserIdFkey: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.userId],
			name: "Workout Plans_user_id_fkey"
		}),
	}
});

export const userWorkoutExercise = pgTable("User Workout Exercise", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	workoutExerciseId: bigint("workout_exercise_id", { mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "User Workout Exercise_workout_exercise_id_seq", startWith: 1, increment: 1, minValue: 1}),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	planId: bigint("plan_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	workoutId: bigint("workout_id", { mode: "number" }).notNull(),
	sets: smallint(),
	reps: smallint(),
	durationMin: real("duration_min"),
	restTimeSec: smallint("rest_time_sec"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => {
	return {
		userWorkoutExercisePlanIdFkey: foreignKey({
			columns: [table.planId],
			foreignColumns: [workoutPlans.planId],
			name: "User Workout Exercise_plan_id_fkey"
		}),
		userWorkoutExerciseWorkoutIdFkey: foreignKey({
			columns: [table.workoutId],
			foreignColumns: [workout.workoutId],
			name: "User Workout Exercise_workout_id_fkey"
		}),
	}
});

export const records = pgTable("Records", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	recordId: bigint("record_id", { mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "Records_record_id_seq", startWith: 1, increment: 1, minValue: 1}),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	userId: bigint("user_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	workoutId: bigint("workout_id", { mode: "number" }).notNull(),
	date: date().notNull(),
	setsCompleted: smallint("sets_completed"),
	repsCompleted: smallint("reps_completed"),
	durationMin: real("duration_min"),
	caloriesBurned: real("calories_burned"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => {
	return {
		recordsUserIdFkey: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.userId],
			name: "Records_user_id_fkey"
		}),
		recordsWorkoutIdFkey: foreignKey({
			columns: [table.workoutId],
			foreignColumns: [workout.workoutId],
			name: "Records_workout_id_fkey"
		}),
	}
});
