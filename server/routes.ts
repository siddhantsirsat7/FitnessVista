import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertWorkoutSchema, 
  insertMeasurementSchema, 
  insertGoalSchema
} from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.get("/api/user/:id", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    const user = await storage.getUser(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Don't return the password
    const { password, ...userWithoutPassword } = user;
    return res.json(userWithoutPassword);
  });

  // Workout routes
  app.get("/api/workouts/:userId", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    const workouts = await storage.getWorkouts(userId);
    return res.json(workouts);
  });

  app.get("/api/workouts/:userId/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const workout = await storage.getWorkout(id);
    
    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }
    
    return res.json(workout);
  });

  app.post("/api/workouts", async (req: Request, res: Response) => {
    try {
      const validatedData = insertWorkoutSchema.parse(req.body);
      const workout = await storage.createWorkout(validatedData);
      return res.status(201).json(workout);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      return res.status(400).json({ message: "Invalid workout data" });
    }
  });

  app.put("/api/workouts/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertWorkoutSchema.partial().parse(req.body);
      const workout = await storage.updateWorkout(id, validatedData);
      
      if (!workout) {
        return res.status(404).json({ message: "Workout not found" });
      }
      
      return res.json(workout);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      return res.status(400).json({ message: "Invalid workout data" });
    }
  });

  app.delete("/api/workouts/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const success = await storage.deleteWorkout(id);
    
    if (!success) {
      return res.status(404).json({ message: "Workout not found" });
    }
    
    return res.status(204).end();
  });

  // Measurement routes
  app.get("/api/measurements/:userId", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    const measurements = await storage.getMeasurements(userId);
    return res.json(measurements);
  });
  
  app.get("/api/measurements/:userId/latest", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    const measurement = await storage.getLatestMeasurement(userId);
    
    if (!measurement) {
      return res.status(404).json({ message: "No measurements found" });
    }
    
    return res.json(measurement);
  });

  app.get("/api/measurements/:userId/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const measurement = await storage.getMeasurement(id);
    
    if (!measurement) {
      return res.status(404).json({ message: "Measurement not found" });
    }
    
    return res.json(measurement);
  });

  app.post("/api/measurements", async (req: Request, res: Response) => {
    try {
      const validatedData = insertMeasurementSchema.parse(req.body);
      const measurement = await storage.createMeasurement(validatedData);
      return res.status(201).json(measurement);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      return res.status(400).json({ message: "Invalid measurement data" });
    }
  });

  app.put("/api/measurements/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertMeasurementSchema.partial().parse(req.body);
      const measurement = await storage.updateMeasurement(id, validatedData);
      
      if (!measurement) {
        return res.status(404).json({ message: "Measurement not found" });
      }
      
      return res.json(measurement);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      return res.status(400).json({ message: "Invalid measurement data" });
    }
  });

  app.delete("/api/measurements/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const success = await storage.deleteMeasurement(id);
    
    if (!success) {
      return res.status(404).json({ message: "Measurement not found" });
    }
    
    return res.status(204).end();
  });

  // Goal routes
  app.get("/api/goals/:userId", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    const goals = await storage.getGoals(userId);
    return res.json(goals);
  });

  app.get("/api/goals/:userId/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const goal = await storage.getGoal(id);
    
    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }
    
    return res.json(goal);
  });

  app.post("/api/goals", async (req: Request, res: Response) => {
    try {
      const validatedData = insertGoalSchema.parse(req.body);
      const goal = await storage.createGoal(validatedData);
      return res.status(201).json(goal);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      return res.status(400).json({ message: "Invalid goal data" });
    }
  });

  app.put("/api/goals/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertGoalSchema.partial().parse(req.body);
      const goal = await storage.updateGoal(id, validatedData);
      
      if (!goal) {
        return res.status(404).json({ message: "Goal not found" });
      }
      
      return res.json(goal);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      return res.status(400).json({ message: "Invalid goal data" });
    }
  });

  app.delete("/api/goals/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const success = await storage.deleteGoal(id);
    
    if (!success) {
      return res.status(404).json({ message: "Goal not found" });
    }
    
    return res.status(204).end();
  });

  const httpServer = createServer(app);
  return httpServer;
}
