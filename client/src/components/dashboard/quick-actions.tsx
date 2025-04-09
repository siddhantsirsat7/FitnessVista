import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { QuickActionButton } from "@/components/ui/quick-action-button";

interface QuickActionsProps {
  onTrackWorkout: () => void;
  onLogMeal: () => void;
  onTrackWeight: () => void;
  onMeasurements: () => void;
  onTrackWater: () => void;
  onSetGoals: () => void;
}

export function QuickActions({
  onTrackWorkout,
  onLogMeal,
  onTrackWeight,
  onMeasurements,
  onTrackWater,
  onSetGoals,
}: QuickActionsProps) {
  return (
    <Card className="mb-8">
      <CardHeader className="pb-2">
        <h3 className="font-semibold text-gray-800">Quick Actions</h3>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 text-center">
          <QuickActionButton
            icon="ri-run-line"
            label="Track Workout"
            iconColor="primary"
            onClick={onTrackWorkout}
          />
          
          <QuickActionButton
            icon="ri-restaurant-line"
            label="Log Meal"
            iconColor="success"
            onClick={onLogMeal}
          />
          
          <QuickActionButton
            icon="ri-scale-line"
            label="Log Weight"
            iconColor="warning"
            onClick={onTrackWeight}
          />
          
          <QuickActionButton
            icon="ri-ruler-line"
            label="Measurements"
            iconColor="primary"
            onClick={onMeasurements}
          />
          
          <QuickActionButton
            icon="ri-water-flash-line"
            label="Track Water"
            iconColor="primary"
            onClick={onTrackWater}
          />
          
          <QuickActionButton
            icon="ri-flag-line"
            label="Set Goals"
            iconColor="primary"
            onClick={onSetGoals}
          />
        </div>
      </CardContent>
    </Card>
  );
}
