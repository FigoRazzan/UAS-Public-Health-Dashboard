import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string;
  trend?: {
    direction: "up" | "down";
    value: string;
  };
  icon: LucideIcon;
  variant?: "primary" | "success" | "warning" | "danger";
}

export function KPICard({ title, value, trend, icon: Icon, variant = "primary" }: KPICardProps) {
  const variantStyles = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    danger: "bg-danger/10 text-danger",
  };

  return (
    <Card className="transition-all hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="mt-2 flex items-baseline gap-2">
              <h3 className="text-3xl font-bold text-foreground">{value}</h3>
              {trend && (
                <div
                  className={cn(
                    "flex items-center gap-1 text-sm font-medium",
                    trend.direction === "up" ? "text-danger" : "text-success"
                  )}
                >
                  {trend.direction === "up" ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span>{trend.value}</span>
                </div>
              )}
            </div>
          </div>
          <div className={cn("rounded-full p-3", variantStyles[variant])}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
