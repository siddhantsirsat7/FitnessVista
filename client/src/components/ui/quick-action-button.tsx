import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuickActionButtonProps {
  icon: string;
  label: string;
  iconColor: "primary" | "success" | "warning";
  onClick: () => void;
}

export function QuickActionButton({
  icon,
  label,
  iconColor,
  onClick,
}: QuickActionButtonProps) {
  const getIconBackground = () => {
    if (iconColor === "primary") return "bg-primary/10";
    if (iconColor === "success") return "bg-emerald-500/20";
    if (iconColor === "warning") return "bg-amber-500/20";
    return "bg-gray-100";
  };

  const getIconColor = () => {
    if (iconColor === "primary") return "text-primary";
    if (iconColor === "success") return "text-emerald-500";
    if (iconColor === "warning") return "text-amber-500";
    return "text-gray-500";
  };

  return (
    <button
      onClick={onClick}
      className="bg-gray-50 hover:bg-gray-100 rounded-xl p-4 transition duration-150 focus:outline-none focus:ring-2 focus:ring-primary w-full"
    >
      <div
        className={cn(
          "rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-2",
          getIconBackground()
        )}
      >
        <i className={cn("text-xl", icon, getIconColor())}></i>
      </div>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </button>
  );
}
