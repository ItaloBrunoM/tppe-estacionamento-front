import "./DashboardMetricCard.css";

interface DashboardMetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  className?: string;
}

export function DashboardMetricCard({
  title,
  value,
  description,
  className,
}: DashboardMetricCardProps) {
  return (
    <div className={`metric-card ${className || ""}`}>
      <h3>{title}</h3>
      <p>{value}</p>
      {description && <span>{description}</span>}
    </div>
  );
}
