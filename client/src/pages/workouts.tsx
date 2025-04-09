import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { WorkoutItem } from "@/components/ui/workout-item";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { WorkoutForm } from "@/components/workouts/workout-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Workout } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function Workouts() {
  const userId = 1; // Default user ID
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const { data: workouts = [], isLoading } = useQuery({
    queryKey: ['/api/workouts/' + userId],
  });

  const handleDeleteWorkout = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this workout?")) {
      try {
        await apiRequest("DELETE", `/api/workouts/${id}`, undefined);
        toast({
          title: "Workout deleted",
          description: "The workout has been successfully deleted.",
          variant: "default",
        });
        queryClient.invalidateQueries({ queryKey: ['/api/workouts/' + userId] });
      } catch (error) {
        toast({
          title: "Error deleting workout",
          description: error instanceof Error ? error.message : "An unknown error occurred",
          variant: "destructive",
        });
      }
    }
  };

  const filteredWorkouts = workouts.filter((workout: Workout) => {
    // Filter by type
    if (activeFilter !== "all" && workout.type !== activeFilter) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      return (
        workout.name.toLowerCase().includes(query) ||
        workout.type.toLowerCase().includes(query) ||
        (workout.notes && workout.notes.toLowerCase().includes(query))
      );
    }
    
    return true;
  });

  // Group workouts by month
  const groupedWorkouts: Record<string, Workout[]> = {};
  filteredWorkouts.forEach((workout: Workout) => {
    const date = new Date(workout.date);
    const monthYear = format(date, "MMMM yyyy");
    
    if (!groupedWorkouts[monthYear]) {
      groupedWorkouts[monthYear] = [];
    }
    
    groupedWorkouts[monthYear].push(workout);
  });

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">Workouts</h1>
            <p className="text-gray-500">Track and manage your fitness activities</p>
          </div>
          <Button 
            className="mt-4 sm:mt-0" 
            onClick={() => setIsDialogOpen(true)}
          >
            <i className="ri-add-line mr-1"></i> Log Workout
          </Button>
        </div>
        
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search workouts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="w-full md:w-auto">
                <Tabs 
                  defaultValue="all" 
                  value={activeFilter}
                  onValueChange={setActiveFilter}
                  className="w-full"
                >
                  <TabsList className="grid grid-cols-5 w-full">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="running">Running</TabsTrigger>
                    <TabsTrigger value="cycling">Cycling</TabsTrigger>
                    <TabsTrigger value="strength">Strength</TabsTrigger>
                    <TabsTrigger value="hiit">HIIT</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {isLoading ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-500">Loading workouts...</p>
          </div>
        ) : filteredWorkouts.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-6 mb-4">
              <i className="ri-run-line text-4xl text-primary"></i>
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No workouts found</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || activeFilter !== "all" 
                ? "Try adjusting your filters or search query" 
                : "Start tracking your fitness journey by logging your workouts"}
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <i className="ri-add-line mr-1"></i> Log Your First Workout
            </Button>
          </div>
        ) : (
          Object.keys(groupedWorkouts).map((monthYear) => (
            <Card key={monthYear} className="mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{monthYear}</CardTitle>
              </CardHeader>
              <CardContent>
                {groupedWorkouts[monthYear].map((workout: Workout) => (
                  <div key={workout.id} className="relative">
                    <WorkoutItem
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
                    <div className="absolute top-3 right-0 flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 rounded-full"
                        onClick={() => handleDeleteWorkout(workout.id)}
                      >
                        <i className="ri-delete-bin-line text-red-500"></i>
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))
        )}
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <WorkoutForm 
            userId={userId} 
            onSuccess={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
