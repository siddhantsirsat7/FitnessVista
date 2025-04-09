import { Progress } from "@/components/ui/progress";

interface MetricCardProps {
  title: string;
  value: string | number;
  changeType: "increase" | "decrease" | "none";
  changeValue: string;
  changeLabel: string;
  icon: string;
  iconColor: string;
  progress: number;
  goal: string;
}

export function MetricCard({
  title,
  value,
  changeType,
  changeValue,
  changeLabel,
  icon,
  iconColor,
  progress,
  goal,
}: MetricCardProps) {
  const getChangeColor = () => {
    if (changeType === 'increase') return 'text-green-500';
    if (changeType === 'decrease') return 'text-red-500';
    return 'text-gray-500';
  };

  const getChangeIcon = () => {
    if (changeType === 'increase') return 'ri-arrow-up-s-line';
    if (changeType === 'decrease') return 'ri-arrow-down-s-line';
    return '';
  };

  const getBackgroundColor = () => {
    if (iconColor === 'primary') return 'bg-primary/10';
    if (iconColor === 'warning') return 'bg-amber-500/20';
    if (iconColor === 'success') return 'bg-emerald-500/20';
    return 'bg-gray-100';
  };

  const getIconColor = () => {
    if (iconColor === 'primary') return 'text-primary';
    if (iconColor === 'warning') return 'text-amber-500';
    if (iconColor === 'success') return 'text-emerald-500';
    return 'text-gray-500';
  };

  const getProgressColor = () => {
    if (iconColor === 'primary') return 'bg-primary';
    if (iconColor === 'warning') return 'bg-amber-500';
    if (iconColor === 'success') return 'bg-emerald-500';
    return 'bg-gray-500';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3>
          <div className="flex items-center mt-1 text-sm">
            <span className={`${getChangeColor()} flex items-center`}>
              <i className={getChangeIcon()}></i> {changeValue}
            </span>
            <span className="text-gray-500 ml-2">{changeLabel}</span>
          </div>
        </div>
        <div className={`${getBackgroundColor()} p-3 rounded-lg`}>
          <i className={`${icon} text-xl ${getIconColor()}`}></i>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`${getProgressColor()} h-2 rounded-full`} 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-2">{progress}% of daily goal ({goal})</p>
      </div>
    </div>
  );
}
