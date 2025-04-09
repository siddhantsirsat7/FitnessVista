import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WorkoutItem } from "@/components/ui/workout-item";
import { Workout } from "@shared/schema";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

interface RecentWorkoutsProps {
  userId: number;
  onLogWorkout: () => void;
}

export function RecentWorkouts({ userId, onLogWorkout }: RecentWorkoutsProps) {
  const [location, navigate] = useLocation();
  
  const { data: workouts = [], isLoading } = useQuery({
    queryKey: ['/api/workouts/' + userId],
  });

  function formatWorkoutDate(date: string) {
    const workoutDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (workoutDate.toDateString() === today.toDateString()) {
      return `Today, ${format(workoutDate, 'h:mm a')}`;
    } else if (workoutDate.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${format(workoutDate, 'h:mm a')}`;
    } else {
      const daysAgo = Math.floor((today.getTime() - workoutDate.getTime()) / (1000 * 3600 * 24));
      if (daysAgo < 7) {
        return `${daysAgo} days ago, ${format(workoutDate, 'h:mm a')}`;
      } else {
        return format(workoutDate, 'PP, p');
      }
    }
  }

  return (
    <Card>
      <CardHeader className="flex justify-between items-center pb-2">
        <h3 className="font-semibold text-gray-800">Recent Workouts</h3>
        <Button 
          variant="link" 
          className="text-primary hover:text-primary/80 text-sm font-medium p-0"
          onClick={() => navigate("/workouts")}
        >
          View All
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-8 text-center text-gray-500">Loading workouts...</div>
        ) : workouts.length === 0 ? (
          <div className="py-8 text-center text-gray-500">No workouts logged yet. Start tracking your progress!</div>
        ) : (
          workouts.slice(0, 4).map((workout: Workout) => (
            <WorkoutItem
              key={workout.id}
              type={workout.type}
              name={workout.name}
              date={new Date(workout.date)}
              metrics={[
                {
                  value: workout.distance ? `${workout.distance} miles` : `${workout.calories} cal`,
                  label: workout.duration ? `${workout.duration} min` : "",
                },
              ]}
            />
          ))
        )}
        
        <div className="mt-6 text-center">
          <Button 
            className="w-full bg-primary hover:bg-primary/90"
            onClick={onLogWorkout}
          >
            <i className="ri-add-line mr-1"></i> Log New Workout
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
