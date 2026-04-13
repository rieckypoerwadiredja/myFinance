import { cn } from "../../lib/utils";

type Props = {
  label: React.ReactNode;
  value: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  labelClassName?: string;
  valueClassName?: string;
};

export default function StatCard({
  label,
  value,
  footer,
  className,
  labelClassName,
  valueClassName,
}: Props) {
  return (
    <div className={cn("flex flex-col h-full", className)}>
      <span
        className={cn(
          "text-on-surface-variant font-medium text-sm",
          labelClassName,
        )}
      >
        {label}
      </span>
      <div className={cn("text-3xl font-bold text-on-surface mt-1", valueClassName)}>
        {value}
      </div>
      {footer ? <div className="mt-auto pt-4">{footer}</div> : null}
    </div>
  );
}
