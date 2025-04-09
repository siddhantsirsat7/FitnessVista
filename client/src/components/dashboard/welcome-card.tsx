import { Button } from "@/components/ui/button";

interface WelcomeCardProps {
  name: string;
  activityPoints: number;
  onLogWorkout: () => void;
  onTrackWeight: () => void;
}

export function WelcomeCard({
  name,
  activityPoints,
  onLogWorkout,
  onTrackWeight,
}: WelcomeCardProps) {
  return (
    <div className="mb-6 bg-gradient-to-r from-primary to-primary-700 rounded-xl text-white p-6 shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8">
          <h2 className="font-bold text-xl mb-2">Welcome back, {name}!</h2>
          <p className="text-primary-100 mb-4">
            You're making great progress on your fitness journey. Keep it up!
          </p>
          <div className="flex flex-wrap gap-3 mt-4">
            <Button
              onClick={onLogWorkout}
              className="bg-white text-primary hover:bg-primary-50 px-4 py-2 rounded-full text-sm font-medium"
              variant="outline"
            >
              <i className="ri-add-line mr-1"></i> Log Workout
            </Button>
            <Button
              onClick={onTrackWeight}
              className="bg-primary-800 bg-opacity-50 text-white hover:bg-opacity-70 px-4 py-2 rounded-full text-sm font-medium"
              variant="ghost"
            >
              <i className="ri-scale-line mr-1"></i> Track Weight
            </Button>
          </div>
        </div>
        <div className="md:col-span-4 flex items-center justify-center md:justify-end">
          <div className="text-center">
            <div className="inline-flex items-center justify-center rounded-full bg-primary-800 bg-opacity-50 p-4 mb-2">
              <i className="ri-fire-line text-3xl text-amber-500"></i>
            </div>
            <div className="text-3xl font-bold">{activityPoints.toLocaleString()}</div>
            <div className="text-primary-100 text-sm">Weekly Activity Points</div>
          </div>
        </div>
      </div>
    </div>
  );
}
