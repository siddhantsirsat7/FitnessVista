import { db } from "./db";
import { users, workouts, measurements, goals } from "@shared/schema";

// Seed function to populate the database with initial data
async function seedDatabase() {
  try {
    console.log("Starting database seeding...");

    // Check if users table is empty
    const result = await db.execute(db.select().from(users));
    if (result.rows.length === 0) {
      console.log("Seeding users table...");
      
      // Add a default test user
      const [user] = await db.insert(users).values({
        username: "alex",
        password: "password",
        displayName: "Alex Johnson",
        profileImage: "",
      }).returning();
      
      const userId = user.id;
      
      console.log(`Created user with ID: ${userId}`);
      
      // Add sample workouts
      console.log("Seeding workouts table...");
      await db.insert(workouts).values([
        {
          userId,
          type: "running",
          name: "Morning Run",
          date: new Date(),
          duration: 27,
          distance: 3.2,
          calories: 320,
          notes: "Felt good today",
        },
        {
          userId,
          type: "cycling",
          name: "Cycling Session",
          date: new Date(Date.now() - 86400000), // Yesterday
          duration: 45,
          distance: 8.5,
          calories: 450,
          notes: "Hilly route",
        }
      ]);
      
      // Add sample measurements
      console.log("Seeding measurements table...");
      await db.insert(measurements).values({
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
      console.log("Seeding goals table...");
      await db.insert(goals).values([
        {
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
        },
        {
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
        },
        {
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
        }
      ]);
      
      console.log("Database seeding completed successfully!");
    } else {
      console.log("Database already has users, skipping seeding.");
    }
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

export { seedDatabase };