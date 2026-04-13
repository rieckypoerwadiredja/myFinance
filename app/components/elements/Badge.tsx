import { cn } from "../../lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function Badge({ children, className }: Props) {
  return <span className={cn(className)}>{children}</span>;
}
