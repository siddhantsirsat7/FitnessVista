import {
  users, type User, type InsertUser,
  workouts, type Workout, type InsertWorkout,
  measurements, type Measurement, type InsertMeasurement,
  goals, type Goal, type InsertGoal
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

// Storage interface
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Workout methods
  getWorkouts(userId: number): Promise<Workout[]>;
  getWorkout(id: number): Promise<Workout | undefined>;
  createWorkout(workout: InsertWorkout): Promise<Workout>;
  updateWorkout(id: number, workout: Partial<InsertWorkout>): Promise<Workout | undefined>;
  deleteWorkout(id: number): Promise<boolean>;
  
  // Measurement methods
  getMeasurements(userId: number): Promise<Measurement[]>;
  getMeasurement(id: number): Promise<Measurement | undefined>;
  getLatestMeasurement(userId: number): Promise<Measurement | undefined>;
  createMeasurement(measurement: InsertMeasurement): Promise<Measurement>;
  updateMeasurement(id: number, measurement: Partial<InsertMeasurement>): Promise<Measurement | undefined>;
  deleteMeasurement(id: number): Promise<boolean>;
  
  // Goal methods
  getGoals(userId: number): Promise<Goal[]>;
  getGoal(id: number): Promise<Goal | undefined>;
  createGoal(goal: InsertGoal): Promise<Goal>;
  updateGoal(id: number, goal: Partial<InsertGoal>): Promise<Goal | undefined>;
  deleteGoal(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Workout methods
  async getWorkouts(userId: number): Promise<Workout[]> {
    return await db
      .select()
      .from(workouts)
      .where(eq(workouts.userId, userId))
      .orderBy(desc(workouts.date));
  }

  async getWorkout(id: number): Promise<Workout | undefined> {
    const [workout] = await db.select().from(workouts).where(eq(workouts.id, id));
    return workout;
  }

  async createWorkout(insertWorkout: InsertWorkout): Promise<Workout> {
    const [workout] = await db.insert(workouts).values(insertWorkout).returning();
    return workout;
  }

  async updateWorkout(id: number, workout: Partial<InsertWorkout>): Promise<Workout | undefined> {
    const [updatedWorkout] = await db
      .update(workouts)
      .set(workout)
      .where(eq(workouts.id, id))
      .returning();
    return updatedWorkout;
  }

  async deleteWorkout(id: number): Promise<boolean> {
    const result = await db.delete(workouts).where(eq(workouts.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Measurement methods
  async getMeasurements(userId: number): Promise<Measurement[]> {
    return await db
      .select()
      .from(measurements)
      .where(eq(measurements.userId, userId))
      .orderBy(desc(measurements.date));
  }

  async getMeasurement(id: number): Promise<Measurement | undefined> {
    const [measurement] = await db.select().from(measurements).where(eq(measurements.id, id));
    return measurement;
  }
  
  async getLatestMeasurement(userId: number): Promise<Measurement | undefined> {
    const [measurement] = await db
      .select()
      .from(measurements)
      .where(eq(measurements.userId, userId))
      .orderBy(desc(measurements.date))
      .limit(1);
    return measurement;
  }

  async createMeasurement(insertMeasurement: InsertMeasurement): Promise<Measurement> {
    const [measurement] = await db.insert(measurements).values(insertMeasurement).returning();
    return measurement;
  }

  async updateMeasurement(id: number, measurement: Partial<InsertMeasurement>): Promise<Measurement | undefined> {
    const [updatedMeasurement] = await db
      .update(measurements)
      .set(measurement)
      .where(eq(measurements.id, id))
      .returning();
    return updatedMeasurement;
  }

  async deleteMeasurement(id: number): Promise<boolean> {
    const result = await db.delete(measurements).where(eq(measurements.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Goal methods
  async getGoals(userId: number): Promise<Goal[]> {
    return await db
      .select()
      .from(goals)
      .where(eq(goals.userId, userId))
      .orderBy(goals.createdAt);
  }

  async getGoal(id: number): Promise<Goal | undefined> {
    const [goal] = await db.select().from(goals).where(eq(goals.id, id));
    return goal;
  }

  async createGoal(insertGoal: InsertGoal): Promise<Goal> {
    const [goal] = await db.insert(goals).values(insertGoal).returning();
    return goal;
  }

  async updateGoal(id: number, goal: Partial<InsertGoal>): Promise<Goal | undefined> {
    const [updatedGoal] = await db
      .update(goals)
      .set(goal)
      .where(eq(goals.id, id))
      .returning();
    return updatedGoal;
  }

  async deleteGoal(id: number): Promise<boolean> {
    const result = await db.delete(goals).where(eq(goals.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }
}

export const storage = new DatabaseStorage();
