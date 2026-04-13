import { cn } from "../../lib/utils";

type Props = {
  title: React.ReactNode;
  description?: React.ReactNode;
  rightSlot?: React.ReactNode;
  className?: string;
  titleClassName?: string;
};

export default function SectionHeader({
  title,
  description,
  rightSlot,
  className,
  titleClassName,
}: Props) {
  return (
    <div className={cn("flex justify-between items-center", className)}>
      <div>
        <h2 className={cn("text-xl font-bold", titleClassName)}>{title}</h2>
        {description ? (
          <p className="text-xs text-on-surface-variant font-medium">
            {description}
          </p>
        ) : null}
      </div>
      {rightSlot ? <div>{rightSlot}</div> : null}
    </div>
  );
}
