"use client";

import { motion } from "motion/react";
import { cn } from "../../lib/utils";

type Props = {
  value: number;
  className?: string;
  trackClassName?: string;
  barClassName?: string;
};

export default function ProgressBar({
  value,
  className,
  trackClassName,
  barClassName,
}: Props) {
  return (
    <div className={cn("h-2 w-full rounded-full overflow-hidden", className, trackClassName)}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        className={cn("h-full rounded-full", barClassName)}
      />
    </div>
  );
}
