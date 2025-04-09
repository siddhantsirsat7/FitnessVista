import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { GoalForm } from "@/components/goals/goal-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GoalProgress } from "@/components/ui/goal-progress";
import { Progress } from "@/components/ui/progress";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Goal } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Goals() {
  const userId = 1; // Default user ID
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("active");
  const { toast } = useToast();

  const { data: goals = [], isLoading } = useQuery({
    queryKey: ['/api/goals/' + userId],
  });

  const handleDeleteGoal = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this goal?")) {
      try {
        await apiRequest("DELETE", `/api/goals/${id}`, undefined);
        toast({
          title: "Goal deleted",
          description: "The goal has been successfully deleted.",
          variant: "default",
        });
        queryClient.invalidateQueries({ queryKey: ['/api/goals/' + userId] });
      } catch (error) {
        toast({
          title: "Error deleting goal",
          description: error instanceof Error ? error.message : "An unknown error occurred",
          variant: "destructive",
        });
      }
    }
  };

  const handleCompleteGoal = async (goal: Goal) => {
    try {
      await apiRequest("PUT", `/api/goals/${goal.id}`, {
        ...goal,
        completed: true
      });
      toast({
        title: "Goal completed",
        description: "Congratulations on achieving your goal!",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/goals/' + userId] });
    } catch (error) {
      toast({
        title: "Error updating goal",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  const filteredGoals = goals.filter((goal: Goal) => {
    if (activeTab === "active") return !goal.completed;
    if (activeTab === "completed") return goal.completed;
    return true;
  });

  function getTimeRemaining(deadline: string | null) {
    if (!deadline) return "Ongoing goal";
    
    const deadlineDate = new Date(deadline);
    const now = new Date();
    
    if (deadlineDate < now) return "Deadline passed";
    
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
    <>
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">Goals</h1>
            <p className="text-gray-500">Set and track your fitness goals</p>
          </div>
          <Button 
            className="mt-4 sm:mt-0" 
            onClick={() => setIsDialogOpen(true)}
          >
            <i className="ri-add-line mr-1"></i> Add New Goal
          </Button>
        </div>
        
        <Card className="mb-6">
          <CardContent className="p-4">
            <Tabs 
              defaultValue="active" 
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="active">Active Goals</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="all">All Goals</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>
        
        {isLoading ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-500">Loading goals...</p>
          </div>
        ) : filteredGoals.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-6 mb-4">
              <i className="ri-flag-line text-4xl text-primary"></i>
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              {activeTab === "active" 
                ? "No active goals" 
                : activeTab === "completed" 
                  ? "No completed goals yet" 
                  : "No goals found"}
            </h3>
            <p className="text-gray-500 mb-6">
              {activeTab === "active" 
                ? "Set new goals to keep yourself motivated" 
                : activeTab === "completed" 
                  ? "Complete your goals to see them here" 
                  : "Start by setting a fitness goal for yourself"}
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <i className="ri-add-line mr-1"></i> Create Your First Goal
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredGoals.map((goal: Goal) => (
              <Card key={goal.id} className="relative">
                <CardContent className="p-6">
                  <div className="flex items-start">
                    <div className={`p-3 rounded-lg mr-4 ${
                      goal.type === "weight" 
                        ? "bg-amber-500/20" 
                        : goal.type === "frequency" 
                          ? "bg-emerald-500/20" 
                          : "bg-primary/10"
                    }`}>
                      <i className={`${getIconType(goal.type)} text-xl ${
                        goal.type === "weight" 
                          ? "text-amber-500" 
                          : goal.type === "frequency" 
                            ? "text-emerald-500" 
                            : "text-primary"
                      }`}></i>
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">{goal.title}</h3>
                          <p className="text-sm text-gray-500">{getTimeRemaining(goal.deadline)}</p>
                        </div>
                        <div className="mt-2 md:mt-0 flex items-center">
                          <span className={`text-sm font-medium ${
                            calculateProgress(goal) < 50 
                              ? "text-amber-500" 
                              : calculateProgress(goal) >= 80 
                                ? "text-emerald-500" 
                                : "text-amber-500"
                          }`}>
                            {calculateProgress(goal)}%
                          </span>
                          <div className="flex space-x-2 ml-4">
                            {!goal.completed && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-emerald-600 border-emerald-600 hover:bg-emerald-50"
                                onClick={() => handleCompleteGoal(goal)}
                              >
                                <i className="ri-check-line mr-1"></i> Complete
                              </Button>
                            )}
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-500 hover:bg-red-50 hover:text-red-600"
                              onClick={() => handleDeleteGoal(goal.id)}
                            >
                              <i className="ri-delete-bin-line mr-1"></i>
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        {goal.description && (
                          <p className="text-gray-600 text-sm mb-3">{goal.description}</p>
                        )}
                        
                        <div className="bg-gray-100 p-3 rounded-md mb-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium">Progress</span>
                            <span>{goal.current} / {goal.target} {goal.unit}</span>
                          </div>
                          <Progress 
                            value={calculateProgress(goal)} 
                            className="h-2" 
                          />
                        </div>
                        
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>Created: {format(new Date(goal.createdAt), 'MMM d, yyyy')}</span>
                          {goal.deadline && (
                            <span>Deadline: {format(new Date(goal.deadline), 'MMM d, yyyy')}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <GoalForm 
            userId={userId} 
            onSuccess={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
