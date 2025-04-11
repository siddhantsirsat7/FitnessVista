import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name"),
  profileImage: text("profile_image"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  displayName: true,
  profileImage: true,
});

// Workouts table
export const workouts = pgTable("workouts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(), // running, cycling, strength, etc.
  name: text("name").notNull(),
  date: timestamp("date").notNull(),
  duration: integer("duration").notNull(), // in minutes
  distance: real("distance"), // in miles
  calories: integer("calories"),
  notes: text("notes"),
});

export const insertWorkoutSchema = createInsertSchema(workouts).omit({
  id: true,
});

// Measurements table
export const measurements = pgTable("measurements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  date: timestamp("date").notNull(),
  weight: real("weight"), // in pounds
  bodyFat: real("body_fat"), // percentage
  chest: real("chest"), // in inches
  waist: real("waist"), // in inches
  hips: real("hips"), // in inches
  arms: real("arms"), // in inches
  thighs: real("thighs"), // in inches
  notes: text("notes"),
});

export const insertMeasurementSchema = createInsertSchema(measurements).omit({
  id: true,
});

// Goals table
export const goals = pgTable("goals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull(), // weight, workout, measurement, etc.
  target: real("target").notNull(), // target value (e.g. weight in lbs, distance in miles)
  current: real("current").notNull(), // current progress value
  unit: text("unit").notNull(), // lbs, miles, %, etc.
  deadline: timestamp("deadline"), // deadline for the goal
  completed: boolean("completed").default(false),
  createdAt: timestamp("created_at").notNull(),
});

export const insertGoalSchema = createInsertSchema(goals).omit({
  id: true,
});

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  workouts: many(workouts),
  measurements: many(measurements),
  goals: many(goals),
}));

export const workoutsRelations = relations(workouts, ({ one }) => ({
  user: one(users, {
    fields: [workouts.userId],
    references: [users.id]
  }),
}));

export const measurementsRelations = relations(measurements, ({ one }) => ({
  user: one(users, {
    fields: [measurements.userId],
    references: [users.id]
  }),
}));

export const goalsRelations = relations(goals, ({ one }) => ({
  user: one(users, {
    fields: [goals.userId],
    references: [users.id]
  }),
}));

// Define types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Workout = typeof workouts.$inferSelect;
export type InsertWorkout = z.infer<typeof insertWorkoutSchema>;

export type Measurement = typeof measurements.$inferSelect;
export type InsertMeasurement = z.infer<typeof insertMeasurementSchema>;

export type Goal = typeof goals.$inferSelect;
export type InsertGoal = z.infer<typeof insertGoalSchema>;