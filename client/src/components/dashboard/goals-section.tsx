import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GoalProgress } from "@/components/ui/goal-progress";
import { Goal } from "@shared/schema";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";

interface GoalsSectionProps {
  userId: number;
  onAddGoal: () => void;
}

export function GoalsSection({ userId, onAddGoal }: GoalsSectionProps) {
  const [location, navigate] = useLocation();
  
  const { data: goals = [], isLoading } = useQuery({
    queryKey: ['/api/goals/' + userId],
  });

  function getTimeRemaining(deadline: string | null) {
    if (!deadline) return "Weekly goal";
    
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const diffTime = Math.abs(deadlineDate.getTime() - now.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays === 1 
      ? "1 day remaining" 
      : `${diffDays} days remaining`;
  }

  function getIconType(type: string) {
    switch (type) {
      case "running": return "ri-run-line";
      case "weight": return "ri-scale-line";
      case "frequency": return "ri-calendar-check-line";
      default: return "ri-award-line";
    }
  }

  function getIconColor(type: string) {
    switch (type) {
      case "running": return "primary";
      case "weight": return "warning";
      case "frequency": return "success";
      default: return "primary";
    }
  }

  function calculateProgress(goal: Goal) {
    if (goal.target === goal.current) return 100;
    
    // For goals where lower is better (like weight loss)
    if (goal.type === "weight") {
      const initialValue = goal.target < goal.current 
        ? goal.current + (goal.current - goal.target)
        : goal.current;
      
      const range = Math.abs(initialValue - goal.target);
      const progress = Math.abs(initialValue - goal.current);
      return Math.min(100, Math.round((progress / range) * 100));
    }
    
    // For goals where higher is better
    const progress = (goal.current / goal.target) * 100;
    return Math.min(100, Math.round(progress));
  }

  return (
    <Card>
      <CardHeader className="flex justify-between items-center pb-2">
        <h3 className="font-semibold text-gray-800">Current Goals</h3>
        <Button 
          variant="link" 
          className="text-primary hover:text-primary/80 text-sm font-medium p-0"
          onClick={() => navigate("/goals")}
        >
          View All
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-8 text-center text-gray-500">Loading goals...</div>
        ) : goals.length === 0 ? (
          <div className="py-8 text-center text-gray-500">No goals set yet. Add your first goal!</div>
        ) : (
          goals.slice(0, 3).map((goal: Goal) => (
            <GoalProgress
              key={goal.id}
              title={goal.title}
              timeRemaining={getTimeRemaining(goal.deadline)}
              progress={calculateProgress(goal)}
              iconType={getIconType(goal.type)}
              iconColor={getIconColor(goal.type) as any}
            />
          ))
        )}
        
        <div className="mt-6 text-center">
          <Button 
            variant="outline"
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium w-full md:w-auto"
            onClick={onAddGoal}
          >
            <i className="ri-add-line mr-1"></i> Add New Goal
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
