import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { MetricsSummary } from "@/components/dashboard/metrics-summary";
import { WelcomeCard } from "@/components/dashboard/welcome-card";
import { ActivityChart } from "@/components/dashboard/activity-chart";
import { WeightChart } from "@/components/dashboard/weight-chart";
import { GoalsSection } from "@/components/dashboard/goals-section";
import { RecentWorkouts } from "@/components/dashboard/recent-workouts";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { WorkoutForm } from "@/components/workouts/workout-form";
import { MeasurementForm } from "@/components/measurements/measurement-form";
import { GoalForm } from "@/components/goals/goal-form";

export default function Dashboard() {
  const [location, navigate] = useLocation();
  const userId = 1; // Default user ID
  const [activeDialog, setActiveDialog] = useState<string | null>(null);
  
  const { data: latestMeasurement } = useQuery({
    queryKey: ['/api/measurements/' + userId + '/latest'],
  });
  
  // Mock data for charts that would come from server in real app
  const activityData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    values: [8243, 7500, 9200, 8100, 8600, 9800, 8493],
  };
  
  const weightData = {
    labels: ['Jan 1', 'Jan 8', 'Jan 15', 'Jan 22', 'Jan 29', 'Feb 5', 'Feb 12'],
    values: [180, 178, 176, 175, 173.5, 172.8, 172],
  };
  
  // Metrics data for the summary cards
  const metricsData = [
    {
      title: "Steps",
      value: "8,493",
      changeType: "increase" as const,
      changeValue: "12%",
      changeLabel: "vs yesterday",
      icon: "ri-footprint-line",
      iconColor: "primary",
      progress: 70,
      goal: "12,000",
    },
    {
      title: "Calories",
      value: "647",
      changeType: "decrease" as const,
      changeValue: "8%",
      changeLabel: "vs yesterday",
      icon: "ri-fire-line",
      iconColor: "warning",
      progress: 32,
      goal: "2,000",
    },
    {
      title: "Active Time",
      value: "43 min",
      changeType: "increase" as const,
      changeValue: "25%",
      changeLabel: "vs yesterday",
      icon: "ri-time-line",
      iconColor: "success",
      progress: 80,
      goal: "60 min",
    },
    {
      title: "Weight",
      value: latestMeasurement?.weight ? `${latestMeasurement.weight} lbs` : "-- lbs",
      changeType: "decrease" as const,
      changeValue: "0.8 lbs",
      changeLabel: "this week",
      icon: "ri-scale-line",
      iconColor: "primary",
      progress: 65,
      goal: "165 lbs",
    },
  ];
  
  // Event handlers
  const handleActivityPeriodChange = (period: string) => {
    console.log("Activity period changed:", period);
    // In a real app, this would fetch new data
  };
  
  const handleWeightPeriodChange = (period: string) => {
    console.log("Weight period changed:", period);
    // In a real app, this would fetch new data
  };
  
  const closeDialog = () => setActiveDialog(null);
  
  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <WelcomeCard
          name="Alex"
          activityPoints={1248}
          onLogWorkout={() => setActiveDialog("workout")}
          onTrackWeight={() => setActiveDialog("measurement")}
        />
        
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Today's Summary</h2>
        <MetricsSummary metrics={metricsData} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ActivityChart 
            data={activityData} 
            onPeriodChange={handleActivityPeriodChange} 
          />
          
          <WeightChart 
            data={weightData} 
            onPeriodChange={handleWeightPeriodChange} 
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <GoalsSection 
            userId={userId} 
            onAddGoal={() => setActiveDialog("goal")} 
          />
          
          <RecentWorkouts 
            userId={userId} 
            onLogWorkout={() => setActiveDialog("workout")} 
          />
        </div>
        
        <QuickActions
          onTrackWorkout={() => setActiveDialog("workout")}
          onLogMeal={() => navigate("/nutrition")}
          onTrackWeight={() => setActiveDialog("measurement")}
          onMeasurements={() => navigate("/measurements")}
          onTrackWater={() => navigate("/nutrition")}
          onSetGoals={() => setActiveDialog("goal")}
        />
      </div>
      
      {/* Dialogs for quick actions */}
      <Dialog open={activeDialog === "workout"} onOpenChange={closeDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <WorkoutForm 
            userId={userId} 
            onSuccess={closeDialog}
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={activeDialog === "measurement"} onOpenChange={closeDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <MeasurementForm 
            userId={userId} 
            onSuccess={closeDialog}
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={activeDialog === "goal"} onOpenChange={closeDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <GoalForm 
            userId={userId} 
            onSuccess={closeDialog}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
