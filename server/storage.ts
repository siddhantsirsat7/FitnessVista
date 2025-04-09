import {
  users, type User, type InsertUser,
  workouts, type Workout, type InsertWorkout,
  measurements, type Measurement, type InsertMeasurement,
  goals, type Goal, type InsertGoal
} from "@shared/schema";

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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private workouts: Map<number, Workout>;
  private measurements: Map<number, Measurement>;
  private goals: Map<number, Goal>;
  
  userCurrentId: number;
  workoutCurrentId: number;
  measurementCurrentId: number;
  goalCurrentId: number;

  constructor() {
    this.users = new Map();
    this.workouts = new Map();
    this.measurements = new Map();
    this.goals = new Map();
    
    this.userCurrentId = 1;
    this.workoutCurrentId = 1;
    this.measurementCurrentId = 1;
    this.goalCurrentId = 1;
    
    // Add a default user for testing
    this.createUser({
      username: "alex",
      password: "password",
      displayName: "Alex Johnson",
      profileImage: "",
    });
    
    // Add some sample data for the default user
    const userId = 1;
    
    // Add sample workouts
    this.createWorkout({
      userId,
      type: "running",
      name: "Morning Run",
      date: new Date(),
      duration: 27,
      distance: 3.2,
      calories: 320,
      notes: "Felt good today",
    });
    
    this.createWorkout({
      userId,
      type: "cycling",
      name: "Cycling Session",
      date: new Date(Date.now() - 86400000), // Yesterday
      duration: 45,
      distance: 8.5,
      calories: 450,
      notes: "Hilly route",
    });
    
    // Add sample measurements
    this.createMeasurement({
      userId,
      date: new Date(),
      weight: 172,
      bodyFat: 18,
      chest: 42,
      waist: 34,
      hips: 40,
      arms: 14,
      thighs: 22,
      notes: "Morning measurement",
    });
    
    // Add sample goals
    this.createGoal({
      userId,
      title: "Run 5K under 25 minutes",
      description: "Improve running speed",
      type: "running",
      target: 25,
      current: 27,
      unit: "minutes",
      deadline: new Date(Date.now() + 7 * 86400000), // 7 days from now
      completed: false,
      createdAt: new Date(),
    });
    
    this.createGoal({
      userId,
      title: "Lose 10 pounds",
      description: "Weight loss goal",
      type: "weight",
      target: 165,
      current: 172,
      unit: "lbs",
      deadline: new Date(Date.now() + 25 * 86400000), // 25 days from now
      completed: false,
      createdAt: new Date(),
    });
    
    this.createGoal({
      userId,
      title: "Workout 5 days a week",
      description: "Consistency goal",
      type: "frequency",
      target: 5,
      current: 3,
      unit: "days",
      deadline: null, // Recurring goal
      completed: false,
      createdAt: new Date(),
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Workout methods
  async getWorkouts(userId: number): Promise<Workout[]> {
    return Array.from(this.workouts.values())
      .filter(workout => workout.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async getWorkout(id: number): Promise<Workout | undefined> {
    return this.workouts.get(id);
  }

  async createWorkout(insertWorkout: InsertWorkout): Promise<Workout> {
    const id = this.workoutCurrentId++;
    const workout: Workout = { ...insertWorkout, id };
    this.workouts.set(id, workout);
    return workout;
  }

  async updateWorkout(id: number, workout: Partial<InsertWorkout>): Promise<Workout | undefined> {
    const existingWorkout = await this.getWorkout(id);
    if (!existingWorkout) return undefined;

    const updatedWorkout = { ...existingWorkout, ...workout };
    this.workouts.set(id, updatedWorkout);
    return updatedWorkout;
  }

  async deleteWorkout(id: number): Promise<boolean> {
    return this.workouts.delete(id);
  }

  // Measurement methods
  async getMeasurements(userId: number): Promise<Measurement[]> {
    return Array.from(this.measurements.values())
      .filter(measurement => measurement.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async getMeasurement(id: number): Promise<Measurement | undefined> {
    return this.measurements.get(id);
  }
  
  async getLatestMeasurement(userId: number): Promise<Measurement | undefined> {
    return Array.from(this.measurements.values())
      .filter(measurement => measurement.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  }

  async createMeasurement(insertMeasurement: InsertMeasurement): Promise<Measurement> {
    const id = this.measurementCurrentId++;
    const measurement: Measurement = { ...insertMeasurement, id };
    this.measurements.set(id, measurement);
    return measurement;
  }

  async updateMeasurement(id: number, measurement: Partial<InsertMeasurement>): Promise<Measurement | undefined> {
    const existingMeasurement = await this.getMeasurement(id);
    if (!existingMeasurement) return undefined;

    const updatedMeasurement = { ...existingMeasurement, ...measurement };
    this.measurements.set(id, updatedMeasurement);
    return updatedMeasurement;
  }

  async deleteMeasurement(id: number): Promise<boolean> {
    return this.measurements.delete(id);
  }

  // Goal methods
  async getGoals(userId: number): Promise<Goal[]> {
    return Array.from(this.goals.values())
      .filter(goal => goal.userId === userId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  async getGoal(id: number): Promise<Goal | undefined> {
    return this.goals.get(id);
  }

  async createGoal(insertGoal: InsertGoal): Promise<Goal> {
    const id = this.goalCurrentId++;
    const goal: Goal = { ...insertGoal, id };
    this.goals.set(id, goal);
    return goal;
  }

  async updateGoal(id: number, goal: Partial<InsertGoal>): Promise<Goal | undefined> {
    const existingGoal = await this.getGoal(id);
    if (!existingGoal) return undefined;

    const updatedGoal = { ...existingGoal, ...goal };
    this.goals.set(id, updatedGoal);
    return updatedGoal;
  }

  async deleteGoal(id: number): Promise<boolean> {
    return this.goals.delete(id);
  }
}

export const storage = new MemStorage();
