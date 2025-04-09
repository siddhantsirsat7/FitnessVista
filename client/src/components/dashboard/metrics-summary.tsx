import { MetricCard } from "@/components/ui/metric-card";

interface MetricData {
  title: string;
  value: string;
  changeType: "increase" | "decrease" | "none";
  changeValue: string;
  changeLabel: string;
  icon: string;
  iconColor: string;
  progress: number;
  goal: string;
}

interface MetricsSummaryProps {
  metrics: MetricData[];
}

export function MetricsSummary({ metrics }: MetricsSummaryProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metrics.map((metric, index) => (
        <MetricCard
          key={index}
          title={metric.title}
          value={metric.value}
          changeType={metric.changeType}
          changeValue={metric.changeValue}
          changeLabel={metric.changeLabel}
          icon={metric.icon}
          iconColor={metric.iconColor}
          progress={metric.progress}
          goal={metric.goal}
        />
      ))}
    </div>
  );
}
