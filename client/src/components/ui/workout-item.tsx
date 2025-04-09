import * as React from "react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface WorkoutItemProps {
  type: string;
  name: string;
  date: Date;
  metrics: {
    value: string;
    label: string;
  }[];
}

export function WorkoutItem({ type, name, date, metrics }: WorkoutItemProps) {
  const getWorkoutIcon = () => {
    switch (type) {
      case "running":
        return "ri-run-line";
      case "cycling":
        return "ri-bike-line";
      case "swimming":
        return "ri-water-flash-line";
      case "hiit":
        return "ri-heart-pulse-line";
      case "strength":
        return "ri-boxing-line";
      default:
        return "ri-heart-pulse-line";
    }
  };

  const getWorkoutColor = () => {
    switch (type) {
      case "running":
        return "bg-primary";
      case "cycling":
        return "bg-emerald-500";
      case "swimming":
        return "bg-cyan-500";
      case "hiit":
        return "bg-amber-500";
      case "strength":
        return "bg-primary/20 text-primary";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="flex items-center mb-4 pb-4 border-b border-gray-100 last:border-0 last:mb-0 last:pb-0">
      <div className={cn("text-white p-3 rounded-lg mr-4", getWorkoutColor())}>
        <i className={cn(getWorkoutIcon(), "text-xl")}></i>
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-medium text-gray-800">{name}</h4>
            <p className="text-sm text-gray-500">
              {format(new Date(date), "PPP, p")}
            </p>
          </div>
          <div className="text-right">
            {metrics.map((metric, index) => (
              <React.Fragment key={index}>
                <p className="text-sm font-medium text-gray-800">{metric.value}</p>
                {index === 0 && <p className="text-xs text-gray-500">{metric.label}</p>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
