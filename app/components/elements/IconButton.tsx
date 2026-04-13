import { cn } from "../../lib/utils";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function IconButton({ className, type, ...props }: Props) {
  return (
    <button
      type={type ?? "button"}
      className={cn(
        "p-1.5 rounded-lg transition-colors",
        className,
      )}
      {...props}
    />
  );
}
