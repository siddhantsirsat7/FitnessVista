import React from "react";
import { Progress } from "@/components/ui/progress";

interface GoalProgressProps {
  title: string;
  timeRemaining: string;
  progress: number;
  iconType: string;
  iconColor: "primary" | "warning" | "success";
}

export function GoalProgress({
  title,
  timeRemaining,
  progress,
  iconType,
  iconColor,
}: GoalProgressProps) {
  const getIconBackground = () => {
    if (iconColor === "primary") return "bg-primary/10";
    if (iconColor === "warning") return "bg-amber-500/20";
    if (iconColor === "success") return "bg-emerald-500/20";
    return "bg-gray-100";
  };

  const getIconColor = () => {
    if (iconColor === "primary") return "text-primary";
    if (iconColor === "warning") return "text-amber-500";
    if (iconColor === "success") return "text-emerald-500";
    return "text-gray-500";
  };

  const getProgressColor = () => {
    if (iconColor === "primary") return "bg-primary";
    if (iconColor === "warning") return "bg-amber-500";
    if (iconColor === "success") return "bg-emerald-500";
    return "bg-gray-500";
  };

  const getTextColor = () => {
    if (progress < 50) return "text-amber-500";
    if (progress >= 50 && progress < 80) return "text-amber-500";
    return "text-emerald-500";
  };

  return (
    <div className="mb-6 border-b border-gray-100 pb-6 last:border-0 last:mb-0 last:pb-0">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <div className={`${getIconBackground()} p-2 rounded-md mr-3`}>
            <i className={`${iconType} ${getIconColor()}`}></i>
          </div>
          <div>
            <h4 className="font-medium text-gray-800">{title}</h4>
            <p className="text-sm text-gray-500">{timeRemaining}</p>
          </div>
        </div>
        <span className={`text-sm font-medium ${getTextColor()}`}>{progress}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
        <div
          className={`${getProgressColor()} h-2 rounded-full`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}
